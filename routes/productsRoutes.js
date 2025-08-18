const express = require("express");
const productController = require("../controller/productController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: APIs related to products
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         firmId:
 *           type: string
 *           description: ID of the associated firm
 *
 * /add-product/{firmId}:
 *   post:
 *     summary: Add a product to a firm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: firmId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the firm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product added successfully
 *
 * /{firmId}/products:
 *   get:
 *     summary: Get products by firm ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: firmId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the firm
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *
 * /:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */

// router.post("/add-product/:firmId", productController.addProduct);
// router.get("/:firmId/products", productController.getProductByFirm);

// router.get("/uploads/:imageName", (req, res) => {
//   const imageName = req.params.imageName;
//   res.headersSent("Content-Type", "image/jpeg");
//   res.sendFile(path.join(__dirname, "..", "uploads", imageName));
// });
// router.get("/:productId", productController.getProductById);
// router.delete(
//   "/delete-product/:productId",
//   productController.deleteProductById
// );
// router.patch("/update-product/:productId", productController.updateProduct);
// router.get("/search", productController.searchByDishOrFirm);

module.exports = router;
