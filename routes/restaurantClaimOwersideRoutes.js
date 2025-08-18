const express = require("express");
const multer = require("multer");
const {
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
  approve,
  getRestaurantByOwnerName,
  getAllRestaurantByOwnerName,
  getRestaurantByOwnerNameAndByRestaurantId,
} = require("../controller/restaurantClaimController");
const { isAuthenticated } = require("../config/authHandlers");
const { authenticateToken } = require("../controller/DashboardToken/JWT");
const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  upload.fields([
    { name: "proofOfOwnership", maxCount: 1 },
    { name: "foodServicesPermit", maxCount: 1 },
    { name: "additionalDocuments", maxCount: 1 },
  ]),
  createClaim
);

router.get("/", getAllClaims);
router.get("/owner/:userId/:id", authenticateToken, getRestaurantByOwnerName);
router.get("/:id", getClaimById);
router.get("/getall-owner/:id", authenticateToken, getAllRestaurantByOwnerName);
router.get(
  "/get-owner-restid/:ownerId/:_id",
  getRestaurantByOwnerNameAndByRestaurantId
);
router.put(
  "/:id",
  upload.fields([
    { name: "proofOfOwnership", maxCount: 1 },
    { name: "foodServicesPermit", maxCount: 1 },
    { name: "additionalDocuments", maxCount: 1 },
  ]),
  updateClaim
);

router.patch("/approve/:name", approve);

router.delete("/:id", deleteClaim);

module.exports = router;
