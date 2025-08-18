const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const User=require("./../../models/user")
const { generateToken } = require("./GenerateToken");

router.post("/SignIn", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ message: "User not found. Please sign up." });
    }
    console.log(findUser)
    const isPasswordValid =findUser.password===password
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password." });
    }
    

    const token = generateToken(findUser._id);
    return res.status(200).json({
      message: "Successfully logged in.",
      findUser,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  console.log(email, password, username )
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }
    
    const newUser = new User({ email, username, password });
    console.log(newUser);
    await newUser.save();
    const token=generateToken(newUser._id);
    return res.status(200).json({
      message: "Registration successful.",
      newUser,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register", error: error.message });
  }
});

module.exports = router;
