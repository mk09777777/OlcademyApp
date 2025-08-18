// const express = require("express");
// const router = express.Router();
// const Booking = require("../../models/RestaurantsDasModel/Booking");

// router.get("/top5-restaurants", async (req, res) => {
//   try {
//     const topRestaurants = await Booking.aggregate([
//       { $match: { history: false } }, // only active bookings
//       {
//         $group: {
//           _id: "$firm",
//           totalBookings: { $sum: 1 },
//         },
//       },
//       { $sort: { totalBookings: -1 } },
//       { $limit: 5 },
//       {
//         $lookup: {
//           from: "firms", // your Firm collection name
//           localField: "_id",
//           foreignField: "_id",
//           as: "firmDetails",
//         },
//       },
//       { $unwind: "$firmDetails" },
//       {
//         $project: {
//           _id: 0,
//           firmId: "$firmDetails._id",
//           name: "$firmDetails.restaurantInfo.name",
//           image_urls: "$firmDetails.restaurantInfo.image_urls",
//           totalBookings: 1,
//         },
//       },
//     ]);

//     res.status(200).json(topRestaurants);
//   } catch (error) {
//     console.error("Error fetching top restaurants:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// module.exports = router;
