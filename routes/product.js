const { Router } = require("express");
const router = Router();
const productController = require("../controllers/product");
const multer = require("multer");
const { storage } = require("../config/multerConfig");
const upload = multer({ storage });

router.post(
  "/:id/add-product",
  upload.array("images", 5),
  productController.addProduct
);

router.get("/:id/all-products", productController.getAllProduct);

module.exports = router;
