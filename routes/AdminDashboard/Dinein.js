// routes/admin/dineinBookings.js
const express = require("express");
const router  = express.Router();
const Booking = require("../../models/RestaurantsDasModel/Booking");

// 🚩 NO AUTH MIDDLEWARE here
router.get("/dinein-bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("firm", "restaurantInfo ratings")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
