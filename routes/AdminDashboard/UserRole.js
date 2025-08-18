const express = require("express");
const router = express.Router();
const User = require("../../models/user");


router.get("/vendors", async (req, res) => {
  try {
    const vendors = await User.find({
      role: { $in: ["kitchenOwner", "restaurantOwner", "eventCreator"] },
    }).select("-password"); 
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});




router.get("/user-vendor-summary", async (_req, res) => {
  try {
    const users = await User.find({}, "role");

    let userCount   = 0;
    let vendorCount = 0;

    users.forEach(({ role }) => {
      const isVendor =
        role.includes("kitchenOwner") || role.includes("restaurantOwner")||role.includes("moderator");

      if (isVendor) {
        vendorCount++;             
      } else if (role.includes("user")) {
        userCount++;                 
      }
    });

    return res.json([
      { name: "Users",   value: userCount   },
      { name: "Vendors", value: vendorCount }
    ]);
  } catch (err) {
    console.error("User‑vendor summary failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;



