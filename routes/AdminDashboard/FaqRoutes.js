const express = require("express");
const router = express.Router();
const Faq = require("../../models/AdminDashboard/FaqSchema");
const dotenv = require("dotenv");
dotenv.config();

// GET / - Fetch all FAQs (with optional category filter)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const faqs = await Faq.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ message: "FAQs found", faqs });
  } catch (error) {
    console.error("Error retrieving FAQs:", error.message);
    res.status(500).json({
      message: "An error occurred while retrieving FAQs.",
      error: error.message,
    });
  }
});

// POST / - Create a new FAQ
router.post("/", async (req, res) => {
  try {
    const { q, a, category } = req.body;

    if (!q || !a || !category) {
      return res.status(400).json({ message: "Please provide question, answer, and category" });
    }

    // Validate category
    const allowedCategories = Faq.schema.path('category').enumValues;
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Must be one of: ${allowedCategories.join(', ')}` });
    }

    const newFaq = await Faq.create({ q, a, category });
    res.status(201).json({ message: "FAQ created successfully", faq: newFaq });

  } catch (error) {
     console.error("Error creating FAQ:", error.message);
     res.status(500).json({
       message: "An error occurred while creating the FAQ.",
       error: error.message,
     });
  }
});

// PUT /:id - Update an existing FAQ (question and/or answer)
router.put("/:id", async (req, res) => {
  console.log(`[Admin FAQ Route] PUT request received for ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { q, a } = req.body; // Expect question and/or answer

    // Build the update object dynamically based on provided fields
    const updateData = {};
    if (q) {
      updateData.q = q.trim(); // Trim whitespace
    }
    if (a) {
      updateData.a = a.trim(); // Trim whitespace
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No question or answer provided for update." });
    }

    // Find the FAQ by ID and update the provided fields
    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use the dynamically built update object
      { new: true, runValidators: true }
    );

    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found." });
    }

    res.status(200).json({ message: "FAQ updated successfully", faq: updatedFaq });
  } catch (error) {
    console.error("Error updating FAQ:", error.message);
    res.status(500).json({
      message: "An error occurred while updating the FAQ.",
      error: error.message,
    });
  }
});

// DELETE /:id - Delete an existing FAQ
router.delete("/:id", async (req, res) => {
  console.log(`[Admin FAQ Route] DELETE request received for ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    const deletedFaq = await Faq.findByIdAndDelete(id);

    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found." });
    }

    res.status(200).json({ message: "FAQ deleted successfully", faqId: id });

  } catch (error) {
     console.error("Error deleting FAQ:", error.message);
     res.status(500).json({
       message: "An error occurred while deleting the FAQ.",
       error: error.message,
     });
  }
});

module.exports = router;
