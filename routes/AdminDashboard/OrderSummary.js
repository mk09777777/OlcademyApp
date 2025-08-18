const express = require("express");
const router = express.Router();

// const TiffinOrder = require("../../models/Order"); 
const Bookings = require("../../models/RestaurantsDasModel/Booking"); 
const TakeawayOrder = require("../../models/UserOrderTakeaway"); 

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);


const countTiffinSince = async (days) =>
  TakeawayOrder.countDocuments({
    createdAt: { $gte: daysAgo(days) },
    "items.itemType": "tiffin", 
  })

const countDineInSince = async (days) =>
  Bookings.countDocuments({ createdAt: { $gte: daysAgo(days) } });

const countTakeawaySince = async (days) =>
  TakeawayOrder.countDocuments({
    createdAt: { $gte: daysAgo(days) },"items.itemType": "firm", 
  });


router.get("/order-summary", async (req, res) => {
  try {
    const [dayTiffin, weekTiffin, monthTiffin] = await Promise.all([
      countTiffinSince(1),
      countTiffinSince(7),
      countTiffinSince(30),
    ]);

    const [dayTakeaway, weekTakeaway, monthTakeaway] = await Promise.all([
      countTakeawaySince(1),
      countTakeawaySince(7),
      countTakeawaySince(30),
    ]);

    const [dayDinein, weekDinein, monthDinein] = await Promise.all([
      countDineInSince(1),
      countDineInSince(7),
      countDineInSince(30),
    ]);

    res.json({
      Day: {
        Tiffin: dayTiffin,
        Takeaway: dayTakeaway,
        DineIn: dayDinein,
      },
      Week: {
        Tiffin: weekTiffin,
        Takeaway: weekTakeaway,
        DineIn: weekDinein,
      },
      Month: {
        Tiffin: monthTiffin,
        Takeaway: monthTakeaway,
        DineIn: monthDinein,
      },
    });
  } catch (err) {
    console.error("Order summary fetch failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
