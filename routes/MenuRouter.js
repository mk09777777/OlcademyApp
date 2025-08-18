const express = require("express");
const mongoose = require("mongoose");
const Tiffin = require("../models/Tiffin"); // Adjust path if necessary
const historyLogRecorder = require("../utils/historyLogRecorder.js");
const Notify = require("../models/logs/notify");
const router = express.Router();
const { authenticateToken } = require("../controller/DashboardToken/JWT");
// Create new tiffin details
router.post("/add-tiffin", async (req, res) => {
  let savedTiffinId = null;
  try {
    const {
      email,
      phone,
      tiffinName,
      category,
      address,
      operatingTimes,
      serviceClouserDay,
      additionalSettings,
    } = req.body;

    // // Original validation commented out - uncomment if needed
    // if (!email || !phone || !tiffinName || !category || !address || operatingTimes || serviceClouserDay || additionalSettings ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'All fields are required'
    //   });
    // }

    // Create new tiffin document
    const newTiffin = new Tiffin({
      kitchenName: tiffinName,
      ownerMail: email,
      ownerPhoneNo: {
        countryCode: phone?.countryCode, // Use optional chaining/defaults
        number: phone?.number,
        fullNumber: phone?.fullNumber,
      },
      category: Array.isArray(category) ? category : [category], // Ensure array
      address: address,
      operatingTimes: operatingTimes,
      serviceClouserDay: serviceClouserDay,
      freeDelivery: additionalSettings?.freeDelivery,
      specialMealDay: additionalSettings?.specialMealDay,
      deliveryCity: additionalSettings?.deliveryCity,
      specialEvents: additionalSettings?.specialEvents,
      houseParty: additionalSettings?.houseParty,
      catering: additionalSettings?.catering,
      menu: {
        // Provide default menu structure if applicable
        plans: [{ label: "Default Plan" }],
        mealTypes: [],
        instructions: [],
        serviceDays: [],
        isFlexibleDates: false,
      },
    });

    // Save to database
    const savedTiffin = await newTiffin.save();
    savedTiffinId = savedTiffin._id;

    historyLogRecorder(
      req,
      savedTiffin.constructor.modelName,
      "CREATE",
      [savedTiffinId],
      `Created new Tiffin service '${savedTiffin.kitchenName}' (ID: ${savedTiffinId})`
    );

    const newNotify = new Notify({
      timestamp: new Date(),
      level: "A Banner is updated",
      type: ["admin", "restaurant"],
      message: "A new Tiffin is updated ",
      metadata: {
        category: ["Restaurant"],
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    await newNotify.save();

    res.status(201).json({
      success: true,
      data: savedTiffin,
    });
  } catch (error) {
    let logMessage = `Error creating Tiffin: ${error.message}`;
    let statusCode = 500;
    // Handle duplicate key errors specifically
    if (error.code === 11000) {
      statusCode = 400;
      logMessage = `Attempted to create Tiffin with duplicate key (email/phone). Email: ${
        req.body.email || "N/A"
      }`;
    }
    historyLogRecorder(
      req,
      "Tiffin",
      "CREATE",
      savedTiffinId ? [savedTiffinId] : [],
      logMessage
    );
    console.error("Create Tiffin error:", error); // Keep console error for debugging
    res.status(statusCode).json({
      success: false,
      message:
        error.code === 11000
          ? "Email or phone number already exists"
          : "Server error",
      error: error.message,
    });
  }
});

// Get tiffin details by email
router.get("/tiffin/email", authenticateToken, async (req, res) => {
  const email = req.user.email;
  let tiffinId = null;
  try {
    const tiffin = await Tiffin.findOne({ ownerMail: email });

    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Tiffin details not found for owner email: ${email}`
      );
      return res.status(404).json({
        success: false,
        message: "Tiffin not found",
      });
    }
    tiffinId = tiffin._id;

    historyLogRecorder(
      req,
      "Tiffin", // Entity type is Tiffin
      "READ",
      [tiffinId],
      `Retrieved Tiffin details for '${
        tiffin.kitchenName || tiffinId
      }' (ID: ${tiffinId}) by email`
    );
    res.status(200).json({
      success: true,
      data: tiffin,
    });
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      tiffinId ? [tiffinId] : [], // Log ID if found before error
      `Error retrieving Tiffin by email ${email}: ${error.message}`
    );
    console.error("Get Tiffin by email error:", error); // Keep console error
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get tiffin details by id
router.get("/get-tiffin/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Attempted to get Tiffin with invalid ID format: ${id}`
      );
      return res
        .status(400)
        .json({ success: false, message: "Invalid Tiffin ID format." });
    }
    const tiffin = await Tiffin.findById(id);

    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [id],
        `Tiffin details not found for ID: ${id}`
      );
      return res.status(404).json({
        success: false,
        message: "Tiffin not found",
      });
    }

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [tiffin._id],
      `Retrieved Tiffin details for '${
        tiffin.kitchenName || tiffin._id
      }' (ID: ${tiffin._id})`
    );

    res.status(200).json({
      success: true, // Added success flag
      tiffin, // Return under 'tiffin' key
    });
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [id], // Log the ID that was attempted
      `Error retrieving Tiffin by ID ${id}: ${error.message}`
    );
    console.error("Get Tiffin by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get all tiffin details
router.get("/tiffin", async (req, res) => {
  try {
    const tiffins = await Tiffin.find(); // Use plural

    // Original code checked !tiffin, which would be true only if find() errored differently.
    // find() returns [] if none found, which is usually a success case.
    // Adding a check for empty array for logging completeness, but not sending 404.
    let logMessage = `Retrieved all Tiffin services (${tiffins.length} found)`;
    if (tiffins.length === 0) {
      logMessage = "Retrieved all Tiffin services (None found)";
    }

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      tiffins.map((t) => t._id),
      logMessage
    );

    res.status(200).json({
      success: true, // Added success flag
      tiffins, // Return array under 'tiffins' key
    });
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [],
      `Error retrieving all Tiffin services: ${error.message}`
    );
    console.error("Get all Tiffins error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.put("/tiffin/email", authenticateToken, async (req, res) => {
  const ownerMailParam = req.user.email;
  let tiffinId = null;
  let tiffinName = "Unknown";
  try {
    const {
      email,
      phone,
      tiffinName: kitchenName,
      category,
      address,
      operatingTimes,
      serviceClouserDay,
      additionalSettings,
      deliveryTimeSlots,
    } = req.body;

    // Prepare update data carefully
    const updateData = {};
    if (kitchenName !== undefined) updateData.kitchenName = kitchenName;
    if (email !== undefined) updateData.ownerMail = email;
    if (phone && phone.number !== undefined) {
      updateData.ownerPhoneNo = {
        countryCode: phone.countryCode || "",
        number: phone.number,
        fullNumber:
          phone.fullNumber || `${phone.countryCode || ""}${phone.number}`,
      };
    }
    if (category !== undefined)
      updateData.category = Array.isArray(category) ? category : [category];
    if (address !== undefined) updateData.address = address;
    if (operatingTimes !== undefined)
      updateData.operatingTimes = operatingTimes;
    if (serviceClouserDay !== undefined)
      updateData.serviceClouserDay = serviceClouserDay;
    if (additionalSettings) {
      // Check if additionalSettings object exists
      if (additionalSettings.freeDelivery !== undefined)
        updateData.freeDelivery = !!additionalSettings.freeDelivery;
      if (additionalSettings.specialMealDay !== undefined)
        updateData.specialMealDay = additionalSettings.specialMealDay;
      if (additionalSettings.deliveryCity !== undefined)
        updateData.deliveryCity = additionalSettings.deliveryCity;
      if (additionalSettings.specialEvents !== undefined)
        updateData.specialEvents = !!additionalSettings.specialEvents;
      if (additionalSettings.houseParty !== undefined)
        updateData.houseParty = !!additionalSettings.houseParty;
      if (additionalSettings.catering !== undefined)
        updateData.catering = !!additionalSettings.catering;
      if (deliveryTimeSlots !== undefined)
        updateData.deliveryTimeSlots = deliveryTimeSlots;
    }

    if (Object.keys(updateData).length === 0) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted Tiffin update for owner ${ownerMailParam} with no update data provided.`
      );
      const newNotify = new Notify({
        timestamp: new Date(),
        level: "A Tiffin is updated",
        type: ["admin", "restaurant"],
        message: `Attempted Tiffin update for owner ${ownerMailParam} with no update data provided.`,
        metadata: {
          category: ["Marketing"],
          isViewed: false,
          isAccept: false,
          isReject: false,
        },
      });
      await newNotify.save();

      return res
        .status(400)
        .json({ success: false, message: "No update data provided." });
    }

    const updatedTiffin = await Tiffin.findOneAndUpdate(
      { ownerMail: ownerMailParam },
      { $set: updateData }, // Use $set for safer partial updates
      { new: true, runValidators: true }
    );

    if (!updatedTiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [], // No ID found
        `Attempted to update non-existent Tiffin (Owner: ${ownerMailParam})`
      );
      return res.status(404).json({
        success: false,
        message: "Tiffin not found",
      });
    }
    tiffinId = updatedTiffin._id;
    tiffinName = updatedTiffin.kitchenName;

    historyLogRecorder(
      req,
      updatedTiffin.constructor.modelName,
      "UPDATE",
      [tiffinId],
      `Updated Tiffin details for '${tiffinName}' (ID: ${tiffinId})`
    );
    const newNotify = new Notify({
      timestamp: new Date(),
      level: "A Tiffin is updated",
      type: ["admin", "restaurant"],
      message: `Updated Tiffin details for '${tiffinName}' (ID: ${tiffinId}).`,
      metadata: {
        category: ["admin", "restaurant"],
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    await newNotify.save();

    res.status(200).json({
      success: true,
      data: updatedTiffin,
    });
  } catch (error) {
    let statusCode = 500;
    let logMessage = `Error updating Tiffin (Owner: ${ownerMailParam}): ${error.message}`;
    if (error.code === 11000) {
      statusCode = 400;
      logMessage = `Attempted Tiffin update for owner ${ownerMailParam} resulting in duplicate key: ${error.message}`;
    } else if (error.name === "ValidationError") {
      statusCode = 400;
      logMessage = `Validation error updating Tiffin (Owner: ${ownerMailParam}): ${error.message}`;
    }
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      logMessage
    );

    console.error("Update Tiffin error:", error);
    res.status(statusCode).json({
      success: false,
      message: error.message || "Server error", // Provide specific error message
      error: error.message,
    });
  }
});

// --- Menu Subdocument Routes ---

// Add a new Meal Plan
router.post("/add-plan/email", authenticateToken, async (req, res) => {
  const { label } = req.body;
  const email = req.user.email;
  let tiffinId = null;
  try {
    if (!label || typeof label !== "string" || label.trim() === "") {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted add meal plan with invalid label (Owner: ${email})`
      );
      return res.status(400).json({
        message: "Plan label is required and must be a non-empty string.",
      });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted add meal plan for non-existent Tiffin (Owner: ${email})`
      );
      return res.status(404).json({ message: "Tiffin not found." });
    }
    tiffinId = tiffin._id;

    // Ensure menu structure exists
    if (!tiffin.menu)
      tiffin.menu = { plans: [], mealTypes: [], instructions: [] };
    if (!tiffin.menu.plans) tiffin.menu.plans = [];

    if (tiffin.menu.plans.some((p) => p.label === label.trim())) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted add duplicate meal plan label '${label.trim()}' to Tiffin ID ${tiffinId}`
      );

      return res
        .status(400)
        .json({ message: `Plan label '${label.trim()}' already exists.` });
    }

    tiffin.menu.plans.push({ label: label.trim() });
    await tiffin.save();

    const addedPlan = tiffin.menu.plans[tiffin.menu.plans.length - 1];

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Added meal plan '${addedPlan.label}' (PlanID: ${addedPlan._id}) to Tiffin ID ${tiffinId}`
    );
    const newNotify = new Notify({
      timestamp: new Date(),
      level: "A Tiffin is updated",
      type: ["admin", "restaurant"],
      message: `Added meal plan '${addedPlan.label}' (PlanID: ${addedPlan._id}) to Tiffin ID ${tiffinId}.`,
      metadata: {
        category: ["Restaurant"],
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    await newNotify.save();

    res
      .status(201)
      .json({ message: "Plan added successfully.", plan: addedPlan }); // Return added plan
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error adding meal plan (Label: ${
        label || "N/A"
      }) for Tiffin (Owner: ${email}): ${error.message}`
    );
    console.error("Error adding plan:", error);
    res
      .status(500)
      .json({ message: "Error adding plan.", error: error.message });
  }
});

router.get("/tiffin-Reviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const limit = parseInt(req.query.limit) || 10;

    const firm = await Tiffin.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 1,
          reviews: {
            $slice: [
              {
                $sortArray: {
                  input: {
                    $filter: {
                      input: "$reviews",
                      as: "review",
                      cond: {
                        $or: [
                          { $eq: ["$$review.isHidden", false] },
                          { $not: ["$$review.isHidden"] }, // Field doesn't exist
                        ],
                      },
                    },
                  },
                  sortBy: { date: -1 },
                },
              },
              limit,
            ],
          },
        },
      },
    ]);

    if (!firm.length) {
      return res.status(404).json({ error: "Firm Not Found" });
    }

    await historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [firm[0]._id],
      `Retrieved ${limit} reviews (non-hidden or no flag) for Firm ID ${firm[0]._id} sorted by date.`
    );

    return res.status(200).json(firm[0]);
  } catch (error) {
    console.error("Error fetching firm reviews by date:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/edit-meal-plan/:planId/email",
  authenticateToken,
  async (req, res) => {
    const { planId } = req.params;
    const email = req.user.email;
    const { label } = req.body;
    let tiffinId = null;
    let oldLabel = "Unknown";
    try {
      if (!mongoose.Types.ObjectId.isValid(planId)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted edit meal plan with invalid Plan ID format: ${planId} (Owner: ${email})`
        );
        return res
          .status(400)
          .json({ message: "Invalid Meal Plan ID format." });
      }
      if (!label || typeof label !== "string" || label.trim() === "") {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted edit meal plan (PlanID: ${planId}, Owner: ${email}) with missing/invalid label.`
        );
        return res.status(400).json({
          message: "New plan label is required and must be a non-empty string.",
        });
      }
      const newLabel = label.trim();

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted edit meal plan for non-existent Tiffin (Owner: ${email})`
        );
        return res.status(404).json({ message: "Tiffin not found." });
      }
      tiffinId = tiffin._id;

      // Use subdocument .id() method for finding
      const plan = tiffin.menu?.plans?.id(planId);
      if (!plan) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted edit non-existent meal plan ID ${planId} within Tiffin ID ${tiffinId}`
        );
        return res.status(404).json({ message: "Plan not found." });
      }
      oldLabel = plan.label;

      // Check for duplicate label (excluding self)
      if (
        tiffin.menu.plans.some(
          (p) => p.label === newLabel && p._id.toString() !== planId
        )
      ) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted update meal plan (PlanID: ${planId}) to duplicate label '${newLabel}' on Tiffin ID ${tiffinId}`
        );
        return res
          .status(400)
          .json({ message: `Plan label '${newLabel}' already exists.` });
      }

      // Update the plan label
      plan.label = newLabel;
      // plan.updatedAt = Date.now(); // Manually update if needed

      await tiffin.save();

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Edited meal plan (PlanID: ${planId}) label from '${oldLabel}' to '${newLabel}' within Tiffin ID ${tiffinId}`
      );

      const newNotify = new Notify({
        timestamp: new Date(),
        level: "A Tiffin is updated",
        type: ["admin", "restaurant"],
        message: `Edited meal plan (PlanID: ${planId}) label from '${oldLabel}' to '${newLabel}' within Tiffin ID ${tiffinId}.`,
        metadata: {
          category: ["Restaurant"],
          isViewed: false,
          isAccept: false,
          isReject: false,
        },
      });
      await newNotify.save();

      res
        .status(200)
        .json({ message: "Meal plan updated successfully.", plan: plan });
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error editing meal plan (PlanID: ${planId}, Label: ${oldLabel} -> ${
          label || "N/A"
        }) for Tiffin (Owner: ${email}): ${error.message}`
      );
      console.error("Error updating meal plan:", error); // Keep console error
      res
        .status(500)
        .json({ message: "Error updating meal plan.", error: error.message }); // Include original error
    }
  }
);

// Add a new meal type
router.post("/add-meal-type/email", authenticateToken, async (req, res) => {
  const { label, description, prices } = req.body;
  const email = req.user.email;
  let tiffinId = null;
  try {
    if (!label || !description || !prices || typeof prices !== "object") {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted add meal type with incomplete details (Owner: ${email})`
      );
      return res.status(400).json({
        message:
          "Meal type label, description, and prices object are required.",
      });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted add meal type for non-existent Tiffin (Owner: ${email})`
      );
      return res.status(404).json({ message: "Tiffin not found." });
    }
    tiffinId = tiffin._id;

    // Ensure menu structure exists
    if (!tiffin.menu)
      tiffin.menu = { plans: [], mealTypes: [], instructions: [] };
    if (!tiffin.menu.mealTypes) tiffin.menu.mealTypes = [];

    // Check for duplicate label
    if (tiffin.menu.mealTypes.some((mt) => mt.label === label.trim())) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted add duplicate meal type label '${label.trim()}' to Tiffin ID ${tiffinId}`
      );
      return res
        .status(400)
        .json({ message: `Meal type label '${label.trim()}' already exists.` });
    }

    const newMealType = {
      mealTypeId: new mongoose.Types.ObjectId(),
      label: label.trim(),
      description,
      prices,
      specificPlans: [], // Initialize
    };

    tiffin.menu.mealTypes.push(newMealType);
    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Added new meal type '${newMealType.label}' (MealTypeID: ${newMealType.mealTypeId}) to Tiffin ID ${tiffinId}`
    );

    const newNotify = new Notify({
      timestamp: new Date(),
      level: "A Tiffin is updated",
      type: ["admin", "restaurant"],
      message: `Added new meal type '${newMealType.label}' (MealTypeID: ${newMealType.mealTypeId}) to Tiffin ID ${tiffinId}.`,
      metadata: {
        category: ["Restaurant"],
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    await newNotify.save();

    res.status(201).json({
      message: "Meal type added successfully.",
      mealType: newMealType,
    });
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error adding meal type (Label: ${
        label || "N/A"
      }) for Tiffin (Owner: ${email}): ${error.message}`
    );
    console.error("Error adding meal type:", error);
    res
      .status(500)
      .json({ message: "Error adding meal type.", error: error.message });
  }
});

router.post(
  "/manage_mealdays&Flexidates/email",
  authenticateToken,
  async (req, res) => {
    const { serviceDays, isFlexibleDates } = req.body;
    const email = req.user.email;
    let tiffinId = null;
    try {
      // Validation (keep original logic)
      if (serviceDays === undefined && isFlexibleDates === undefined) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted manage service days/flex dates with no data (Owner: ${email})`
        );
        return res.status(400).json({
          message:
            "Either 'serviceDays' array or 'isFlexibleDates' boolean is required.",
        });
      }
      // Add more specific validation if needed (e.g., serviceDays content)

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted manage service days/flex dates for non-existent Tiffin (Owner: ${email})`
        );
        return res.status(404).json({ message: "Tiffin not found." });
      }
      tiffinId = tiffin._id;

      // Ensure menu object exists
      if (!tiffin.menu) tiffin.menu = {};

      let changes = [];
      // Update using original logic
      if (serviceDays !== undefined) {
        tiffin.menu.serviceDays = Array.isArray(serviceDays)
          ? serviceDays
          : tiffin.menu.serviceDays;
        changes.push(`Service Days updated`);
      }
      if (isFlexibleDates !== undefined) {
        tiffin.menu.isFlexibleDates =
          isFlexibleDates !== undefined
            ? !!isFlexibleDates
            : tiffin.menu.isFlexibleDates;
        changes.push(`Flexible Dates updated`);
      }

      if (changes.length > 0) {
        await tiffin.save();
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Updated menu settings (Meal Days/Flex Dates) for Tiffin ID ${tiffinId}. Changes: ${changes.join(
            "; "
          )}`
        );
        res.status(200).json({
          message: "Meal days & Flexible dates settings updated successfully.",
          menu: tiffin.menu,
        }); // 200 OK for update
      } else {
        historyLogRecorder(
          req,
          "Tiffin",
          "READ", // No change made, effectively a read/check
          [tiffinId],
          `Checked menu settings (Meal Days/Flex Dates) for Tiffin ID ${tiffinId}. No changes applied.`
        );

        res.status(200).json({
          message: "No changes applied to settings.",
          menu: tiffin.menu,
        });
      }
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error updating service days/flex dates for Tiffin (Owner: ${email}): ${error.message}`
      );
      console.error("Error updating mealdays/flexdates:", error); // Keep console log
      res
        .status(500)
        .json({ message: "Error updating settings", error: error.message });
    }
  }
);

router.post("/apply-meal-plans/email", authenticateToken, async (req, res) => {
  const { mealTypeId, applyTo, selectedPlans } = req.body; // selectedPlans = array of labels
  const email = req.user.email;
  let tiffinId = null;
  let mealTypeName = "Unknown";
  try {
    if (!mongoose.Types.ObjectId.isValid(mealTypeId)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted apply meal plans with invalid Meal Type ID format: ${mealTypeId} (Owner: ${email})`
      );
      return res.status(400).json({ message: "Invalid Meal Type ID format." });
    }
    if (!applyTo || (applyTo === "specific" && !Array.isArray(selectedPlans))) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted apply meal plans (MealTypeID: ${mealTypeId}, Owner: ${email}) with missing 'applyTo' or invalid 'selectedPlans'.`
      );
      return res.status(400).json({
        message:
          "'applyTo' ('all' or 'specific') is required. If 'specific', 'selectedPlans' array is required.",
      });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted apply meal plans for non-existent Tiffin (Owner: ${email})`
      );
      return res.status(404).json({ message: "Tiffin not found." });
    }
    tiffinId = tiffin._id;

    // Use .id() method for subdocument lookup
    const mealType = tiffin.menu?.mealTypes?.id(mealTypeId);

    if (!mealType) {
      // console.log("Available meal types:", tiffin.menu?.mealTypes?.map(t => t.mealTypeId)); // Keep debug log if needed
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted apply meal plans to non-existent Meal Type ID ${mealTypeId} within Tiffin ID ${tiffinId}`
      );
      return res.status(404).json({ message: "Meal type not found." });
    }
    mealTypeName = mealType.label;

    let appliedPlanLabels = [];
    // Handle plan assignment (original logic)
    if (applyTo === "all") {
      appliedPlanLabels = tiffin.menu?.plans?.map((plan) => plan.label) || [];
      mealType.specificPlans = appliedPlanLabels;
    } else if (applyTo === "specific") {
      const validPlanLabels =
        tiffin.menu?.plans?.map((plan) => plan.label) || [];
      appliedPlanLabels = selectedPlans.filter((label) =>
        validPlanLabels.includes(label)
      );
      mealType.specificPlans = appliedPlanLabels;
    } else {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted apply meal plans (MealTypeID: ${mealTypeId}) with invalid 'applyTo' value: ${applyTo}. Tiffin ID ${tiffinId}`
      );
      return res.status(400).json({
        message: "Invalid 'applyTo' value. Must be 'all' or 'specific'.",
      });
    }
    // mealType.updatedAt = Date.now(); // Manual update if needed

    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Applied meal plans to meal type '${mealTypeName}' (MealTypeID: ${mealTypeId}) within Tiffin ID ${tiffinId}. Mode: ${applyTo}. Applied: [${appliedPlanLabels.join(
        ", "
      )}]`
    );

    res.status(200).json({
      message: "Meal plans applied successfully.",
      appliedPlans: mealType.specificPlans, // Return applied plans
    });
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error applying meal plans to meal type '${mealTypeName}' (MealTypeID: ${mealTypeId}) for Tiffin (Owner: ${email}): ${error.message}`
    );
    console.error("Error applying meal plans:", error); // Keep console log
    res
      .status(500)
      .json({ message: "Error applying meal plans.", error: error.message });
  }
});

// Edit meal type and plans route
router.put(
  "/edit-meal-type/:mealTypeId/email",
  authenticateToken,
  async (req, res) => {
    const { mealTypeId } = req.params;
    const email = req.user.email;
    const { label, description, prices, applyTo, selectedPlans } = req.body;
    let tiffinId = null;
    let oldLabel = "Unknown";
    try {
      if (!mongoose.Types.ObjectId.isValid(mealTypeId)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted meal type edit with invalid Meal Type ID format: ${mealTypeId} (Owner: ${email})`
        );
        return res
          .status(400)
          .json({ message: "Invalid Meal Type ID format." });
      }
      if (!label || !description || !prices || typeof prices !== "object") {
        // Keep original validation
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted edit meal type (MealTypeID: ${mealTypeId}, Owner: ${email}) with missing fields.`
        );
        return res.status(400).json({
          message:
            "Meal type label, description and prices object are required.",
        });
      }
      if (applyTo && applyTo === "specific" && !Array.isArray(selectedPlans)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted edit meal type plans (MealTypeID: ${mealTypeId}, Owner: ${email}) with invalid 'selectedPlans'.`
        );
        return res.status(400).json({
          message:
            "If 'applyTo' is 'specific', 'selectedPlans' array is required.",
        });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted edit meal type for non-existent Tiffin (Owner: ${email})`
        );
        return res.status(404).json({ message: "Tiffin not found." });
      }
      tiffinId = tiffin._id;

      // Find the meal type index
      const mealTypeIndex = tiffin.menu?.mealTypes?.findIndex(
        (type) => type.mealTypeId.toString() === mealTypeId
      );

      if (mealTypeIndex === undefined || mealTypeIndex === -1) {
        // console.log("Available meal types:", tiffin.menu?.mealTypes?.map(t => t.mealTypeId)); // Keep debug log
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted edit non-existent Meal Type ID ${mealTypeId} within Tiffin ID ${tiffinId}`
        );
        return res.status(404).json({ message: "Meal type not found." });
      }
      oldLabel = tiffin.menu.mealTypes[mealTypeIndex].label;

      // Check for duplicate label if changed
      const newLabel = label.trim();
      if (
        newLabel !== oldLabel &&
        tiffin.menu.mealTypes.some(
          (mt, index) => index !== mealTypeIndex && mt.label === newLabel
        )
      ) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted update meal type (MealTypeID: ${mealTypeId}) to duplicate label '${newLabel}' on Tiffin ID ${tiffinId}`
        );
        return res
          .status(400)
          .json({ message: `Meal type label '${newLabel}' already exists.` });
      }

      // Update basic meal type information
      tiffin.menu.mealTypes[mealTypeIndex].label = newLabel;
      tiffin.menu.mealTypes[mealTypeIndex].description = description;
      tiffin.menu.mealTypes[mealTypeIndex].prices = prices; // Update prices directly

      // Update associated plans if applyTo is provided
      let appliedPlanLabels =
        tiffin.menu.mealTypes[mealTypeIndex].specificPlans || [];
      if (applyTo === "all") {
        appliedPlanLabels = tiffin.menu?.plans?.map((plan) => plan.label) || [];
        tiffin.menu.mealTypes[mealTypeIndex].specificPlans = appliedPlanLabels;
      } else if (applyTo === "specific") {
        const validPlanLabels =
          tiffin.menu?.plans?.map((plan) => plan.label) || [];
        appliedPlanLabels = selectedPlans.filter((label) =>
          validPlanLabels.includes(label)
        );
        tiffin.menu.mealTypes[mealTypeIndex].specificPlans = appliedPlanLabels;
      }
      // tiffin.menu.mealTypes[mealTypeIndex].updatedAt = Date.now(); // Manual update if needed

      await tiffin.save();

      const updatedMealType = tiffin.menu.mealTypes[mealTypeIndex];

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Updated meal type '${
          updatedMealType.label
        }' (MealTypeID: ${mealTypeId}) including associated plans (Mode: ${
          applyTo || "No Change"
        }) within Tiffin ID ${tiffinId}`
      );

      res.status(200).json({
        message: "Meal type updated successfully.",
        updatedMealType: updatedMealType, // Return updated meal type
        // appliedPlans: appliedPlanLabels, // Redundant if included in updatedMealType
      });
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error editing meal type '${oldLabel}' (MealTypeID: ${mealTypeId}) for Tiffin (Owner: ${email}): ${error.message}`
      );
      console.error("Error updating meal type:", error); // Keep console log
      res
        .status(500)
        .json({ message: "Error updating meal type.", error: error.message });
    }
  }
);

// Fetch all menu data
router.get("/menu/email", authenticateToken, async (req, res) => {
  const email = req.user.email;
  let tiffinId = null;
  try {
    const tiffin = await Tiffin.findOne({ ownerMail: email }); // No .lean() needed if sending back potentially modified data later? Original code didn't use lean here.
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Attempted get menu for non-existent Tiffin (Owner: ${email})`
      );
      return res.status(404).json({ message: "Tiffin not found." });
    }
    tiffinId = tiffin._id;

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [tiffinId],
      `Retrieved menu data for Tiffin '${
        tiffin.kitchenName || tiffinId
      }' (ID: ${tiffinId})`
    );

    res.status(200).json(tiffin.menu || {}); // Return menu or empty object
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      tiffinId ? [tiffinId] : [],
      `Error retrieving menu for Tiffin (Owner: ${email}): ${error.message}`
    );
    console.error("Error fetching menu data:", error); // Keep console log
    res
      .status(500)
      .json({ message: "Error fetching menu data.", error: error.message });
  }
});

// Delete a meal plan by ID
router.delete(
  "/delete-plan/:planId/email",
  authenticateToken,
  async (req, res) => {
    const { planId } = req.params;
    const email = req.user.email;
    let tiffinId = null;
    let planLabel = "Unknown";
    try {
      if (!mongoose.Types.ObjectId.isValid(planId)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted meal plan deletion with invalid Plan ID format: ${planId} (Owner: ${email})`
        );
        return res
          .status(400)
          .json({ message: "Invalid Meal Plan ID format." });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted delete meal plan for non-existent Tiffin (Owner: ${email})`
        );
        return res.status(404).json({ message: "Tiffin not found." });
      }
      tiffinId = tiffin._id;

      // Find plan before filtering for logging
      const planToDelete = tiffin.menu?.plans?.find(
        (p) => p._id.toString() === planId
      );
      if (!planToDelete) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted delete non-existent meal plan ID ${planId} within Tiffin ID ${tiffinId}`
        );
        return res.status(404).json({ message: "Plan not found." });
      }
      planLabel = planToDelete.label;

      // Remove the plan using original filter logic
      tiffin.menu.plans = tiffin.menu.plans.filter(
        (plan) => plan._id.toString() !== planId
      );

      // Remove associated prices in meal types - Original code modified this way
      // Be aware this modifies potentially many subdocuments
      if (tiffin.menu?.mealTypes) {
        tiffin.menu.mealTypes.forEach((mealType) => {
          if (mealType.prices && mealType.prices[planId]) {
            // Check if price exists for this plan
            delete mealType.prices[planId];
            // Mark mealType as modified if needed by schema/hooks
            // mealType.updatedAt = Date.now(); // Manual update if needed
          }
        });
      }

      await tiffin.save();

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Deleted meal plan '${planLabel}' (PlanID: ${planId}) and associated prices from Tiffin ID ${tiffinId}`
      );

      res
        .status(200)
        .json({
          message: "Plan deleted successfully.",
          tiffinMenu: tiffin.menu,
        }); // Return updated menu
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error deleting meal plan '${planLabel}' (PlanID: ${planId}) for Tiffin (Owner: ${email}): ${error.message}`
      );
      console.error("Error deleting meal plan:", error); // Keep console log
      res
        .status(500)
        .json({ message: "Error deleting meal plan.", error: error.message });
    }
  }
);

// Delete a meal type by ID
router.delete(
  "/delete-meal-type/:mealTypeId/email",
  authenticateToken,
  async (req, res) => {
    const { mealTypeId } = req.params;
    const email = req.user.email;
    let tiffinId = null;
    let mealTypeLabel = "Unknown";
    try {
      if (!mongoose.Types.ObjectId.isValid(mealTypeId)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted meal type deletion with invalid Meal Type ID format: ${mealTypeId} (Owner: ${email})`
        );
        return res
          .status(400)
          .json({ message: "Invalid Meal Type ID format." });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted delete meal type for non-existent Tiffin (Owner: ${email})`
        );
        return res.status(404).json({ message: "Tiffin not found." });
      }
      tiffinId = tiffin._id;

      // Find before filtering for logging
      const mealTypeToDelete = tiffin.menu?.mealTypes?.find(
        (mt) => mt.mealTypeId.toString() === mealTypeId
      );
      if (!mealTypeToDelete) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted delete non-existent meal type ID ${mealTypeId} within Tiffin ID ${tiffinId}`
        );
        return res.status(404).json({ message: "Meal type not found." });
      }
      mealTypeLabel = mealTypeToDelete.label;

      // Remove the meal type using original filter logic
      tiffin.menu.mealTypes = tiffin.menu.mealTypes.filter(
        (mealType) => mealType.mealTypeId.toString() !== mealTypeId
      );

      await tiffin.save();

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Deleted meal type '${mealTypeLabel}' (MealTypeID: ${mealTypeId}) from Tiffin ID ${tiffinId}`
      );

      res.status(200).json({
        message: "Meal type deleted successfully.",
        tiffinMenu: tiffin.menu,
      }); // Return updated menu
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error deleting meal type '${mealTypeLabel}' (MealTypeID: ${mealTypeId}) for Tiffin (Owner: ${email}): ${error.message}`
      );
      console.error("Error deleting meal type:", error); // Keep console log
      res
        .status(500)
        .json({ message: "Error deleting meal type.", error: error.message });
    }
  }
);

// --- Instructions Routes ---

// Route to add a new instruction
router.post("/add-instruction/email", authenticateToken, async (req, res) => {
  const { title, details } = req.body;
  const email = req.user.email;
  let tiffinId = null;
  try {
    if (!title || !details) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted add instruction with missing title/details (Owner: ${email})`
      );
      return res
        .status(400)
        .json({ message: "Title and details are required." });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted add instruction for non-existent Tiffin (Owner: ${email})`
      );
      return res.status(404).json({ message: "Tiffin not found." });
    }
    tiffinId = tiffin._id;

    // Ensure menu structure exists
    if (!tiffin.menu)
      tiffin.menu = { plans: [], mealTypes: [], instructions: [] };
    if (!tiffin.menu.instructions) tiffin.menu.instructions = [];

    const newInstruction = { title, details }; // Mongoose adds _id
    tiffin.menu.instructions.push(newInstruction);
    await tiffin.save();

    const addedInstruction =
      tiffin.menu.instructions[tiffin.menu.instructions.length - 1];

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Added new instruction '${addedInstruction.title}' (InstructionID: ${addedInstruction._id}) to Tiffin ID ${tiffinId}`
    );

    res.status(201).json({
      message: "Instruction added successfully.",
      instruction: addedInstruction,
    }); // Return added instruction
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error adding instruction (Title: ${
        title || "N/A"
      }) for Tiffin (Owner: ${email}): ${error.message}`
    );
    console.error("Error adding instruction:", error); // Keep console log
    res
      .status(500)
      .json({ message: "Error adding instruction.", error: error.message });
  }
});

// Route to edit an instruction
router.put(
  "/edit-instruction/:id/email",
  authenticateToken,
  async (req, res) => {
    const { id: instructionId } = req.params;
    const email = req.user.email;
    const { title, details } = req.body;
    let tiffinId = null;
    let oldTitle = "Unknown";
    try {
      if (!mongoose.Types.ObjectId.isValid(instructionId)) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted instruction edit with invalid Instruction ID format: ${instructionId} (Owner: ${email})`
        );
        return res
          .status(400)
          .json({ message: "Invalid Instruction ID format." });
      }
      if (!title || !details) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted instruction edit (InstructionID: ${instructionId}, Owner: ${email}) with missing title/details.`
        );
        return res
          .status(400)
          .json({ message: "Title and details are required." });
      }

      const tiffin = await Tiffin.findOne({ ownerMail: email });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted edit instruction for non-existent Tiffin (Owner: ${email})`
        );
        return res.status(404).json({ message: "Tiffin not found." });
      }
      tiffinId = tiffin._id;

      // Use subdocument .id() method
      const instruction = tiffin.menu?.instructions?.id(instructionId);
      if (!instruction) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted edit non-existent instruction ID ${instructionId} within Tiffin ID ${tiffinId}`
        );
        return res.status(404).json({ message: "Instruction not found." });
      }
      oldTitle = instruction.title;

      instruction.title = title;
      instruction.details = details;
      // instruction.updatedAt = Date.now(); // Manual update if needed

      await tiffin.save();

      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Updated instruction '${instruction.title}' (InstructionID: ${instructionId}) within Tiffin ID ${tiffinId}`
      );

      res.status(200).json({
        message: "Instruction updated successfully.",
        instruction: instruction,
      });
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error editing instruction '${oldTitle}' (InstructionID: ${instructionId}) for Tiffin (Owner: ${email}): ${error.message}`
      );
      console.error("Error updating instruction:", error); // Keep console log
      res
        .status(500)
        .json({ message: "Error updating instruction.", error: error.message });
    }
  }
);

// Delete an instruction by ID
router.delete("/delete-instruction/:id/email", async (req, res) => {
  const { id: instructionId } = req.params;
  const email = req.user.email;
  let tiffinId = null;
  let instructionTitle = "Unknown";
  try {
    if (!mongoose.Types.ObjectId.isValid(instructionId)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE", // Action is UPDATE as we modify Tiffin doc
        [],
        `Attempted instruction deletion with invalid Instruction ID format: ${instructionId} (Owner: ${email})`
      );
      return res
        .status(400)
        .json({ message: "Invalid Instruction ID format." });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: email });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted delete instruction for non-existent Tiffin (Owner: ${email})`
      );
      return res.status(404).json({ message: "Tiffin not found." });
    }
    tiffinId = tiffin._id;

    // Find before filtering for logging
    const instructionToDelete = tiffin.menu?.instructions?.id(instructionId);
    if (!instructionToDelete) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted delete non-existent instruction ID ${instructionId} within Tiffin ID ${tiffinId}`
      );
      return res.status(404).json({ message: "Instruction not found." });
    }
    instructionTitle = instructionToDelete.title;

    // Remove the instruction using original filter logic
    // Ensure menu structure exists before filtering
    if (tiffin.menu && tiffin.menu.instructions) {
      tiffin.menu.instructions = tiffin.menu.instructions.filter(
        (instruction) => instruction._id.toString() !== instructionId
      );
    } else {
      // Should not happen if instruction was found, but handle defensively
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted delete instruction '${instructionTitle}' (InstructionID: ${instructionId}) but menu/instructions array missing during filter stage for Tiffin ID ${tiffinId}`
      );
      return res.status(500).json({
        message: "Internal error: Could not process instruction list.",
      });
    }

    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Deleted instruction '${instructionTitle}' (InstructionID: ${instructionId}) from Tiffin ID ${tiffinId}`
    );

    res.status(200).json({
      message: "Instruction deleted successfully.",
      tiffinMenu: tiffin.menu,
    }); // Return updated menu
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error deleting instruction '${instructionTitle}' (InstructionID: ${instructionId}) for Tiffin (Owner: ${email}): ${error.message}`
    );
    console.error("Error deleting instruction:", error); // Keep console log
    res
      .status(500)
      .json({ message: "Error deleting instruction.", error: error.message });
  }
});
router.get("/tiffin/outlet/info", authenticateToken, async (req, res) => {
  const userId = req.user.email;
  console.log(req.user);
  try {
    const tiffinInfo = await Tiffin.findOne({ ownerMail: userId }).select(
      "kitchenName address id"
    );
    return res.status(200).json(tiffinInfo);
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.get("/tiffin/email", authenticateToken, async (req, res) => {
  const email = req.user.email;
  let tiffinId = null;
  try {
    const tiffin = await Tiffin.findOne({ ownerMail: email });

    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Tiffin details not found for owner email: ${email}`
      );
      return res.status(404).json({
        success: false,
        message: "Tiffin not found",
      });
    }
    tiffinId = tiffin._id;

    historyLogRecorder(
      req,
      "Tiffin", // Entity type is Tiffin
      "READ",
      [tiffinId],
      `Retrieved Tiffin details for '${
        tiffin.kitchenName || tiffinId
      }' (ID: ${tiffinId}) by email`
    );

    res.status(200).json({
      success: true,
      data: tiffin,
    });
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      tiffinId ? [tiffinId] : [],
      `Error retrieving Tiffin by email ${email}: ${error.message}`
    );
    console.error("Get Tiffin by email error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
module.exports = router;
