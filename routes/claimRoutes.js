// const express = require("express");
// const router = express.Router();
// const claimController = require("../controller/claimController");
// const multer = require("multer");

// // Multer middleware
// const upload = multer({ dest: "uploads/" });

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Claim:
//  *       type: object
//  *       properties:
//  *         method:
//  *           type: string
//  *           enum: [OTP, Document]
//  *           description: Method of claiming ownership
//  *         email:
//  *           type: string
//  *           description: Email address for verification
//  *         phoneNumber:
//  *           type: string
//  *           description: Phone number for verification
//  *         otp:
//  *           type: string
//  *           description: One-time password for verification
//  *         documents:
//  *           type: array
//  *           items:
//  *             type: string
//  *           description: Array of document URLs
//  *         registeredBusinessName:
//  *           type: string
//  *           description: Registered business name
//  *         status:
//  *           type: string
//  *           enum: [Pending, Approved, Rejected]
//  *           description: Claim status
//  */

// /**
//  * @swagger
//  * /claim-restaurant/verify:
//  *   post:
//  *     summary: Send OTP for claim verification
//  *     tags:
//  *        - Claim Restaurant
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Claim'
//  *     responses:
//  *       201:
//  *         description: OTP sent successfully
//  *       400:
//  *         description: Missing required fields
//  */

// /**
//  * @swagger
//  * /claim-restaurant/validate-otp:
//  *   post:
//  *     summary: Validate OTP for claim
//  *     tags:
//  *        - Claim Restaurant
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Claim'
//  *     responses:
//  *       200:
//  *         description: OTP verified successfully
//  *       400:
//  *         description: Invalid OTP or details
//  */

// /**
//  * @swagger
//  * /claim-restaurant/document:
//  *   post:
//  *     summary: Submit a document-based claim
//  *     tags:
//  *        - Claim Restaurant
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               document:
//  *                 type: string
//  *                 format: binary
//  *                 description: Upload document
//  *               email:
//  *                 type: string
//  *               phoneNumber:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Claim submitted successfully
//  */

// router.post("/claim-restaurant/verify", claimController.verifyClaim);
// router.post("/claim-restaurant/validate-otp", claimController.validateOtp);
// router.post(
//   "/claim-restaurant/document",
//   upload.single("document"),
//   claimController.uploadClaim
// );

// module.exports = router;

const express = require("express");
const multer = require("multer");
const {
  verifyClaim,
  validateOtp,
  uploadClaim,
} = require("../controller/claimController");
const { isAuthenticated } = require("../config/authHandlers");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/claim-restaurant/verify", isAuthenticated, verifyClaim);
router.post("/claim-restaurant/validate-otp", isAuthenticated, validateOtp);
router.post(
  "/claim-restaurant/document",
  isAuthenticated,
  upload.single("document"),
  uploadClaim
);
module.exports = router;
