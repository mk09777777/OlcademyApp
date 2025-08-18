const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const Tiffin = require("../../models/Tiffin");

router.get("/top-restaurants", async (req, res) => {
  const { type } = req.query;

  try {
    // Debugging helpers
    console.log("Meal type from query:", type);
    const availableTypes = await Order.distinct("mealType");
    console.log("Available meal types:", availableTypes);

    const pipeline = [
      { $match: { mealType: new RegExp(`^${type}$`, "i") } }, // case-insensitive match
      {
        $group: {
          _id: "$tiffinName",
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          restaurantName: "$_id",
          totalOrders: 1,
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    console.log("Aggregation Result:", result);
    res.json(result);
  } catch (err) {
    console.error("Error fetching top restaurants:", err);
    res.status(500).json({ error: err.message });
  }
});







module.exports = router;
