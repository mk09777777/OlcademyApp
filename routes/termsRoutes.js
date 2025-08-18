const express = require("express");
const router = express.Router();
const termsController = require("../controller/termsController");

// Route to accept terms and conditions
router.post("/accept", termsController.acceptTerms);

module.exports = router;
