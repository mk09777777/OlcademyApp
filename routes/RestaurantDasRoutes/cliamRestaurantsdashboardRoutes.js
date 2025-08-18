const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
const Firm = require("../../models/Firm");
const mongoose = require("mongoose");

// GET endpoint to fetch outlet data for multiple firm IDs
router.get(
  "/restaurants/multiple-firms/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const idParam = req.params.id;

      // Convert comma-separated string to ObjectId array
      const firmObjectIds = idParam
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id.trim()));

      const rest = await Firm.find({ _id: { $in: firmObjectIds } });

      if (!rest || rest.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No outlets found for the provided firm IDs",
        });
      }

      console.log(
        rest.map((r) => r._id),
        "Fetched all restaurant outlets"
      );

      return res.status(200).json({
        success: true,
        data: rest,
      });
    } catch (error) {
      console.error("Error fetching outlet data:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);

router.post("/editOutlet/:id", async (req, res) => {
  try {
    const outletId = req.params.id;
    const outletData = req.body;

    console.log(outletData, outletId, "Updating outlet data");

    // Validations
    if (outletData.restaurantInfo?.name && !outletData.restaurantInfo.name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (outletData.features && !outletData.features.length) {
      return res
        .status(400)
        .json({ message: "At least one feature is required" });
    }

    if (
      outletData.outletStatus &&
      !["Open", "Close"].includes(outletData.outletStatus)
    ) {
      return res.status(400).json({ message: "Invalid outlet status" });
    }

    // Fetch the existing outlet
    const existingOutlet = await Firm.findById(outletId);
    if (!existingOutlet) {
      return res.status(404).json({ message: "Outlet not found" });
    }

    // Build update object
    const updateObj = {
      updatedAt: new Date(),
    };

    if (outletData.restaurantInfo?.name) {
      updateObj["restaurantInfo.name"] = outletData.restaurantInfo.name;
    }

    if (outletData.restaurantInfo?.address) {
      updateObj["restaurantInfo.address"] = outletData.restaurantInfo.address;
    }

    if (outletData.contactInfo) {
      updateObj["restaurantInfo.phoneNo"] = outletData.contactInfo;
    }

    if (outletData.outletStatus) {
      updateObj.outletStatus = outletData.outletStatus;
    }
    if (outletData.manager) {
      updateObj.ownerName = outletData.manager;
    }

    // Advanced features update logic
    if (outletData.features) {
      const currentFeatures = existingOutlet.features || [];
      const newFeatures = outletData.features;
      const normalized = newFeatures.map((f) => f.toLowerCase());

      // Case 1: Only one feature passed
      if (normalized.length === 1) {
        const feature = normalized[0];
        let updatedFeatures = [...currentFeatures];

        if (feature === "dine in") {
          updatedFeatures = currentFeatures.filter(
            (f) => f.toLowerCase() !== "takeaway"
          );
          if (!updatedFeatures.includes("Dine In")) {
            updatedFeatures.push("Dine In");
          }
        } else if (feature === "takeaway") {
          updatedFeatures = currentFeatures.filter(
            (f) => f.toLowerCase() !== "dine in"
          );
          if (!updatedFeatures.includes("Takeaway")) {
            updatedFeatures.push("Takeaway");
          }
        }

        updateObj.features = updatedFeatures;
      }

      // Case 2: Both Dine In and Takeaway passed
      else if (
        normalized.includes("dine in") &&
        normalized.includes("takeaway")
      ) {
        const hasDineIn = currentFeatures.some(
          (f) => f.toLowerCase() === "dine in"
        );
        const hasTakeaway = currentFeatures.some(
          (f) => f.toLowerCase() === "takeaway"
        );

        if (!hasDineIn || !hasTakeaway) {
          updateObj.features = Array.from(
            new Set([...currentFeatures, "Dine In", "Takeaway"])
          );
        }
      }

      // Case 3: Multiple custom features
      else {
        const merged = [
          ...currentFeatures,
          ...newFeatures.filter((f) => !currentFeatures.includes(f)),
        ];
        updateObj.features = Array.from(new Set(merged));
      }
    }
    const updatedOutlet = await Firm.findByIdAndUpdate(
      outletId,
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedOutlet);
  } catch (error) {
    console.error("Error updating outlet:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Outlet name already exists" });
    }
    res.status(500).json({ message: "Server error while updating outlet" });
  }
});

module.exports = router;
