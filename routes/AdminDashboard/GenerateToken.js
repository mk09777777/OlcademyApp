const jwt = require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();
const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  console.log("generated",token);
  return token;
};

const verify = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(404).json({ message: "Access is denied" });

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = { verify, generateToken };
