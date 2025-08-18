const User=require("../../models/user")
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'Outlook', 'SendGrid', etc.
    auth: {
        user: process.env.MY_EMAIL, // Your email address
        pass: process.env.MY_EMAIL_PASSWORD, // Your email password or app password
    },
});
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.warn(`Attempt to send OTP to non-existent email: ${email}`);
            return res.status(200).json({ message: 'If the email exists, an OTP has been sent.' });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        const mailOptions = {
            from: `Zomato OTP <${process.env.MY_EMAIL}>`,
            to: email,
            subject: 'Your Zomato OTP for Verification',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333;">OTP Verification</h2>
                        <p style="font-size: 16px; color: #555;">Hello,</p>
                        <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for Zomato is:</p>
                        <div style="background: #e0f2f7; color: #007bff; font-size: 28px; font-weight: bold; padding: 15px 20px; border-radius: 5px; display: inline-block; margin: 20px 0;">
                            ${otp}
                        </div>
                        <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>5 minutes</strong>.</p>
                        <p style="font-size: 14px; color: #777;">Please do not share this OTP with anyone.</p>
                        <p style="font-size: 14px; color: #777; margin-top: 20px;">If you did not request this, please ignore this email.</p>
                    </div>
                    <p style="font-size: 12px; color: #aaa; margin-top: 20px;">This is an automated email, please do not reply.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully to your email.' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (!user.otp || !user.otpExpires || user.otpExpires < new Date()){ 
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ message: 'OTP is invalid or has expired. Please request a new one.' });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        res.status(200).json({ message: 'OTP verified successfully!' });

    } 
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP. Please try again later.' });
    }
});

module.exports = router;