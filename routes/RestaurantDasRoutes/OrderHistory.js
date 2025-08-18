const express = require("express");
const History = require("../../models/RestaurantsDasModel/History");
const OrderTakeAway = require("../../models/UserOrderTakeaway");
const Booking = require("../../models/RestaurantsDasModel/Booking");
const mongoose = require("mongoose");
const router = express.Router();
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
router.get("/history", async (req, res) => {
  try {
    const history = await History.find();
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching order history.",
    });
  }
});

router.get("/history/:id", async (req, res) => {
  try {
    const firmId = req.params.id;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(firmId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid firm ID" });
    }

    const firmObjectId = new mongoose.Types.ObjectId(firmId);

    // Fetch history
    const history = await History.find({
      "items.restaurantName": firmObjectId,
    });

    if (!history.length) {
      return res.status(404).json({
        success: false,
        message: "No order history found for this firm.",
      });
    }

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order history.",
      error: error.message,
    });
  }
});

router.get("/history/ordertakeaway/:id", async (req, res) => {
  try {
    const firmId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(firmId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid firm ID" });
    }

    const firmObjectId = new mongoose.Types.ObjectId(firmId);

    const history = await OrderTakeAway.find({
      "items.sourceEntityId": firmObjectId,
    })
      .populate({ path: "userId", select: "username email" })
      .sort({ createdAt: -1 }); // 🔽 descending order (newest first)

    if (!history.length) {
      return res.status(404).json({
        success: false,
        message: "No order history found for this firm.",
      });
    }

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order history.",
      error: error.message,
    });
  }
});

// GET endpoint to fetch outlet data for multiple firm IDs
router.get(
  "/history/multiple-firms/:id",
  authenticateToken,
  async (req, res) => {
    try {
      // Parse the comma-separated string into an array
      const idParam = req.params.id;
      const firmIdsArray = idParam.split(",").map((id) => id.trim());

      // Convert each string into a Mongo ObjectId
      const firmObjectIds = firmIdsArray.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      // Fetch outlets that match any of the given firmIds
      const takeaway = await OrderTakeAway.find({
        "items.sourceEntityId": { $in: firmObjectIds },
      }).populate({ path: "userId", select: "username email" }); // ✅ corrected path
      const dining = await Booking.find({
        history: false,
        firm: { $in: firmObjectIds },
      })
        .populate({
          path: "offerId",
          model: "RestaurantOffers",
          select: "name code offerType discountValue",
        })
        .populate({
          path: "firm",
          model: "Firm",
          select: "restaurantInfo.name",
        });

      if (
        !takeaway ||
        !dining ||
        dining.length === 0 ||
        takeaway.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message: "No outlets found for the provided firm IDs",
        });
      }

      return res.status(200).json({
        success: true,
        data: [...takeaway, ...dining],
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
// GET endpoint to fetch outlet data for multiple firm IDs
router.get(
  "/history/dining-takeaway-orders/:id",
  authenticateToken,
  async (req, res) => {
    try {
      // Parse the comma-separated string into an array
      const id = req.params.id;

      // Fetch outlets that match any of the given firmIds
      const takeaway = await OrderTakeAway.find({
        "items.sourceEntityId": { $in: id },
      }).populate({ path: "userId", select: "username email" }); // ✅ corrected path
      const dining = await Booking.find({
        history: false,
        firm: { $in: id },
      });

      if (
        !takeaway ||
        !dining ||
        dining.length === 0 ||
        takeaway.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message: "No outlets found for the provided firm IDs",
        });
      }

      return res.status(200).json({
        success: true,
        data: [...takeaway, ...dining],
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

module.exports = router;
