const express = require("express");
const router = express.Router();
const documentController = require("../controller/firmDocumentController");

// Route to upload a document (works for both restaurant and tiffin)
router.post(
  "/upload",
  documentController.upload.single("document"),
  documentController.uploadDocument
);

// Routes for restaurant documents (backward compatibility)
router.get("/restaurant/:serviceId", documentController.getRestaurantDocuments);
router.delete(
  "/restaurant/:serviceId/:documentType",
  documentController.deleteDocument
);

// Routes for tiffin documents
router.get("/tiffin/:serviceId", documentController.getTiffinDocuments);
router.delete(
  "/tiffin/:serviceId/:documentType",
  documentController.deleteDocument
);

// Generic service routes that work for both types
router.get("/:serviceId", documentController.getServiceDocuments);
router.delete("/:serviceId/:documentType", documentController.deleteDocument);

// Route to view a document file
router.get("/view/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", "documents", filename);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  } else {
    return res.status(404).json({
      success: false,
      message: "Document not found",
    });
  }
});

module.exports = router;
