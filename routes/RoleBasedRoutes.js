const {
  dashboard,
  Sign,
  getMyProfile,
  getProfile,
} = require("../controller/DashboardToken/LoginFunctionalityForADashboards");
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../controller/DashboardToken/JWT");

router.post("/sign", Sign);
router.post("/login", dashboard);
router.get("/profile", authenticateToken, getMyProfile);
router.get("/das/profile", authenticateToken, getProfile);
module.exports = router;
