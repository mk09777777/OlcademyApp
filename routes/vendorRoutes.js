// const vendorController = require("../controller/vendorController");
// const express = require("express");
// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   - name: Vendors
//  *     description: APIs related to vendors
//  *
//  * components:
//  *   schemas:
//  *     Vendor:
//  *       type: object
//  *       properties:
//  *         name:
//  *           type: string
//  *           description: Name of the vendor
//  *         email:
//  *           type: string
//  *           description: Email address of the vendor
//  *         password:
//  *           type: string
//  *           description: Password for vendor login
//  *
//  * /register:
//  *   post:
//  *     summary: Register a new vendor
//  *     tags: [Vendors]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Vendor'
//  *     responses:
//  *       201:
//  *         description: Vendor registered successfully
//  *
//  * /login:
//  *   post:
//  *     summary: Vendor login
//  *     tags: [Vendors]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Vendor logged in successfully
//  *
//  * /all-vendors:
//  *   get:
//  *     summary: Get all vendors
//  *     tags: [Vendors]
//  *     responses:
//  *       200:
//  *         description: List of vendors retrieved successfully
//  *
//  * /single-vendor/{id}:
//  *   get:
//  *     summary: Get a vendor by ID
//  *     tags: [Vendors]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID of the vendor
//  *     responses:
//  *       200:
//  *         description: Vendor details retrieved successfully
//  */

// // url to register a vendor
// router.post("/register", vendorController.vendorRegister);

// // url for vendor to login
// router.post("/login", vendorController.vendorLogin);

// // to get all vendors data
// router.get("/all-vendors", vendorController.getAllVendors);

// // get data by vendor id
// router.get("/single-vendor/:id", vendorController.getVendorById);

// module.exports = router;
