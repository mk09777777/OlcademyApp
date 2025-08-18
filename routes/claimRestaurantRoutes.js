// Routes: claimRestaurantRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  changeRestaurantStatus,
} = require("../controller/claimRestaurantController");
const { isAuthenticated } = require("../config/authHandlers");
// Routes
router.get("/restaurants", isAuthenticated, getAllRestaurants);
router.get("/restaurants/:id", isAuthenticated, getRestaurantById);
router.post("/restaurants", isAuthenticated, createRestaurant);
router.put("/restaurants/:id", isAuthenticated, updateRestaurant);
router.put("/restaurants/:id/status", isAuthenticated, changeRestaurantStatus);
router.delete("/restaurants/:id", isAuthenticated, deleteRestaurant);

module.exports = router;
