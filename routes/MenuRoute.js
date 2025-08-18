const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// Fetch MenuItem by ID and populate firm
router.get("/menu-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id).populate("firm");

    if (!menuItem) {
      return res.status(404).json({ message: "MenuItem not found" });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error("Error fetching MenuItem:", error);
    res.status(500).json({ message: "An error occurred while fetching the MenuItem" });
  }
});

module.exports = router;
