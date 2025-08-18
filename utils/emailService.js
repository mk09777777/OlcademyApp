// backend/utils/emailService.js
const nodemailer = require("nodemailer");
const Template = require("../models/marketing-dashboard/Template"); // Your schema

/**
 * Sends an email using the specified template.
 * @param {string} templateType - The type of email template (e.g., 'signup', 'login').
 * @param {string} recipientEmail - The recipient's email address.
 * @param {object} placeholders - Placeholder values to replace in the email template.
 */

async function sendEmail(templateType, recipientEmail, placeholders = {}) {
  try {
    // Fetch the template from MongoDB
    const template = await Template.findOne({
      event: templateType,
      status: "Active",
    });
    if (!template)
      throw new Error(`Template of type '${templateType}' not found`);

    // Replace placeholders (e.g., [Name], [OrderID]) in subject and body
    let subject = template.emailSubject;
    let body = template.emailBody;
    for (const [key, value] of Object.entries(placeholders)) {
      const regex = new RegExp(`\\[${key}\\]`, "g"); // Replace e.g., [Name] with the actual name
      subject = subject.replace(regex, value);
      body = body.replace(regex, value);
    }

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      html: body, // HTML content
    });

    console.log(`Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error; // Re-throw error for the caller to handle
  }
}

module.exports = sendEmail;
