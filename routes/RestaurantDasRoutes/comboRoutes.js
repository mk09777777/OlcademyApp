const express = require("express");
const router = express.Router();
const Combo = require("../../models/RestaurantsDasModel/combo");
const Item = require("../../models/RestaurantsDasModel/item");
const MenuItem = require("../../models/MenuItem");
const mongoose = require("mongoose");
const Firm = require("../../models/Firm");
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
// Create a new combo
const { isAuthenticatedDashboard } = require("../../config/authHandlers");
router.post("/:id", authenticateToken, async (req, res) => {
  try {
    const resturantId = req.params.id;

    // Validate resturantId format
    if (!mongoose.Types.ObjectId.isValid(resturantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // Check if the firm exists
    const firm = await Firm.findById(resturantId);
    if (!firm) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { name, price, items } = req.body;

    // Validate required fields
    if (!name || !price || !items || items.length === 0) {
      return res.status(400).json({
        message: "Combo name, price, and at least one item are required",
      });
    }

    // Validate all item IDs exist
    const itemIds = items.map((item) => item.itemId);
    const validItems = await MenuItem.find({ _id: { $in: itemIds } });
    if (validItems.length !== items.length) {
      return res.status(400).json({ message: "Invalid items in combo" });
    }

    // Log the data being saved for debugging
    console.log("Creating combo with data:", {
      name,
      price,
      firm: resturantId,
      items,
    });

    // Create new combo
    const newCombo = await Combo.create({
      name,
      price,
      firm: resturantId,
      items: items.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
      })),
    });

    res.status(201).json({
      message: "Combo created successfully",
      combo: newCombo,
    });
  } catch (error) {
    console.error("Error creating combo:", error);
    res.status(500).json({ message: "Failed to create combo" });
  }
});

// Get all combos with item details populated
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const restaurantId = req.params.id;

    // Validate restaurantId format
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // Query combos by firm and populate items.itemId
    const combos = await Combo.find({ firm: restaurantId }).populate({
      path: "items.itemId",
      select:
        "_id name price description type categoryId subcategoryId category serviceType dishDetails images firm createdAt updatedAt",
      model: "MenuItem",
    });

    // Check if combos exist
    if (!combos || combos.length === 0) {
      return res
        .status(404)
        .json({ message: "No combos found for this restaurant" });
    }

    res.json(combos);
  } catch (error) {
    console.error("Error fetching combos:", error);
    res.status(500).json({ message: "Failed to fetch combos" });
  }
});
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const comboId = req.params.id;
    console.log(`Attempting to delete combo with ID: ${comboId}`);
    if (!mongoose.Types.ObjectId.isValid(comboId)) {
      console.log("Invalid combo ID format");
      return res.status(400).json({ message: "Invalid combo ID format" });
    }
    const combo = await Combo.findById(comboId);
    if (!combo) {
      console.log("Combo not found");
      return res.status(404).json({ message: "Combo not found" });
    }
    await Combo.findByIdAndDelete(comboId);
    console.log(`Combo ${comboId} deleted successfully`);
    res.status(200).json({ message: "Combo deleted successfully", comboId });
  } catch (error) {
    console.error("Error deleting combo:", error);
    res
      .status(500)
      .json({ message: "Failed to delete combo", error: error.message });
  }
});

// Create a new combo
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, price, items } = req.body;

    // Validate required fields
    if (!name || !price || !items || items.length === 0) {
      return res.status(400).json({
        message: "Combo name, price, and at least one item are required",
      });
    }

    // Validate all item IDs exist
    const itemIds = items.map((item) => item.itemId);
    const validItems = await Item.find({ _id: { $in: itemIds } });
    if (validItems.length !== items.length) {
      return res.status(400).json({ message: "Invalid items in combo" });
    }

    // Create new combo
    const newCombo = await Combo.create({
      name,
      price,
      items: items.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
      })),
    });

    res.status(201).json({
      message: "Combo created successfully",
      combo: newCombo,
    });
  } catch (error) {
    console.error("Error creating combo:", error);
    res.status(500).json({ message: "Failed to create combo" });
  }
});

// Get all combos with item details populated
router.get("/", authenticateToken, async (req, res) => {
  try {
    const combos = await Combo.find().populate({
      path: "items.itemId",
      select: "name type categoryId subcategoryId pricing",
    });
    res.json(combos);
  } catch (error) {
    console.error("Error fetching combos:", error);
    res.status(500).json({ message: "Failed to fetch combos" });
  }
});

module.exports = router;
