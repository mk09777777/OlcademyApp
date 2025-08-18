const express = require("express");
const router = express.Router();
const ProfileSettings1 = require("./../../models/AdminDashboard/Persolization");
const multer = require("multer");
const bcrypt = require("bcryptjs");

const posts = multer.memoryStorage();
const upload = multer({ storage: posts });

// Update profile
router.put("/update", upload.single("profilePicture"), async (req, res) => {
  try {
    const { firstName, lastName, bio, email, phone, gender, dob, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let logo = null;
    if (req.file) {
      logo = req.file.buffer.toString("base64");
    }

    let profile = await ProfileSettings1.findOne({ email });

    if (profile) {
      // Update existing profile
      if (firstName) profile.firstName = firstName;
      if (lastName) profile.lastName = lastName;
      if (bio) profile.bio = bio;
      if (phone) profile.phone = phone;
      if (gender) profile.gender = gender;
      if (dob) profile.dob = dob;
      if (newPassword) profile.password = await bcrypt.hash(newPassword, 10);
      if (logo) profile.profilePicture = logo;

      await profile.save();
      return res.json({ message: "Profile updated successfully", profile });
    }

    // Create new profile
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    profile = new ProfileSettings1({
      firstName,
      lastName,
      bio,
      email,
      phone,
      gender,
      dob,
      profilePicture: logo,
      password: hashedPassword,
    });

    await profile.save();
    return res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Find profile by email
router.get("/findByEmail", async (req, res) => {
  try {
    const { email } = req.query;

    

    const profile = await ProfileSettings1.find();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile found", profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
