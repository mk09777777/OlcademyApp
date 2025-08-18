const { logHistory } = require("../logger/storageSchema");
const Firm = require("../models/Firm");
const Offer = require("../models/offer");
const Review = require("../models/Reviews");
const MenuItem = require("../models/MenuItem");
const mongoose = require("mongoose");

const registerLogWithReponseTime = (req) => {
  const customMessage = [
    { route: "/", message: "You visit the root route" },
    { route: "/add", message: `The user now added its firm` },
    { route: "/update", message: "He update its firm" },
  ];

  if (req.originalUrl) {
    const message = customMessage.find(
      ({ route, message }) => req.originalUrl === route
    ).message;
    logHistory(req, message, req.actorType);
  }
};

const insertData = async (data) => {
  // console.log("Yash Data aa gaya superb is:", data)
  try {
    let menuOps = [];
    let reviewOps = [];
    let restaurantOps = [];
    let menuUpdates = [];
    let reviewUpdates = [];

    for (let i = 0; i < data.length; i++) {
      let { reviews, menu, ...restaurantData } = data[i];

      // const additionField = {
      //   isBookMarked: false,
      //   isFlaged: false,
      //   isBanned: false,
      // };
      if (restaurantData.restaurantInfo.cuisines !== null) {
        restaurantData.restaurantInfo.cuisines =
          restaurantData.restaurantInfo.cuisines
            .split(",")
            .map((el) => el.trim());
        // console.log(restaurantData.restaurantInfo.cuisines);
      }

      restaurantData.isBookMarked = false;
      restaurantData.isFlaged = false;
      restaurantData.isBanned = false;

      // Generate a unique firmId for the restaurant
      const firmId = new mongoose.Types.ObjectId();

      // **Step 1: Insert Menu Items & Store Their IDs**
      let menuItemIds = [];
      if (menu?.menuTabs && Array.isArray(menu.menuTabs)) {
        for (let tab of menu.menuTabs) {
          for (let section of tab.sections) {
            if (section.items && section.items.length > 0) {
              let menuItems = section.items.map((item) => ({
                ...item,
                firm: firmId, // Reference firm
              }));

              // Bulk insert menu items
              let insertedMenuItems = await MenuItem.insertMany(menuItems);
              let insertedIds = insertedMenuItems.map((item) => item._id);

              // Update menu items with their IDs
              menuItemIds.push(...insertedIds);
              section.items = insertedIds; // Replace objects with ObjectIds
            }
          }
        }
      }

      // **Step 2: Insert Reviews & Store Their IDs**
      let reviewIds = [];
      if (reviews && reviews.length > 0) {
        let reviewDocs = reviews.map(
          ({ author_name, date, rating, comments, aspects }) => {
            if (aspects) {
              aspects = {
                ...aspects,
                service: aspects.service ? Number(aspects.service) || 0 : 0, // Convert to Number, default 0
                food: aspects.food ? Number(aspects.food) || 0 : 0,
                atmosphere: aspects.atmosphere
                  ? Number(aspects.atmosphere) || 0
                  : 0,
              };
            }

            return {
              authorName: author_name,
              date: Date.now(),
              days: date,
              rating,
              comments,
              aspects,
              firm: firmId, // Reference to Firm
            };
          }
        );

        // Bulk insert reviews
        let insertedReviews = await Review.insertMany(reviewDocs);
        reviewIds = insertedReviews.map((review) => review._id);
      }

      // **Step 3: Insert Firm with References**
      restaurantOps.push({
        updateOne: {
          filter: {
            "restaurantInfo.name": restaurantData.restaurantInfo.name,
            "restaurantInfo.address": restaurantData.restaurantInfo.address,
          },
          update: {
            $setOnInsert: {
              _id: firmId,
              isBookMarked: false,
              isFlaged: false,
              isBanned: false,
            }, // Only set `_id` if it's a new insert
            $set: {
              ...restaurantData,
              menu: menu, // Store reference IDs in menu
              reviews: reviewIds, // Store review references
            },
          },
          upsert: true,
          setDefaultsOnInsert: true,
        },
      });

      // **Step 4: Update MenuItems & Reviews to Reference Firm**
      menuUpdates.push(
        ...menuItemIds.map((menuItemId) => ({
          updateOne: {
            filter: { _id: menuItemId },
            update: { $set: { firm: firmId } },
          },
        }))
      );

      reviewUpdates.push(
        ...reviewIds.map((reviewId) => ({
          updateOne: {
            filter: { _id: reviewId },
            update: { $set: { firm: firmId } },
          },
        }))
      );
    }

    // Execute bulk insert/update operations
    if (restaurantOps.length > 0) {
      await Firm.bulkWrite(restaurantOps);
      console.log("Superb You Done It", restaurantOps);
    }
    if (menuUpdates.length > 0) {
      await MenuItem.bulkWrite(menuUpdates);
      console.log("Superb You Done It ✅", menuUpdates);
    }
    if (reviewUpdates.length > 0) {
      await Review.bulkWrite(reviewUpdates);
      console.log("Superb You Done It ✅", reviewUpdates);
    } else {
      console.log("Try Again ❌");
    }

    console.log("✅ Bulk Data Inserted Successfully with Two-Way Referencing");
  } catch (error) {
    console.error("❌ Error Inserting Data:", error);
  }
};

// const insertData = async (data) => {
//   try {
//     // Prepare operations for Menu, Reviews, and Restaurants
//     let menuItemsToInsert = [];
//     let reviewsToInsert = [];
//     let firmsToInsert = [];

//     for (let i = 0; i < data.length; i++) {
//       let { reviews, menu, ...restaurantData } = data[i];

//       // Assign default values if not present in the scraped data
//       restaurantData.isBookMarked = restaurantData.isBookMarked || false;
//       restaurantData.isFlaged = restaurantData.isFlaged || false;
//       restaurantData.isBanned = restaurantData.isBanned || false;

//       // Handle cuisines if not null
//       if (restaurantData.restaurantInfo?.cuisines) {
//         restaurantData.restaurantInfo.cuisines =
//           restaurantData.restaurantInfo.cuisines
//             .split(",")
//             .map((el) => el.trim());
//       }

//       // Generate a unique firmId for the restaurant
//       const firmId = new mongoose.Types.ObjectId();

//       // ✅ Insert Menu Items and Associate with Firm
//       let menuItemIds = [];
//       if (menu?.menuTabs && Array.isArray(menu.menuTabs)) {
//         menu.menuTabs.forEach((tab) => {
//           tab.sections?.forEach((section) => {
//             if (section.items && section.items.length > 0) {
//               section.items.forEach((item) => {
//                 menuItemsToInsert.push({
//                   ...item,
//                   firm: firmId, // Associate menu items with firmId
//                 });
//               });
//             }
//           });
//         });
//       }

//       // ✅ Insert Reviews and Associate with Firm
//       let reviewIds = [];
//       if (reviews && reviews.length > 0) {
//         reviews.forEach(({ author_name, date, rating, comments, aspects }) => {
//           aspects = aspects || {};
//           reviewsToInsert.push({
//             authorName: author_name,
//             date: Date.now(),
//             days: date,
//             rating: rating || 0,
//             comments,
//             aspects: {
//               service: Number(aspects.service) || 0,
//               food: Number(aspects.food) || 0,
//               atmosphere: Number(aspects.atmosphere) || 0,
//             },
//             firm: firmId,
//           });
//         });
//       }

//       // ✅ Prepare Firm Insert
//       firmsToInsert.push({
//         _id: firmId,
//         ...restaurantData,
//         menu: [], // Will be updated with menuItemIds later
//         reviews: [], // Will be updated with reviewIds later
//       });
//     }

//     // ✅ Bulk Insert Menu Items
//     if (menuItemsToInsert.length > 0) {
//       let insertedMenuItems = await MenuItem.insertMany(menuItemsToInsert);
//       let menuItemIdMap = {};
//       insertedMenuItems.forEach((item) => {
//         menuItemIdMap[item.firm.toString()] =
//           menuItemIdMap[item.firm.toString()] || [];
//         menuItemIdMap[item.firm.toString()].push(item._id);
//       });

//       // Assign menu item IDs to respective firms
//       firmsToInsert.forEach((firm) => {
//         firm.menu = menuItemIdMap[firm._id.toString()] || [];
//       });
//     }

//     // ✅ Bulk Insert Reviews
//     if (reviewsToInsert.length > 0) {
//       let insertedReviews = await Review.insertMany(reviewsToInsert);
//       let reviewIdMap = {};
//       insertedReviews.forEach((review) => {
//         reviewIdMap[review.firm.toString()] =
//           reviewIdMap[review.firm.toString()] || [];
//         reviewIdMap[review.firm.toString()].push(review._id);
//       });

//       // Assign review IDs to respective firms
//       firmsToInsert.forEach((firm) => {
//         firm.reviews = reviewIdMap[firm._id.toString()] || [];
//       });
//     }

//     // ✅ Bulk Insert Firms
//     if (firmsToInsert.length > 0) {
//       await Firm.insertMany(firmsToInsert, { ordered: false });
//       console.log("✅ Data inserted successfully with references!");
//     } else {
//       console.log("⚠️ No data to insert.");
//     }
//   } catch (error) {
//     console.error("❌ Error inserting data:", error);
//   }
// };

module.exports = { registerLogWithReponseTime, insertData };
