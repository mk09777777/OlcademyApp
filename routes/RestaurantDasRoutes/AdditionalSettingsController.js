const express = require("express");
const {
  additionalOutletSettings,
  updateRestaurantsDetails,
} = require("../../controller/RestaurantDasController/AdditionalSettingsController");
const router = express.Router();
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
router.post(
  "/outletAdditionalSettings/:id",
  authenticateToken,
  additionalOutletSettings
);
router.put(
  "/update-restaurant-details/:id",
  authenticateToken,
  updateRestaurantsDetails
);

module.exports = router;
