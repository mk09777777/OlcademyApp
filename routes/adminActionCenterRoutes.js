const express = require("express");
const router = express.Router();
const Firm = require("../models/Firm.js");
const Review = require("../models/Reviews.js");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/auth.js");
const historyLogRecorder = require("../utils/historyLogRecorder.js");

//edit the firm detail
router.put("/Edit/:resId", async (req, res) => {
  try {
    const { resId } = req.params;
    const updateData = req.body;

    // Validate resId
    if (!mongoose.Types.ObjectId.isValid(resId)) {
      return res.status(400).json({
        response: false,
        error: "Invalid restaurant ID",
      });
    }

    // Check if body exists
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        response: false,
        error: "Request body is required",
      });
    }

    // Filter out fields that shouldn't be updated
    const { _id, createdAt, updatedAt, ...safeUpdateData } = updateData;

    // Update document
    const updatedFirm = await Firm.findByIdAndUpdate(
      resId,
      { $set: safeUpdateData },
      {
        new: true,
        runValidators: true,
        select: "-reviews -offer -menu",
      }
    );

    if (!updatedFirm) {
      return res.status(404).json({
        response: false,
        error: "Restaurant not found",
      });
    }

    historyLogRecorder(
      req,
      updatedFirm.constructor.modelName,
      "UPDATE",
      [updatedFirm._id],
      `Updated restaurant details for ${updatedFirm.restaurantInfo.name}`
    );

    res.status(200).json({
      response: true,
      firm: updatedFirm,
    });
  } catch (err) {
    console.error("Error updating restaurant:", err);
    res.status(500).json({
      response: false,
      error: err.message || "Internal server error",
    });
  }
});
//get the latest changed firm
router.get("/latest-firm", async (req, res) => {
  try {
    console.log(req.session.users);
    const latestFirm = await Firm.find()
      .sort({ updatedAt: -1 }) // Sort in descending order (latest first)
      .limit(1) // Get only the latest updated one
      .select("-reviews -offer  -menu"); // Exclude unnecessary fields

    res.status(200).json({ response: "ok", firm: latestFirm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get firm list which contain _id and restauant name
router.get("/get-firm-names", async (req, res) => {
  try {
    let { lastId = null, sortBy, filterBy } = req.query;
    const limit = 30;
    let query = {};

    // Reset lastId only if neither sort nor filter is applied initially
    if (!sortBy && !filterBy && !lastId) {
      lastId = null;
    }

    if (lastId) {
      query = { ...query, _id: { $gt: lastId } };
    }

    // Apply sorting
    let sortOptions = {};
    if (sortBy) {
      switch (sortBy) {
        case "newest":
          sortOptions = { createdAt: 1 };
          break;
        case "oldest":
          sortOptions = { createdAt: -1 };
          break;
        case "recentUpdated":
          sortOptions = { updatedAt: -1 };
          break;
        default:
          sortOptions = {};
      }
    }

    let restaurants;
    let filterQuery = {};

    if (filterBy) {
      switch (filterBy) {
        case "isFlaged":
          filterQuery = { "restaurantInfo.isFlaged": true };
          restaurants = await Firm.find({ ...query, ...filterQuery })
            .sort(sortOptions)
            .limit(limit)
            .select("_id restaurantInfo.name")
            .lean();
          break;

        case "isBookMarked":
          filterQuery = { "restaurantInfo.isBookMarked": true };
          restaurants = await Firm.find({ ...query, ...filterQuery })
            .sort(sortOptions)
            .limit(limit)
            .select("_id restaurantInfo.name")
            .lean();
          break;

        case "isBanned":
          filterQuery = { "restaurantInfo.isBanned": true };
          restaurants = await Firm.find({ ...query, ...filterQuery })
            .sort(sortOptions)
            .limit(limit)
            .select("_id restaurantInfo.name")
            .lean();
          break;

        case "firmInfoChange":
          sortOptions = !sortOptions.updatedAt
            ? { updatedAt: -1 }
            : sortOptions;
          restaurants = await Firm.find({ ...query, ...filterQuery })
            .sort(sortOptions)
            .limit(limit)
            .select("_id restaurantInfo.name")
            .lean();
          break;

        case "menuLatestChange":
          restaurants = await Firm.aggregate([
            { $match: query },
            {
              $lookup: {
                from: "menuitems",
                localField: "menu.menuTabs.sections.items",
                foreignField: "_id",
                as: "menuItems",
              },
            },
            {
              $addFields: {
                latestMenuUpdate: { $max: "$menuItems.updatedAt" },
              },
            },
            { $sort: { latestMenuUpdate: -1 } },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                "restaurantInfo.name": 1,
              },
            },
          ]);
          break;
        case "offerLatestChange":
          restaurants = await Firm.aggregate([
            { $match: query },
            {
              $lookup: {
                from: "offers",
                localField: "offer",
                foreignField: "_id",
                as: "offers",
              },
            },
            {
              $addFields: {
                latestOfferUpdate: { $max: "$offers.updatedAt" },
              },
            },
            { $sort: { latestOfferUpdate: -1 } },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                "restaurantInfo.name": 1,
              },
            },
          ]);
          break;

        case "reviewLatestChange":
          restaurants = await Firm.aggregate([
            { $match: query },
            {
              $lookup: {
                from: "reviews",
                localField: "reviews",
                foreignField: "_id",
                as: "firmReviews",
              },
            },
            {
              $addFields: {
                latestReviewUpdate: { $max: "$firmReviews.updatedAt" },
              },
            },
            { $sort: { latestReviewUpdate: -1 } },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                "restaurantInfo.name": 1,
              },
            },
          ]);
          break;

        case "mostOffers":
          restaurants = await Firm.aggregate([
            { $match: query },
            {
              $addFields: {
                offerCount: { $size: "$offer" },
              },
            },
            { $sort: { offerCount: -1 } },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                "restaurantInfo.name": 1,
              },
            },
          ]);
          break;
        case "clear":
          restaurants = await Firm.find({})
            .sort(sortOptions)
            .limit(limit)
            .select("_id restaurantInfo.name")
            .lean();
          break;
      }
    }

    if (!restaurants) {
      restaurants = await Firm.find(query)
        .sort(sortOptions)
        .limit(limit)
        .select("_id restaurantInfo.name")
        .lean();
    }

    historyLogRecorder(
      req,
      restaurants.constructor.modelName,
      "UPDATE",
      [],
      `Feching restaurant names with some sort of filter and pagination`
    );

    // Simple load balancing tied to pagination
    const calculateLoad = () => {
      let load = 0.3; // Base load

      // Increase load slightly if fetching subsequent pages
      if (lastId) {
        load += 0.2; // Additional load for paginated requests
      }

      // Minimal adjustment for sort/filter presence
      if (sortBy) load += 0.1;
      if (filterBy) load += 0.1;

      return Math.min(load, 1); // Cap at 100%
    };

    const responseData = {
      response: "ok",
      restaurants,
      nextCursor:
        restaurants.length === limit
          ? restaurants[restaurants.length - 1]._id
          : null,
      serverLoad: calculateLoad(),
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//search firm by name and address  ++++
router.get("/search-firm", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const users = await Firm.find({
      $or: [
        { "restaurantInfo.name": { $regex: searchTerm, $options: "i" } },
        { "restaurantInfo.address": { $regex: searchTerm, $options: "i" } },
      ],
    });
    // historyLogRecorder(
    //   req,
    //   restaurants.constructor.modelName,
    //   "READ",
    //   [],
    //   `Search for the user by name or address`
    // );

    res.json({ users: users });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.put("/update-firm-action/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isBookMarked, isBanned, isFlaged } = req.body;
    console.log(req.session.user);

    // Prepare update object dynamically
    const updateFields = {};
    if (isBookMarked !== undefined) {
      updateFields["restaurantInfo.isBookMarked"] = isBookMarked;
    }
    if (isBanned !== undefined) {
      updateFields["restaurantInfo.isBanned"] = isBanned;
    }
    if (isFlaged !== undefined) {
      updateFields["restaurantInfo.isFlaged"] = isFlaged;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ response: false, message: "No valid action provided" });
    }

    // Update firm with dynamic fields
    const firm = await Firm.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-reviews -offer -menu");

    // Check if the firm exists
    if (!firm) {
      return res.status(404).json({
        response: false,
        message: "Firm not found or no changes made",
      });
    }
    historyLogRecorder(
      req,
      firm.constructor.modelName,
      "UPDATE",
      [firm._id],
      `Get firm by id and update the firm with some action`
    );

    res.status(200).json({ response: true, firm: firm });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating firm" });
  }
});

// //bookmarked the firm
// router.put("/bookmark-firm/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isBookMarked } = req.query;
//     const firm = await Firm.updateOne(
//       { _id: id },
//       { $set: { "restaurantInfo.isBookMarked": isBookMarked } }
//     );
//     if (!firm) {
//       return res
//         .status(404)
//         .json({ response: false, message: "Firm not found" });
//     }
//     res.status(201).json({ response: true, firm: firm });
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });
// router.put("/banned-firm/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isBanned } = req.query;
//     const firm = await Firm.updateOne(
//       { _id: id },
//       { $set: { "restaurantInfo.isBanned": isBanned } }
//     );
//     if (!firm) {
//       return res
//         .status(404)
//         .json({ response: false, message: "Firm not found" });
//     }
//     res.status(201).json({ response: true, firm: firm });
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });
// router.put("/flagged-firm/:id", async (req, res) => {
//   try {
//     const { isFlaged } = req.query;
//     const firm = await Firm.updateOne(
//       { _id: id },
//       { $set: { "restaurantInfo.isFlaged": isFlaged } }
//     );
//     if (!firm) {
//       return res
//         .status(404)
//         .json({ response: false, message: "Firm not found" });
//     }
//     res.status(201).json({ response: true, firm: firm });
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

// router.get("/menu-item/:id", async (req, res) => {
//   try {
//     const menu = await Firm.findById(req.params.id).select("menu");
//     if (!menu) {
//       return res
//         .status(404)
//         .json({ response: false, message: "Firm not found" });
//     }
//     res.status(201).json({ response: true, menu: menu });
//     res;
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

// router.get("/delete-review/:id", async (req, res) => {
//   try {
//     const delReview = await Review.findByIdAndUpdate(
//       req.params.id,
//       { isTrashed: true },
//       { new: true }
//     );
//     if (!delReview) {
//       return res.status(401).json(
//         { response: false, message: "Review not found" },
//         {
//           new: true,
//         }
//       );
//     }
//     return res.status(201).json({
//       response: "ok",
//       message: "Review is deleted succesfully",
//       review: delReview,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ response: false, error: error.message });
//   }
// });

module.exports = router;
