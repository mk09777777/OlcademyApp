const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("../models/user"); // adjust path to your User mode

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Clearing recently viewed restaurants for all users...");

    await User.updateMany({}, { $set: { recentlyViewed: [] } });

    console.log(" Successfully cleared recentlyViewed for all users.");
  } catch (err) {
    console.error(" Error clearing recentlyViewed:", err);
  }
});
