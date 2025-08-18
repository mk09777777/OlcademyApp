const express = require("express");
const router = express.Router();
const taxController = require("../../controller/RestaurantDasController/TaxesControllers");
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
// GET all taxes
router.get("/", authenticateToken, taxController.getTaxes);

// GET a specific tax by id
router.get("/:id", authenticateToken, taxController.getTaxById);
router.post("/createtax", authenticateToken, taxController.createTax);

// POST a new tax
router.post("/", authenticateToken, taxController.createTax);
router.put("/update/:id", authenticateToken, taxController.updateTax);
// PUT update an existing tax
router.put("/:id", authenticateToken, taxController.updateTax);
// DELETE a tax
router.delete("/delete/:id", authenticateToken, taxController.deleteTax);
// DELETE a tax
router.delete("/:id", authenticateToken, taxController.deleteTax);

// PATCH to toggle tax applicability (only for non-compulsory taxes)
router.patch("/:id/toggle", authenticateToken, taxController.toggleTax);

module.exports = router;
