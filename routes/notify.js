const express = require("express");
const router = express.Router();
const { getNotification } = require("../logger/notification/cleaner");
const Notify = require("../models/logs/notify");
const mongoose = require("mongoose");

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const data = await Notify.find().sort({ timestamp: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/admin", async (req, res) => {
  try {
    const data = await Notify.find({ type: "admin" }).sort({ timestamp: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/restaurant", async (req, res) => {
  try {
    const data = await Notify.find({ type: "restaurant" }).sort({
      timestamp: -1,
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get("/tiffin", async (req, res) => {
  try {
    const data = await Notify.find({ type: "tiffin" }).sort({
      timestamp: -1,
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get("/marketing", async (req, res) => {
  try {
    const data = await Notify.find({ type: "marketing" }).sort({
      timestamp: -1,
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/admins", async (req, res) => {
  try {
    const data = await Notify.find({
      "metadata.isAccept": false,
      "metadata.isReject": false,
    }).sort({ timestamp: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// router.delete("/:id", async (req, res) => {
//   const updated = await Notify.findByIdAndDelete(req.params.id);
//   console.log(updated);
//   res.json({ response: "ok", success: true });
// });
router.delete("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    console.log(category);
    const deletedNotifications = await Notify.deleteMany({
      "metadata.category": category,
    });

    if (deletedNotifications.deletedCount > 0) {
      res.json({
        response: "ok",
        success: true,
        message: `${deletedNotifications.deletedCount} notifications deleted for category: ${category}`,
      });
    } else {
      res.json({
        response: "ok",
        success: false,
        message: `No notifications found for category: ${category}`,
      });
    }
  } catch (err) {
    console.error("Error deleting notifications by category:", err);
    res
      .status(500)
      .json({ response: "error", success: false, message: err.message });
  }
});

// Get 200 oldest notifications
router.get("/oldest", async (req, res) => {
  try {
    const data = await Notify.find().sort({ timestamp: 1 }).limit(200);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get 200 latest notifications
router.get("/latest", async (req, res) => {
  try {
    const data = await Notify.find().sort({ timestamp: -1 }).limit(200);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get unread notifications
router.get("/unread", async (req, res) => {
  try {
    const data = await Notify.find({ "metadata.isViewed": false });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get a notification by ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Notify.findById(req.params.id);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid ID format" });
  }
});

// Mark a notification as viewed
router.put("/:id", async (req, res) => {
  try {
    const notify = await Notify.findByIdAndUpdate(
      req.params.id,
      { $set: { "metadata.isViewed": true } },
      { new: true }
    );

    if (!notify) {
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });
    }

    res.json({ success: true, response: "ok" });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid ID format" });
  }
});

// Delete a notification by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Notify.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });
    }
    res.json({ success: true, response: "ok" });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid ID format" });
  }
});

module.exports = router;
