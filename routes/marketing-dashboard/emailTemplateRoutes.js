const express = require("express");
const router = express.Router();
const Template = require("../../models/marketing-dashboard/Template");
const sendEmail = require("../../utils/emailService");

// Fetch all templates
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Fetch template by type
router.get("/event", async (req, res) => {
  const { event } = req.query;

  try {
    if (!event) {
      return res.status(400).json({ error: "event parameter is required" });
    }

    const template = await Template.findOne({ event });
    if (!template) {
      return res
        .status(404)
        .json({ error: `Template with event "${event}" not found` });
    }

    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

// download all the templates by gouping them

router.get("/templates-grouped", async (req, res) => {
  try {
    const templates = await Template.find();
    const groupedTemplates = templates.reduce((acc, template) => {
      acc[template.type] = acc[template.type] || [];
      acc[template.type].push(template);
      return acc;
    }, {});
    res.status(200).json(groupedTemplates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).send("Server Error");
  }
});

// Create a new template
router.post("/", async (req, res) => {
  const { title, emailSubject, status, emailBody, type, event, description } =
    req.body;

  if (!title) {
    return res
      .status(400)
      .json({ error: "Title, emailBody, and type are required" });
  }

  try {
    const newTemplate = new Template({
      title,
      emailSubject,
      status,
      emailBody,
      type,
      event,
      description,
    });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(500).json({ error: "Failed to create template" });
  }
});

// Update an existing template
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedTemplate = await Template.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(updatedTemplate);
  } catch (err) {
    res.status(500).json({ error: "Failed to update template" });
  }
});

// Delete a template
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTemplate = await Template.findByIdAndDelete(id);
    if (!deletedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json({ message: "Template deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete template" });
  }
});

// route to send emails
router.post("/send-email", async (req, res) => {
  const { templateType, email, placeholders } = req.body;
  try {
    await sendEmail(templateType, email, placeholders);
    res
      .status(200)
      .json({ success: true, message: "Test email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
