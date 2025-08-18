const express = require("express");
const { google } = require("googleapis");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const UserModel = require("../models/user");
const { Verification_Email_Template } = require("../middleware/email-template");
dotenv.config({ path: ".env.development" });
const router = express.Router();
// Twilio API setup (for Phone OTP)
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const my_email = process.env.MY_EMAIL;

// Gmail API setup (for Email OTP)
const CLIENT_ID = process.env.CLIENT_ID1; // Replace with your actual Client ID
const CLIENT_SECRET = process.env.CLIENT_SECRET1; // Replace with your actual Client Secret
const REDIRECT_URI = "https://developers.google.com/oauthplayground"; // Use OAuth Playground for testing
const REFRESH_TOKEN = process.env.REFRESH_TOKEN1; //to generate the refresh token you go on this url https://developers.google.com/oauthplayground

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Temporary in-memory storage for OTPs (use a database in production)
const otpStorage = {};
// Send OTP via Phone (Twilio)

router.post("/send-phone-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.length !== 10) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  otpStorage[phone] = { otp, createdAt: Date.now() }; // Store OTP with timestamp

  try {
    // Send OTP using Twilio
    const msg = await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE, // Replace with your Twilio number like this +12723563454
      to: `+91${phone}`,
    });
    res.status(200).json({ message: "OTP sent successfully to phone" });
  } catch (error) {
    console.error("Error sending OTP to phone:", error.message);
    res.status(500).json({ message: "Failed to send OTP to phone" });
  }
});

// Send OTP via Email (Gmail API)
router.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  otpStorage[email] = { otp, createdAt: Date.now() }; // Store OTP with timestamp

  try {
    // Generate an access token for Gmail API
    const accessToken = await oAuth2Client.getAccessToken();

    // Configure Nodemailer for Gmail API
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: my_email, // Your Gmail address
        // pass: "aiuk kzef cdlb hxrn",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Email message details
    const mailOptions = {
      from: my_email,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
      html: Verification_Email_Template.replace("{verificationCode}", otp),
    };

    // Send OTP via email
    const response = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully to email" });
  } catch (error) {
    console.error("Error sending OTP to email:", error.message);
    res.status(500).json({ message: "Failed to send OTP via email" });
  }
});

// Verify OTP for Phone or Email
router.post("/verify-otp", async (req, res) => {
  const { identifier, otp } = req.body;

  // Check if OTP exists for the identifier
  if (!otpStorage[identifier]) {
    return res
      .status(400)
      .json({ message: "No OTP request found for this identifier" });
  }

  const { otp: storedOtp, createdAt } = otpStorage[identifier];

  // Check if OTP is expired (5 minutes)
  const isExpired = Date.now() - createdAt > 5 * 60 * 1000;
  if (isExpired) {
    delete otpStorage[identifier];
    return res.status(400).json({ message: "OTP expired" });
  }

  // Validate the OTP
  if (storedOtp === Number(otp)) {
    delete otpStorage[identifier]; // Clear OTP on successful verification
    req.session.isOtpVerified = true;
    req.session.email = identifier;
    // Save session and respond after successful save
    return req.session.save((err) => {
      if (err) {
        // console.error("Session save error:", err);
        return res.status(500).json({ message: "Failed to save session" });
      }
      return res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    });
  }

  // If OTP is invalid
  return res.status(400).json({ success: false, message: "Invalid OTP" });
});

// Export both otpRoutes and verifiedIdentifiers
module.exports = {
  otpRoutes: router,
};
