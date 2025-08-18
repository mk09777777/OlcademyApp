const express = require("express");
const router = express.Router();
const firmController = require("../controllers/firm");
const multer = require("multer");
const { storage } = require("../config/multerConfig");
const upload = multer({ storage }); //limiit file size to 2mb
// const upload = multer({ dest: "/uploads" }); //limiit file size to 2mb

router.post("/add-res", upload.single("image"), firmController.addRes);
router.post("/:id/update-time", firmController.updateTime);

module.exports = router;
