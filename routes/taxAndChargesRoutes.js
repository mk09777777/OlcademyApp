const express = require("express");
const router = express.Router();
const taxAndChargesController = require("../controller/taxAndChargesController");
const { authenticateToken } = require("../controller/DashboardToken/JWT");
// Route to add taxes
router.post("/taxes", authenticateToken, taxAndChargesController.addTax);

// Route to update taxes
router.put("/taxes/:id", authenticateToken, taxAndChargesController.updateTax);

// Route to get taxes
router.get("/taxes", authenticateToken, taxAndChargesController.getTaxes);

// Route to delete a tax by id
router.delete(
  "/taxes/:id",
  authenticateToken,
  taxAndChargesController.deleteTax
);

module.exports = router;
