const express = require("express");
const {
  addItemToCart,
  fetchCart,
  cartLength,
  updateCart,
} = require("../controller/TakeAway/CartControllers");

const router = express.Router();

router.post("/cart", addItemToCart);

router.get("/cart", fetchCart);
router.get("/count", cartLength);
router.put("/cart", updateCart);
module.exports = router;
