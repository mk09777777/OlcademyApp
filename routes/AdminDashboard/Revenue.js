const express = require("express");
const router = express.Router();
const Order = require("../../models/UserOrderTakeaway"); // Adjust the path if needed

router.get("/type", async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      // Flatten the items array
      { $unwind: "$items" },

      // Group by itemType (firm or tiffin) and calculate revenue
      {
        $group: {
          _id: "$items.itemType",
          totalamount: {
            $sum: {
              $multiply: [
                { $ifNull: ["$items.price", 0] },
                { $ifNull: ["$items.quantity", 0] }
              ]
            }
          }
        }
      },

      // Rename fields for clarity
      {
        $project: {
          _id: 0,
          type: "$_id",
          totalamount: 1
        }
      }
    ]);

    // Format output
    const result = {
      tiffinRevenue: 0,
      firmRevenue: 0
    };

    revenueData.forEach((entry) => {
      if (entry.type === "tiffin") result.tiffinRevenue = entry.totalamount;
      if (entry.type === "firm") result.firmRevenue = entry.totalamount;
    });

    res.status(200).json({  data: result });
  } catch (err) {
    console.error("Revenue calculation error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/summary", async (req, res) => {
    try {
      // 1. Total Overall Revenue
      const totalResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $ifNull: ["$totalPrice", 0] } },
          },
        },
      ]);
  
      const totalRevenue = totalResult[0]?.totalRevenue || 0;
  
      // 2. Revenue for Each Day
      const dailyRevenue = await Order.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$orderTime" },
              month: { $month: "$orderTime" },
              day: { $dayOfMonth: "$orderTime" },
            },
            totalAmount: { $sum: { $ifNull: ["$totalPrice", 0] } },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            totalAmount: 1,
            orderCount: 1,
          },
        },
      ]);
  
      // 3. Revenue for Each Month
      const monthlyRevenue = await Order.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$orderTime" },
              month: { $month: "$orderTime" },
            },
            totalAmount: { $sum: { $ifNull: ["$totalPrice", 0] } },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalAmount: 1,
            orderCount: 1,
          },
        },
      ]);
  
      // Final response
      res.json({
        totalRevenue,
        dailyRevenue,
        monthlyRevenue,
      });
    } catch (err) {
      console.error("Revenue summary error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
