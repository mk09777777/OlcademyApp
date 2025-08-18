const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Tiffin = require("../models/Tiffin");
const { authenticateToken } = require("../controller/DashboardToken/JWT");
const historyLogRecorder = require("../utils/historyLogRecorder.js");

// const defaultTaxes = [
//   { name: "GST", rate: 5, isApplicable: true, isDefault: true },
//   { name: "Service Tax", rate: 2.5, isApplicable: false, isDefault: true },
//   {
//     name: "Local Municipal Tax",
//     rate: 1,
//     isApplicable: false,
//     isDefault: true,
//   },
// ];

router.post("/add-taxes", authenticateToken, async (req, res) => {
  const { name, rate, isApplicable } = req.body;
  const email = req.user.email;
  let tiffinId = null;
  try {
    if (!email || !name || rate == null) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add tax with missing required fields (email, name, rate). Email: ${
          email || "N/A"
        }`
      );
      return res
        .status(400)
        .json({ error: "Email, name, and rate are required." });
    }

    let tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add tax for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    // let defaultsInitialized = false;
    // if (!tiffin.tax || tiffin.tax.length === 0) {
    //   tiffin.tax = [...defaultTaxes];
    //   defaultsInitialized = true;
    // }
    const existingCustomTax = tiffin.tax.find(
      (tax) => !tax.isDefault && tax.name.toLowerCase() === name.toLowerCase()
    );
    if (existingCustomTax) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to add duplicate custom tax name '${name}' to Tiffin ID ${tiffinId}`
      );
      return res.status(400).json({
        error: `A custom tax with the name '${name}' already exists.`,
      });
    }
    const newTax = {
      name,
      rate: parseFloat(rate),
      isApplicable: isApplicable ?? true,
      isDefault: false,
    };

    tiffin.tax.push(newTax);
    await tiffin.save();

    const addedTax = tiffin.tax[tiffin.tax.length - 1]; // Get the added tax with its _id

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Added new custom tax '${addedTax.name}' (TaxID: ${
        addedTax._id
      }) to Tiffin '${tiffin.tiffinName || tiffinId}'. ${""}`
    );

    res.status(201).json(addedTax);
  } catch (error) {
    console.error("Add tax error:", error);
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error adding tax (Name: ${
        name || "N/A"
      }) for Tiffin (Owner: ${email}): ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-taxes/email", authenticateToken, async (req, res) => {
  const email = req.user.email;
  let tiffinId = null;
  try {
    let tiffin = await Tiffin.findOne({ ownerMail: email }).lean();
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Attempted to get taxes for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    let taxes = tiffin.tax;
    let defaultsInitialized = false;
    if (!taxes || taxes.length === 0) {
      console.warn(
        `Tiffin ${tiffinId} had no taxes, returning defaults. Consider initializing on creation.`
      );
    }

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [tiffinId],
      `Retrieved taxes (${taxes.length}) for Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId}). ${
        defaultsInitialized ? "(Defaults initialized/returned)" : ""
      }`
    );

    res.status(200).json(taxes);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      tiffinId ? [tiffinId] : [],
      `Error retrieving taxes for Tiffin (Owner: ${email}): ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-taxes/:id/email", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const taxId = req.params.id;
  let tiffinId = null;
  let taxName = "Unknown";
  try {
    if (!mongoose.Types.ObjectId.isValid(taxId)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted tax update with invalid Tax ID format: ${taxId} (Owner: ${email})`
      );
      return res.status(400).json({ message: "Invalid Tax ID format." });
    }

    const { name, rate, isApplicable } = req.body;
    // Basic validation
    if (
      name === undefined &&
      rate === undefined &&
      isApplicable === undefined
    ) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted tax update (TaxID: ${taxId}, Owner: ${email}) with no update fields provided.`
      );
      return res.status(400).json({
        error:
          "At least one field (name, rate, isApplicable) must be provided for update.",
      });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to update tax for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    const taxIndex = tiffin.tax.findIndex(
      (tax) => tax._id.toString() === taxId
    );
    if (taxIndex === -1) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to update non-existent tax ID ${taxId} within Tiffin ID ${tiffinId}`
      );
      return res
        .status(404)
        .json({ message: "Tax not found within this Tiffin service." });
    }

    const existingTax = tiffin.tax[taxIndex];
    taxName = existingTax.name; // Store for logging

    // Prepare updates based on whether it's default or custom
    if (existingTax.isDefault) {
      // Only allow updating isApplicable for default taxes
      if (isApplicable !== undefined) {
        tiffin.tax[taxIndex].isApplicable = !!isApplicable; // Ensure boolean
        tiffin.tax[taxIndex].updatedAt = Date.now(); // Manual update if needed
      } else {
        // No valid fields to update for default tax
        return res.status(400).json({
          error: "Only 'isApplicable' can be updated for default taxes.",
        });
      }
    } else {
      // Allow updating name, rate, isApplicable for custom taxes
      if (name !== undefined) tiffin.tax[taxIndex].name = name;
      if (rate !== undefined) tiffin.tax[taxIndex].rate = parseFloat(rate);
      if (isApplicable !== undefined)
        tiffin.tax[taxIndex].isApplicable = !!isApplicable;
      tiffin.tax[taxIndex].updatedAt = Date.now(); // Manual update if needed
    }

    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Updated tax '${
        tiffin.tax[taxIndex].name
      }' (TaxID: ${taxId}) within Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId})`
    );

    res.status(200).json(tiffin.tax[taxIndex]);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error updating tax '${taxName}' (TaxID: ${taxId}) for Tiffin (Owner: ${email}): ${error.message}`
    );
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

// Delete custom tax details for a specific Tiffin
router.delete(
  "/delete-taxes/:id/email",
  authenticateToken,
  async (req, res) => {
    const email = req.user.email;
    const taxId = req.params.id;
    let tiffinId = null;
    let taxName = "Unknown";
    try {
      if (!mongoose.Types.ObjectId.isValid(taxId)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE", // Action is UPDATE as we modify the Tiffin doc
          [],
          `Attempted tax deletion with invalid Tax ID format: ${taxId} (Owner: ${email})`
        );
        return res.status(400).json({ message: "Invalid Tax ID format." });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted to delete tax for non-existent Tiffin (Owner: ${email})`
        );
        return res
          .status(404)
          .json({ message: "Tiffin service not found for this owner." });
      }
      tiffinId = tiffin._id;

      const taxToDelete = tiffin.tax.find(
        (tax) => tax._id.toString() === taxId
      );
      if (!taxToDelete) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to delete non-existent tax ID ${taxId} within Tiffin ID ${tiffinId}`
        );
        return res
          .status(404)
          .json({ message: "Tax not found within this Tiffin service." });
      }
      taxName = taxToDelete.name; // Store for logging

      // Prevent deletion of default taxes
      if (taxToDelete.isDefault) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to delete default tax '${taxName}' (TaxID: ${taxId}) from Tiffin ID ${tiffinId}. Forbidden.`
        );
        return res
          .status(403)
          .json({ message: "Default taxes cannot be deleted." });
      }

      // Remove only non-default tax using $pull for atomic operation
      const updateResult = await Tiffin.updateOne(
        { _id: tiffinId },
        { $pull: { tax: { _id: new mongoose.Types.ObjectId(taxId) } } }
      );

      if (updateResult.modifiedCount === 0) {
        // This might happen if the tax was already removed between find and update, though unlikely here
        console.warn(
          `Tax ${taxId} was not found during $pull operation for Tiffin ${tiffinId}, though found earlier.`
        );
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to delete tax '${taxName}' (TaxID: ${taxId}) from Tiffin ID ${tiffinId}, but it was not found during removal.`
        );
        return res.status(404).json({
          message: "Tax could not be removed (may have been deleted already).",
        });
      }

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Deleted custom tax '${taxName}' (TaxID: ${taxId}) from Tiffin '${
          tiffin.tiffinName || tiffinId
        }' (ID: ${tiffinId})`
      );

      res.status(200).json({ message: "Tax deleted successfully" });
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error deleting tax '${taxName}' (TaxID: ${taxId}) for Tiffin (Owner: ${email}): ${error.message}`
      );
      res.status(500).json({ error: error.message });
    }
  }
);

// --- Charges Routes ---

// const predefinedCharges = [
//   {
//     name: "Service Fee",
//     type: "percentage",
//     value: 5,
//     isApplicable: true,
//     isDefault: true,
//   },
//   {
//     name: "Packaging Fee (Per 1 Meal Type)",
//     type: "flat",
//     value: 10,
//     isApplicable: true,
//     isDefault: true,
//   },
//   {
//     name: "Convenience Fee",
//     type: "percentage",
//     value: 2,
//     isApplicable: false,
//     isDefault: true,
//   },
//   {
//     name: "Handling Charges",
//     type: "flat",
//     value: 15,
//     isApplicable: true,
//     isDefault: true,
//   },
// ];

// Add a new custom charge
router.post("/add-charges", authenticateToken, async (req, res) => {
  const { name, value, isApplicable, type } = req.body;
  const email = req.user.email;
  let tiffinId = null;
  try {
    if (!email || !name || value == null || !type) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add charge with missing required fields (email, name, value, type). Email: ${
          email || "N/A"
        }`
      );
      return res
        .status(400)
        .json({ error: "Email, name, value, and type are required." });
    }
    if (!["percentage", "flat"].includes(type)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add charge with invalid type '${type}' (Owner: ${email})`
      );
      return res
        .status(400)
        .json({ error: "Charge type must be 'percentage' or 'flat'." });
    }

    let tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add charge for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    let defaultsInitialized = false;
    // Initialize charges array if it doesn't exist
    if (!tiffin.charges || tiffin.charges.length === 0) {
      defaultsInitialized = true;
    }

    // Check if custom charge with the same name already exists
    const existingCustomCharge = tiffin.charges.find(
      (charge) =>
        !charge.isDefault && charge.name.toLowerCase() === name.toLowerCase()
    );
    if (existingCustomCharge) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to add duplicate custom charge name '${name}' to Tiffin ID ${tiffinId}`
      );
      return res.status(400).json({
        error: `A custom charge with the name '${name}' already exists.`,
      });
    }

    const newCharge = {
      name,
      value: parseFloat(value), // Ensure value is a number
      type,
      isApplicable: isApplicable ?? true,
      isDefault: false,
    };

    tiffin.charges.push(newCharge);
    await tiffin.save();

    const addedCharge = tiffin.charges[tiffin.charges.length - 1];

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Added new custom charge '${addedCharge.name}' (ChargeID: ${
        addedCharge._id
      }) to Tiffin '${tiffin.tiffinName || tiffinId}'. ${
        defaultsInitialized ? "(Defaults also initialized)" : ""
      }`
    );

    res.status(201).json(addedCharge);
  } catch (error) {
    console.error("Add charge error:", error);
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error adding charge (Name: ${
        name || "N/A"
      }) for Tiffin (Owner: ${email}): ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
});

// Get charge details for a specific Tiffin
router.get("/get-charges/email", authenticateToken, async (req, res) => {
  const email = req.user.email;
  let tiffinId = null;
  try {
    let tiffin = await Tiffin.findOne({ ownerMail: email }).lean();
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Attempted to get charges for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    let charges = tiffin.charges;
    let defaultsInitialized = false;
    // Initialize with default charges if none exist (again, avoid save in GET)
    if (!charges || charges.length === 0) {
      // await Tiffin.updateOne({ _id: tiffinId }, { $set: { charges: predefinedCharges } });
      // defaultsInitialized = true;
      console.warn(
        `Tiffin ${tiffinId} had no charges, returning defaults. Consider initializing on creation.`
      );
    }

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [tiffinId],
      `Retrieved charges (${charges.length}) for Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId}). ${
        defaultsInitialized ? "(Defaults initialized/returned)" : ""
      }`
    );

    res.status(200).json(charges);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      tiffinId ? [tiffinId] : [],
      `Error retrieving charges for Tiffin (Owner: ${email}): ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
});

// Update charges details for a specific Tiffin charge subdocument
router.put("/update-charges/:id/email", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const chargeId = req.params.id;
  let tiffinId = null;
  let chargeName = "Unknown";
  try {
    if (!mongoose.Types.ObjectId.isValid(chargeId)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted charge update with invalid Charge ID format: ${chargeId} (Owner: ${email})`
      );
      return res.status(400).json({ message: "Invalid Charge ID format." });
    }

    const { name, value, isApplicable, type } = req.body;
    // Basic validation
    if (
      name === undefined &&
      value === undefined &&
      isApplicable === undefined &&
      type === undefined
    ) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted charge update (ChargeID: ${chargeId}, Owner: ${email}) with no update fields provided.`
      );
      return res.status(400).json({
        error:
          "At least one field (name, value, type, isApplicable) must be provided for update.",
      });
    }
    if (type && !["percentage", "flat"].includes(type)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to update charge (ChargeID: ${chargeId}, Owner: ${email}) with invalid type '${type}'.`
      );
      return res
        .status(400)
        .json({ error: "Charge type must be 'percentage' or 'flat'." });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to update charge for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    const chargeIndex = tiffin.charges.findIndex(
      (charge) => charge._id.toString() === chargeId
    );
    if (chargeIndex === -1) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to update non-existent charge ID ${chargeId} within Tiffin ID ${tiffinId}`
      );
      return res
        .status(404)
        .json({ message: "Charge not found within this Tiffin service." });
    }

    const existingCharge = tiffin.charges[chargeIndex];
    chargeName = existingCharge.name;

    // Update fields: Allow updating all fields for both default and custom charges in this case
    // If logic needs to differ (like only isApplicable for default), add the if(existingCharge.isDefault) block here.
    if (name !== undefined) tiffin.charges[chargeIndex].name = name;
    if (value !== undefined)
      tiffin.charges[chargeIndex].value = parseFloat(value);
    if (type !== undefined) tiffin.charges[chargeIndex].type = type;
    if (isApplicable !== undefined)
      tiffin.charges[chargeIndex].isApplicable = !!isApplicable;
    tiffin.charges[chargeIndex].updatedAt = Date.now(); // Manual update if needed

    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Updated charge '${
        tiffin.charges[chargeIndex].name
      }' (ChargeID: ${chargeId}) within Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId})`
    );

    res.status(200).json(tiffin.charges[chargeIndex]);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error updating charge '${chargeName}' (ChargeID: ${chargeId}) for Tiffin (Owner: ${email}): ${error.message}`
    );
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

// Delete custom charge details for a specific Tiffin
router.delete(
  "/delete-charges/:id/email",
  authenticateToken,
  async (req, res) => {
    const email = req.user.email;
    const chargeId = req.params.id;
    let tiffinId = null;
    let chargeName = "Unknown";
    try {
      if (!mongoose.Types.ObjectId.isValid(chargeId)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE", // Action is UPDATE as we modify the Tiffin doc
          [],
          `Attempted charge deletion with invalid Charge ID format: ${chargeId} (Owner: ${email})`
        );
        return res.status(400).json({ message: "Invalid Charge ID format." });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted to delete charge for non-existent Tiffin (Owner: ${email})`
        );
        return res
          .status(404)
          .json({ message: "Tiffin service not found for this owner." });
      }
      tiffinId = tiffin._id;

      const chargeToDelete = tiffin.charges.find(
        (charge) => charge._id.toString() === chargeId
      );
      if (!chargeToDelete) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to delete non-existent charge ID ${chargeId} within Tiffin ID ${tiffinId}`
        );
        return res
          .status(404)
          .json({ message: "Charge not found within this Tiffin service." }); // Changed message slightly
      }
      chargeName = chargeToDelete.name;

      // Prevent deletion of default charges
      if (chargeToDelete.isDefault) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to delete default charge '${chargeName}' (ChargeID: ${chargeId}) from Tiffin ID ${tiffinId}. Forbidden.`
        );
        return res
          .status(403)
          .json({ message: "Default charges cannot be deleted." });
      }

      // Remove only non-default charge using $pull
      const updateResult = await Tiffin.updateOne(
        { _id: tiffinId },
        { $pull: { charges: { _id: new mongoose.Types.ObjectId(chargeId) } } }
      );

      if (updateResult.modifiedCount === 0) {
        console.warn(
          `Charge ${chargeId} was not found during $pull operation for Tiffin ${tiffinId}, though found earlier.`
        );
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to delete charge '${chargeName}' (ChargeID: ${chargeId}) from Tiffin ID ${tiffinId}, but it was not found during removal.`
        );
        return res.status(404).json({
          message:
            "Charge could not be removed (may have been deleted already).",
        });
      }

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Deleted custom charge '${chargeName}' (ChargeID: ${chargeId}) from Tiffin '${
          tiffin.tiffinName || tiffinId
        }' (ID: ${tiffinId})`
      );

      res.status(200).json({ message: "Charge deleted successfully" }); // Changed message slightly
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error deleting charge '${chargeName}' (ChargeID: ${chargeId}) for Tiffin (Owner: ${email}): ${error.message}`
      );
      res.status(500).json({ error: error.message });
    }
  }
);

// --- Delivery Ranges Routes ---

// Get all delivery ranges for a tiffin owner
router.get("/delivery-ranges/email", authenticateToken, async (req, res) => {
  const email = req.user.email;
  let tiffinId = null;
  try {
    const tiffin = await Tiffin.findOne({ ownerMail: email }).lean(); // Use lean
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Attempted to get delivery ranges for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    // Sort ranges before sending, ensure deliveryCharge array exists
    const ranges = (tiffin.deliveryCharge || []).sort(
      (a, b) => a.minDistance - b.minDistance
    );

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [tiffinId],
      `Retrieved delivery ranges (${ranges.length}) for Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId})`
    );

    res.json(ranges);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      tiffinId ? [tiffinId] : [],
      `Error retrieving delivery ranges for Tiffin (Owner: ${email}): ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
});

// Add a new delivery range
router.post("/delivery-ranges", authenticateToken, async (req, res) => {
  const { minDistance, maxDistance, charge } = req.body;
  const email = req.user.email;
  let tiffinId = null;
  try {
    // Validation
    if (
      email === undefined ||
      minDistance === undefined ||
      maxDistance === undefined ||
      charge === undefined
    ) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add delivery range with missing fields. Email: ${
          email || "N/A"
        }`
      );
      return res.status(400).json({
        message: "Email, minDistance, maxDistance, and charge are required.",
      });
    }
    if (parseFloat(minDistance) >= parseFloat(maxDistance)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add delivery range where minDistance >= maxDistance (Owner: ${email})`
      );
      return res.status(400).json({
        message: "Minimum distance must be less than maximum distance.",
      });
    }
    if (
      parseFloat(minDistance) < 0 ||
      parseFloat(maxDistance) <= 0 ||
      parseFloat(charge) < 0
    ) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add delivery range with negative values (Owner: ${email})`
      );
      return res
        .status(400)
        .json({ message: "Distances and charge cannot be negative." });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to add delivery range for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    // Ensure deliveryCharge array exists
    if (!tiffin.deliveryCharge) tiffin.deliveryCharge = [];

    // Check for overlapping ranges more carefully
    const numMinDistance = parseFloat(minDistance);
    const numMaxDistance = parseFloat(maxDistance);
    const overlapping = tiffin.deliveryCharge.some(
      (range) =>
        numMinDistance < range.maxDistance && numMaxDistance > range.minDistance // Strict overlap check
    );

    if (overlapping) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to add overlapping delivery range (${numMinDistance}-${numMaxDistance} km) to Tiffin ID ${tiffinId}`
      );
      return res.status(400).json({
        message:
          "This range overlaps with an existing delivery range. Please adjust distances.",
      });
    }

    // Add the new range
    const newRange = {
      minDistance: numMinDistance,
      maxDistance: numMaxDistance,
      charge: parseFloat(charge),
      isActive: true,
    };
    tiffin.deliveryCharge.push(newRange);
    await tiffin.save();

    const addedRange = tiffin.deliveryCharge[tiffin.deliveryCharge.length - 1];

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Added new delivery range (${addedRange.minDistance}-${
        addedRange.maxDistance
      } km, Charge: ${addedRange.charge}, RangeID: ${
        addedRange._id
      }) to Tiffin '${tiffin.tiffinName || tiffinId}' (ID: ${tiffinId})`
    );

    // Return the updated list of ranges, sorted
    res
      .status(201)
      .json(
        tiffin.deliveryCharge.sort((a, b) => a.minDistance - b.minDistance)
      );
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error adding delivery range (${minDistance}-${maxDistance} km) for Tiffin (Owner: ${email}): ${error.message}`
    );
    // Check for validation error specifically
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Update a specific delivery range
router.put("/delivery-ranges/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Range ID
  const { minDistance, maxDistance, charge } = req.body; // Tiffin email needed to find the parent doc
  const email = req.user.email;
  let tiffinId = null;
  let rangeDesc = `RangeID: ${id}`; // For logging context
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted delivery range update with invalid Range ID format: ${id} (Owner: ${
          email || "N/A"
        })`
      );
      return res
        .status(400)
        .json({ message: "Invalid Delivery Range ID format." });
    }
    if (
      email === undefined ||
      minDistance === undefined ||
      maxDistance === undefined ||
      charge === undefined
    ) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted delivery range update (RangeID: ${id}) with missing fields. Email: ${
          email || "N/A"
        }`
      );
      return res.status(400).json({
        message:
          "Email, minDistance, maxDistance, and charge are required for update.",
      });
    }
    if (parseFloat(minDistance) >= parseFloat(maxDistance)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted delivery range update (RangeID: ${id}) where minDistance >= maxDistance (Owner: ${email})`
      );
      return res.status(400).json({
        message: "Minimum distance must be less than maximum distance.",
      });
    }
    if (
      parseFloat(minDistance) < 0 ||
      parseFloat(maxDistance) <= 0 ||
      parseFloat(charge) < 0
    ) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted delivery range update (RangeID: ${id}) with negative values (Owner: ${email})`
      );
      return res
        .status(400)
        .json({ message: "Distances and charge cannot be negative." });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to update delivery range for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    const rangeIndex = tiffin.deliveryCharge.findIndex(
      (range) => range._id.toString() === id
    );
    if (rangeIndex === -1) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to update non-existent delivery range ID ${id} within Tiffin ID ${tiffinId}`
      );
      return res
        .status(404)
        .json({ message: "Delivery range not found for this Tiffin service." });
    }

    const existingRange = tiffin.deliveryCharge[rangeIndex];
    rangeDesc = `${existingRange.minDistance}-${existingRange.maxDistance} km`; // Update context

    const numMinDistance = parseFloat(minDistance);
    const numMaxDistance = parseFloat(maxDistance);
    const numCharge = parseFloat(charge);

    // Check for overlapping ranges, ignoring the current range being edited
    const overlapping = tiffin.deliveryCharge.some(
      (range) =>
        range._id.toString() !== id &&
        numMinDistance < range.maxDistance &&
        numMaxDistance > range.minDistance
    );

    if (overlapping) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to update delivery range (RangeID: ${id}) to overlap (${numMinDistance}-${numMaxDistance} km) within Tiffin ID ${tiffinId}`
      );
      return res.status(400).json({
        message:
          "This updated range overlaps with another existing delivery range.",
      });
    }

    // Update the range in the array
    tiffin.deliveryCharge[rangeIndex].minDistance = numMinDistance;
    tiffin.deliveryCharge[rangeIndex].maxDistance = numMaxDistance;
    tiffin.deliveryCharge[rangeIndex].charge = numCharge;
    // isActive status is typically toggled separately, keep existing or default to true if needed
    // tiffin.deliveryCharge[rangeIndex].isActive = true;
    tiffin.deliveryCharge[rangeIndex].updatedAt = Date.now(); // Manual update if needed

    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Updated delivery range (RangeID: ${id}, New: ${numMinDistance}-${numMaxDistance} km, Charge: ${numCharge}) within Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId})`
    );

    res.json(tiffin.deliveryCharge[rangeIndex]);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error updating delivery range '${rangeDesc}' (RangeID: ${id}) for Tiffin (Owner: ${email}): ${error.message}`
    );
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Delete a delivery range
router.delete(
  "/delivery-ranges/:id/email",
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    const email = req.user.email;
    let tiffinId = null;
    let rangeDesc = `RangeID: ${id}`;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE", // Action is UPDATE as we modify the Tiffin doc
          [],
          `Attempted delivery range deletion with invalid Range ID format: ${id} (Owner: ${email})`
        );
        return res
          .status(400)
          .json({ message: "Invalid Delivery Range ID format." });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted to delete delivery range for non-existent Tiffin (Owner: ${email})`
        );
        return res
          .status(404)
          .json({ message: "Tiffin service not found for this owner." });
      }
      tiffinId = tiffin._id;

      const rangeToDelete = tiffin.deliveryCharge.find(
        (range) => range._id.toString() === id
      );
      if (!rangeToDelete) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to delete non-existent delivery range ID ${id} within Tiffin ID ${tiffinId}`
        );
        return res
          .status(404)
          .json({
            message: "Delivery range not found for this Tiffin service.",
          });
      }
      rangeDesc = `${rangeToDelete.minDistance}-${rangeToDelete.maxDistance} km`; // Store for logging

      // Remove using $pull for atomic operation
      const updateResult = await Tiffin.updateOne(
        { _id: tiffinId },
        { $pull: { deliveryCharge: { _id: new mongoose.Types.ObjectId(id) } } }
      );

      if (updateResult.modifiedCount === 0) {
        console.warn(
          `Delivery Range ${id} was not found during $pull operation for Tiffin ${tiffinId}, though found earlier.`
        );
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to delete delivery range '${rangeDesc}' (RangeID: ${id}) from Tiffin ID ${tiffinId}, but it was not found during removal.`
        );
        return res.status(404).json({
          message:
            "Delivery range could not be removed (may have been deleted already).",
        });
      }

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Deleted delivery range '${rangeDesc}' (RangeID: ${id}) from Tiffin '${
          tiffin.tiffinName || tiffinId
        }' (ID: ${tiffinId})`
      );

      res.json({ message: "Delivery range deleted successfully" });
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error deleting delivery range '${rangeDesc}' (RangeID: ${id}) for Tiffin (Owner: ${email}): ${error.message}`
      );
      res.status(500).json({ message: error.message });
    }
  }
);

// Toggle delivery range status
router.patch(
  "/delivery-ranges/:id/email",
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    const email = req.user.email;
    const { isActive } = req.body;
    let tiffinId = null;
    let rangeDesc = `RangeID: ${id}`;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted delivery range status toggle with invalid Range ID format: ${id} (Owner: ${email})`
        );
        return res
          .status(400)
          .json({ message: "Invalid Delivery Range ID format." });
      }
      if (isActive === undefined || typeof isActive !== "boolean") {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted delivery range status toggle (RangeID: ${id}, Owner: ${email}) with missing or invalid 'isActive' field.`
        );
        return res.status(400).json({
          message:
            "A boolean 'isActive' field is required in the request body.",
        });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted to toggle delivery range status for non-existent Tiffin (Owner: ${email})`
        );
        return res
          .status(404)
          .json({ message: "Tiffin service not found for this owner." });
      }
      tiffinId = tiffin._id;

      const rangeIndex = tiffin.deliveryCharge.findIndex(
        (range) => range._id.toString() === id
      );
      if (rangeIndex === -1) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to toggle status for non-existent delivery range ID ${id} within Tiffin ID ${tiffinId}`
        );
        return res
          .status(404)
          .json({
            message: "Delivery range not found for this Tiffin service.",
          });
      }

      rangeDesc = `${tiffin.deliveryCharge[rangeIndex].minDistance}-${tiffin.deliveryCharge[rangeIndex].maxDistance} km`;

      // Update the isActive status
      tiffin.deliveryCharge[rangeIndex].isActive = isActive;
      tiffin.deliveryCharge[rangeIndex].updatedAt = Date.now(); // Manual update if needed

      await tiffin.save();

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Toggled status for delivery range '${rangeDesc}' (RangeID: ${id}) to ${
          isActive ? "Active" : "Inactive"
        } within Tiffin '${tiffin.tiffinName || tiffinId}' (ID: ${tiffinId})`
      );

      res.json(tiffin.deliveryCharge[rangeIndex]);
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error toggling status for delivery range '${rangeDesc}' (RangeID: ${id}) for Tiffin (Owner: ${email}): ${error.message}`
      );
      const statusCode = error.name === "ValidationError" ? 400 : 500;
      res.status(statusCode).json({ message: error.message });
    }
  }
);

// Bulk create/update delivery ranges (Replaces existing)
router.post("/delivery-ranges/bulk", authenticateToken, async (req, res) => {
  const { ranges } = req.body;
  const email = req.user.email;
  let tiffinId = null;
  try {
    if (!email || !Array.isArray(ranges)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted bulk delivery range update with missing email or invalid ranges array. Email: ${
          email || "N/A"
        }`
      );
      return res
        .status(400)
        .json({ message: "Email and a 'ranges' array are required." });
    }

    // Add validation for each range in the array here if needed (overlap, min < max, etc.)

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted bulk delivery range update for non-existent Tiffin (Owner: ${email})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    // Replace the entire deliveryCharge array
    // Ensure data types are correct and add isActive default
    tiffin.deliveryCharge = ranges.map((range) => ({
      minDistance: parseFloat(range.minDistance),
      maxDistance: parseFloat(range.maxDistance),
      charge: parseFloat(range.charge),
      isActive: range.isActive === undefined ? true : !!range.isActive, // Default isActive to true
      // Mongoose will add _id automatically
    }));
    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Bulk updated/replaced delivery ranges (${
        tiffin.deliveryCharge.length
      } ranges) for Tiffin '${tiffin.tiffinName || tiffinId}' (ID: ${tiffinId})`
    );

    res.status(200).json(tiffin.deliveryCharge); // Return 200 OK for replacement
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error during bulk delivery range update for Tiffin (Owner: ${email}): ${error.message}`
    );
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Calculate delivery fee for a given distance
router.get(
  "/delivery-ranges/calculate/email/:distance",
  authenticateToken,
  async (req, res) => {
    const { distance } = req.params;
    const email = req.user.email;
    let tiffinId = null;
    try {
      const parsedDistance = parseFloat(distance);
      if (isNaN(parsedDistance) || parsedDistance < 0) {
        historyLogRecorder(
          req,
          "Tiffin",
          "READ",
          [],
          `Attempted delivery fee calculation with invalid distance '${distance}' (Owner: ${email})`
        );
        return res
          .status(400)
          .json({ message: "Invalid or negative distance provided." });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email }).lean(); // Use lean
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "READ",
          [],
          `Attempted delivery fee calculation for non-existent Tiffin (Owner: ${email})`
        );
        return res
          .status(404)
          .json({ message: "Tiffin service not found for this owner." });
      }
      tiffinId = tiffin._id;

      // Ensure deliveryCharge exists and is an array before finding
      const deliveryRanges = tiffin.deliveryCharge || [];

      const applicableRange = deliveryRanges.find(
        (range) =>
          range.isActive && // Only consider active ranges
          range.minDistance <= parsedDistance &&
          range.maxDistance >= parsedDistance
      );

      if (!applicableRange) {
        historyLogRecorder(
          req,
          "Tiffin",
          "READ",
          [tiffinId],
          `No applicable delivery range found for distance ${parsedDistance}km for Tiffin ID ${tiffinId}`
        );
        return res.status(404).json({
          message: `No active delivery range found for distance ${parsedDistance} km.`,
        });
      }

      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [tiffinId],
        `Calculated delivery fee for Tiffin '${
          tiffin.tiffinName || tiffinId
        }' (ID: ${tiffinId}) at distance ${parsedDistance}km. Found range: ${
          applicableRange.minDistance
        }-${applicableRange.maxDistance}km, Fee: ${applicableRange.charge}`
      );

      res.json({
        distance: parsedDistance,
        deliveryFee: applicableRange.charge,
      });
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        tiffinId ? [tiffinId] : [],
        `Error calculating delivery fee for distance ${distance} (Owner: ${email}): ${error.message}`
      );
      // Use 400 for potential parsing errors caught by catch, 500 otherwise
      const statusCode = error instanceof TypeError ? 400 : 500;
      res.status(statusCode).json({ message: error.message });
    }
  }
);

module.exports = router;
