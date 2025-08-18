const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
} = require("../config/authHandlers");
const {
  createAddresses,
  getAddressesByCity,
  getAddressesByLocality,
  getLocationData,
  getUserSavedAddress,
  CreateUserAddress,
  editUserAddress,
  deleteUserAddress
} = require("../controller/addressController");

router.post("/api/addresses", createAddresses);
router.get("/api/addresses/:city", getAddressesByCity);
router.get("/api/addresses/locality/:locality", getAddressesByLocality);
router.get("/api/location", getLocationData);
router.get("/api/getSavedAddress",isAuthenticated,getUserSavedAddress)
router.post("/api/createUserAddress",isAuthenticated,CreateUserAddress)
router.put("/api/UpdateUserAddress/:id",isAuthenticated,editUserAddress)
router.delete("/api/DeleteUserAddress/:id",isAuthenticated,deleteUserAddress)


module.exports = router;