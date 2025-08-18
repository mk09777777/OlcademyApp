// const express = require("express");
// const firmController = require("../controller/firmController");
// const verifyToken = require("../middleware/verifyToken");
// const multer = require("multer");
// const router = express.Router();

// const upload = multer({ storage: multer.memoryStorage() });
// const { isAuthenticated } = require("../config/authHandlers");
// const authMiddleware = require("../middleware/auth");
// // router.get("/filters", isAuthenticated, filterFirmsByRating);
// router.get("/filters", firmController.filterFirmsByUser);
// router.get("/similar", firmController.getSimilarRestaurants);
// // new routes-------------------------------------------------

// router.post("/update-restaurant-status", firmController.updateRestaurantStatus);

// router.get("/getOne/:id", firmController.getFirmById);

// router.get("/get-all/restaurants", firmController.getAllRestaurants);

// router.get("/restaurants/menu/:restaurantId", firmController.getRestaurantMenu);

// router.get("/restaurants/menu-tabs/:restaurantId", firmController.getMenuTabs);

// router.get(
//   "/restaurants/menu-sections/:restaurantId",
//   firmController.getMenuSections
// );

// router.get(
//   "/restaurants/menu-sections-items/:restaurantId",
//   firmController.getMenuSectionsWithItems
// );

// router.get(
//   "/restaurants/menu-images/:restaurantId",
//   firmController.getMenuImages
// );

// router.get("/restaurants/phone/:restaurantId", firmController.getPhoneNumber);

// router.get("/restaurants/address/:restaurantId", firmController.getAddress);

// router.get("/restaurants/instagram/:restaurantId", firmController.getInstagram);

// router.get(
//   "/restaurants/additional-info/:restaurantId",
//   firmController.getAdditionalInfo
// );

// router.get(
//   "/restaurants/overview/:restaurantId",
//   firmController.getRestaurantOverview
// );

// router.get(
//   "/restaurants/ratings/:restaurantId",
//   firmController.getRestaurantRatings
// );

// router.get(
//   "/restaurants/filter-by-ratings",
//   firmController.getRestaurantsByRatings
// );

// router.get("/restaurants/faqs/:restaurantId", firmController.getRestaurantFAQs);

// router.get(
//   "/restaurants/images/:restaurantId",
//   firmController.getRestaurantImages
// );

// router.get(
//   "/restaurants/opening-hours/:restaurantId",
//   firmController.getRestaurantOpeningHours
// );
// // -----------------------------------------------------------

// // router.post("/add-firm", verifyToken, firmController.addFirm);

// router.get("/uploads/:imageName", (req, res) => {
//   const imageName = req.params.imageName;
//   res.headersSent("Content-Type", "image/jpeg");
//   res.sendFile(path.join(__dirname, "..", "uploads", imageName));
// });

// router.delete("/:firmId", firmController.deleteFirmById);

// router.get("/search", firmController.searchFirmByName);

// // router.get('/filter/pure-veg',firmController.pureVegFirms);

// router.get("/filter/num-rating", firmController.filterFirmsByRating);

// router.get("/filter/offers", firmController.filterFirmsWithOffers);

// router.get("/filter-by-cuisines", firmController.filterFirmsByCuisines);

// router.get("/filter-by-dietary", firmController.filterFirmByDietary);

// router.get("/sort-by-popularity", firmController.sortFirmsByPopularity);

// router.get("/filter-firms", firmController.filterFirms);

// //excel upload
// router.post("/excel-upload", firmController.excelBulkUpload);

// //new route for checking whether addRestaurant is working or not without authentication
// router.get("/test-route", (req, res) => {
//   res.status(200).json({ message: "Test route successful" });
// });

// router.post("/test-add-restaurant", firmController.testAddRestaurant);

// module.exports = router;

const express = require("express");

const firmController = require("../controller/firmController");
const tiffinController = require("../controller/tiffinController"); // Add tiffin controller import
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const router = express.Router();
const path = require("path"); // Added path import for file handling
const fs = require("fs");

// Configure storage for document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads/documents directory if it doesn't exist
    const dir = "uploads/documents";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Get document type from the request
    const documentType = req.body.documentType || "document";

    // Get original file extension
    const ext = path.extname(file.originalname);

    // Create more descriptive filename
    // Format: documentType-serviceId-timestamp.extension
    const serviceId = req.body.restaurantId || req.body.tiffinId || "unknown";
    const timestamp = Date.now();

    const newFilename = `${documentType}-${serviceId.substring(
      0,
      8
    )}-${timestamp}${ext}`;

    cb(null, newFilename);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Currently we are only allowing files which are up to 5MB
  },
});

const { isAuthenticated } = require("../config/authHandlers");
const authMiddleware = require("../middleware/auth");
const {
  getrecently_viewedrest,
  recentlyviewed_rest,
} = require("../controller/recentlyviewrest");
const {
  updatelikedByUser,
  getLikedRestaurantsByUser,
  likedByUser,
} = require("../controller/user/likebyuser");
//addrecentlyviewedrestaurants
router.get("/user/:id/islike", likedByUser);
router.get("/user/liked-restaurants", getLikedRestaurantsByUser);
router.post("/users/:id/liked", updatelikedByUser);
router.get("/getrecently-viewed", getrecently_viewedrest);
router.post("/recently-viewed/:id", recentlyviewed_rest);

// Restaurant routes
router.post("/addRestaurant", firmController.addRestaurant);

// Tiffin routes - Add these new routes
router.post("/addTiffin", tiffinController.addTiffin);
router.post(
  "/upload-tiffin-document",
  upload.single("document"),
  tiffinController.uploadTiffinDocument
);
router.get("/restaurants/get-reviews/:id", firmController.getFirmReviewsById);
router.get("/tiffinDocuments/:tiffinId", tiffinController.getTiffinDocuments);
router.delete(
  "/tiffinDocuments/:tiffinId/:documentType",
  tiffinController.deleteTiffinDocument
);
router.post(
  "/complete-tiffin-registration",
  tiffinController.completeTiffinRegistration
);

// Existing routes
// router.get("/filters", firmController.filterFirmsByUser);
// router.get("/similar", firmController.getSimilarRestaurants);
const getuserbaseRest_advfilter_similar = require("../controller/firm/getuserbaseRest_advfilter_similar");
// // router.get("/filters", isAuthenticated, filterFirmsByRating);
router.get("/getnearbyrest", getuserbaseRest_advfilter_similar.getRestaurants);
// // new routes-------------------------------------------------

router.post("/update-restaurant-status", firmController.updateRestaurantStatus);

router.get("/getOne/:id", firmController.getFirmById);

router.get("/get-all/restaurants", firmController.getAllRestaurants);

router.get("/get/newRestaurant", firmController.getNewRestaurants);

router.get("/get/tiffins", tiffinController.getAllTiffins);

router.get("/restaurants/menu/:restaurantId", firmController.getRestaurantMenu);

router.get("/restaurants/menu-tabs/:restaurantId", firmController.getMenuTabs);

router.get(
  "/restaurants/menu-sections/:restaurantId",
  firmController.getMenuSections
);

router.get(
  "/restaurants/menu-sections-items/:restaurantId",
  firmController.getMenuSectionsWithItems
);

router.get(
  "/restaurants/menu-images/:restaurantId",
  firmController.getMenuImages
);

router.post("/fav/:id", firmController.addFavorite);
router.get("/favCheck/:id", firmController.checkFavorite);
router.post("/favRemove/:id", firmController.removeFavorite);
router.get("/fav", firmController.getFavoriteRestaurants);
router.get("/restaurants/phone/:restaurantId", firmController.getPhoneNumber);

router.get("/restaurants/address/:restaurantId", firmController.getAddress);

router.get("/restaurants/instagram/:restaurantId", firmController.getInstagram);

router.get(
  "/restaurants/additional-info/:restaurantId",
  firmController.getAdditionalInfo
);

router.get(
  "/restaurants/overview/:restaurantId",
  firmController.getRestaurantOverview
);

router.get(
  "/restaurants/ratings/:restaurantId",
  firmController.getRestaurantRatings
);

router.get(
  "/restaurants/filter-by-ratings",
  firmController.getRestaurantsByRatings
);

router.get("/restaurants/faqs/:restaurantId", firmController.getRestaurantFAQs);

router.get(
  "/restaurants/images/:restaurantId",
  firmController.getRestaurantImages
);

router.get(
  "/restaurants/opening-hours/:restaurantId",
  firmController.getRestaurantOpeningHours
);
// -----------------------------------------------------------

// router.post("/add-firm", verifyToken, firmController.addFirm);

router.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.header("Content-Type", "image/jpeg"); // Fixed typo: headersSent to header
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});

router.delete("/:firmId", firmController.deleteFirmById);

router.get("/search", firmController.searchFirmByName);

// router.get('/filter/pure-veg',firmController.pureVegFirms);

router.get("/filter/num-rating", firmController.filterFirmsByRating);

router.get("/filter/offers", firmController.filterFirmsWithOffers);

router.get("/filter-by-cuisines", firmController.filterFirmsByCuisines);

router.get("/filter-by-dietary", firmController.filterFirmByDietary);

router.get("/sort-by-popularity", firmController.sortFirmsByPopularity);

router.get("/filter-firms", firmController.filterFirms);

//excel upload
router.post("/excel-upload", firmController.excelBulkUpload);

//new route for checking whether addRestaurant is working or not without authentication
router.get("/test-route", (req, res) => {
  res.status(200).json({ message: "Test route successful" });
});

router.post("/test-add-restaurant", firmController.testAddRestaurant);

router.get("/getAllRestaurants1", firmController.getAllRestaurants1);

// Add an endpoint to handle document uploads - generic handler compatible with both tiffin and restaurant
// router.post("/upload-document", upload.single("document"), async (req, res) => {
//   try {
//     const { documentType, restaurantId, tiffinId, serviceType } = req.body;
//     const file = req.file;

//     if (!file || !documentType || (!restaurantId && !tiffinId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     // Determine which controller to use based on serviceType
//     if (serviceType === "tiffin" && tiffinId) {
//       req.body.tiffinId = tiffinId; // Ensure tiffinId is in the request body
//       return tiffinController.uploadTiffinDocument(req, res);
//     } else if (restaurantId) {
//       return firmController.uploadDocument(req, res);
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid service type or missing ID",
//       });
//     }
//   } catch (error) {
//     console.error("Error uploading document:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       details: error.message,
//     });
//   }
// });

// In firmRoutes.js, modify the upload-document route to this:
router.post("/upload-document", upload.single("document"), async (req, res) => {
  try {
    const { documentType, restaurantId, tiffinId, serviceType } = req.body;
    const file = req.file;

    if (!file || !documentType || (!restaurantId && !tiffinId)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Determine which method to use based on service type
    if (serviceType === "tiffin" && tiffinId) {
      // Use tiffin document upload method
      return tiffinController.uploadTiffinDocument(req, res);
    } else if (restaurantId) {
      // Create a method in firmController to handle document upload
      return firmController.uploadDocument(req, res);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid service type or missing ID",
      });
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      details: error.message,
    });
  }
});

// Add endpoint for completing registration
router.post("/complete-registration", async (req, res) => {
  try {
    const { restaurantId, tiffinId, termsAccepted, serviceType } = req.body;

    if ((!restaurantId && !tiffinId) || !termsAccepted) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Determine which controller to use based on serviceType or presence of specific ID
    if (serviceType === "tiffin" || tiffinId) {
      req.body.tiffinId = tiffinId; // Ensure tiffinId is in the request body
      return tiffinController.completeTiffinRegistration(req, res);
    } else {
      // Handle restaurant registration completion
      return firmController.completeRegistration(req, res);
    }
  } catch (error) {
    console.error("Error completing registration:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      details: error.message,
    });
  }
});

module.exports = router;
