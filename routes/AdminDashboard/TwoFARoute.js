
const Privacy = require('./../../models/AdminDashboard/OtpSchema');
const UserAc = require("./../../models/AdminDashboard/UserSchema");
const express = require("express");
const router = express.Router();
const Email=require("./EmailService")

    router.post("/enable", async (req, res) => {
        const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        
        const findUser = await UserAc.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ message: "User not found." });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

        const updatedSettings = await Privacy.findOneAndUpdate(
        { userId: findUser._id },
        {
            "twoFactorAuth.enabled": true,
            "twoFactorAuth.email": email,
            "twoFactorAuth.otp": otp,
            "twoFactorAuth.otpExpiry": expiryTime,
        },
        { new: true, upsert: true }
        );
        await Email(email,"Opt is"+otp,"the opt is send to verify the 2FA")
        res.status(200).json({ 
        message: "2FA enabled successfully.", 
        data: updatedSettings,
        otp,
        });
    } catch (err) {
        res.status(500).json({ error: "Error enabling 2FA.", details: err.message });
    }
    });
    router.post("/verify-otp", async (req, res) => {
        const { email, enteredOtp } = req.body;

        if (!email) {
        return res.status(400).json({ message: "Email is required." });
        }
    
        try {
            const findUser = await UserAc.findOne({ email });
            if (!findUser) {
                return res.status(404).json({ message: "User not found." });
            }
        const userSettings = await Privacy.findOne({ userId: findUser._id });
    
        if (!userSettings) {
            return res.status(404).json({ error: "User settings not found." });
        }
    
        const { otp, otpExpiry } = userSettings.twoFactorAuth;
    
        if (!otp || !otpExpiry) {
            return res.status(400).json({ error: "No OTP found. Please request a new one." });
        }
    
        if (new Date() > otpExpiry) {
            return res.status(400).json({ error: "OTP has expired. Please request a new one." });
        }
    
        if (otp !== enteredOtp) {
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }
    
        await Privacy.findOneAndUpdate(
            { userId:findUser._id },
            {
            "twoFactorAuth.otpVerified": true,
            "twoFactorAuth.otp": "",
            "twoFactorAuth.otpExpiry": null,
            }
        );
    
        res.status(200).json({ message: "OTP verified successfully." });
        } catch (err) {
        res.status(500).json({ error: "Error verifying OTP.", details: err.message });
        }
    });
    router.put("/update-location-sharing", async (req, res) => {
        const { email, locationSharing } = req.body;
    
        if (!email) {
        return res.status(400).json({ error: "Email is required." });
        }
    
        try {
        const user = await UserAc.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
    
        const updatedSettings = await Privacy.findOneAndUpdate(
            { userId: user._id },
            { locationSharing },
            { new: true, upsert: true }
        );
    
        res.status(200).json({
            message: "Location sharing updated successfully.",
            data: updatedSettings,
        });
        } catch (err) {
        res.status(500).json({ error: "Error updating location sharing.", details: err.message });
        }
    });
    
    router.put("/update-visibility", async (req, res) => {
        const { email, visibility } = req.body;
    
        if (!email) {
        return res.status(400).json({ error: "Email is required." });
        }
    
        if (!["Public", "Private"].includes(visibility)) {
        return res.status(400).json({ error: "Invalid visibility option. Choose 'Public' or 'Private'." });
        }
    
        try {
        const user = await UserAc.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
    
        const updatedSettings = await Privacy.findOneAndUpdate(
            { userId: user._id },
            { visibility },
            { new: true, upsert: true }
        );
    
        res.status(200).json({
            message: "Visibility updated successfully.",
            data: updatedSettings,
        });
        } catch (err) {
        res.status(500).json({ error: "Error updating visibility.", details: err.message });
        }
    });

module.exports = router;
