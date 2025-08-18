    const express = require("express");
    const router = express.Router();
    const moment = require("moment-timezone");
    const Settings = require("./../../models/AdminDashboard/SettingsSchema");
    const multer = require("multer");

    const posts = multer.memoryStorage();
    const upload = multer({ storage: posts });

    const timeZoneMap = {
        IST: "India Standard Time",
        PST: "America/Los_Angeles",
        EST: "America/New_York",
        CST: "America/Chicago",
        MST: "America/Denver",
    };

    //routes settings
    router.get("/", async (req, res) => {
        try {
            const settings = await Settings.findOne();
            if (!settings) {
                return res.status(404).json({ message: "Settings not found" });
            }
    
            const { timeZone, dateFormat, timeFormat } = settings;
            const timeZoneIdentifier = timeZoneMap[timeZone];
            console.log("Fetched Settings:", settings);
            console.log("Time Zone Identifier:", timeZoneIdentifier);
    
            if (!timeZoneIdentifier) {
                return res.status(400).json({ message: "Invalid time zone" });
            }
    
            const timeFormatPattern =
                timeFormat === "24-hour" ? "HH:mm:ss" : "hh:mm:ss A";
    
            const formattedTime = moment()
                .tz(timeZoneIdentifier)
                .format(`${dateFormat} ${timeFormatPattern}`);
    
            res.status(200).json({ currentTime: formattedTime, settings });
        } catch (error) {
            console.error("Error in GET /:", error);
            res.status(500).json({ message: "Server error", error });
        }
    });
    
    router.post("/settings", upload.single("logo"), async (req, res) => {
        const {
        websiteName,
        status,
        maintenanceEnabled,
        maintenanceMessage,
        startTime,
        endTime,
        preferredLanguage,
        timeZone,
        dateFormat,
        timeFormat,
    } = req.body;

    let logo = null;
    if (req.file) {
        logo = req.file.buffer.toString("base64");
    }
    
    
    const updateData = {
        websiteName,
        status,
        maintenanceEnabled,
        maintenanceMessage,
        startTime,
        endTime,
        preferredLanguage,
        timeZone,
        dateFormat,
        timeFormat,
    };
    
    
    if (logo) {
        updateData.logo = logo;
    }
    
    try {
        const updatedSettings = await Settings.findOneAndUpdate(
        {},
        updateData,
        { new: true, upsert: true }
        );
    
        res.status(200).json({
        message: "Settings updated successfully",
        updatedSettings,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
        
    });

    module.exports = router;
