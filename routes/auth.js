const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { validateSignup } = require("../validation/validator");
const userController = require("../controller/userController");

const {
  handleOAuthSuccess,
  signupHandler,
  loginHandler,
  logoutHandler,
  userHandler,
  verifyHandler,
  resetPassword,
  isAuthenticated,
} = require("../config/authHandlers");

const Router = express.Router();

// Middleware
Router.use(cookieParser());
Router.use(express.json());

// OAuth Routes
// GOOGLE LOGIN
Router.get(
  "/google",
  (req, res, next) => {
    const { rememberMe } = req.query;
    if (rememberMe === "true") {
      req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days
    } else {
      req.session.cookie.expires = null; // Session cookie (expires when browser closes)
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

Router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.CLIENT_URL }),
  handleOAuthSuccess
);

// FACEBOOK LOGIN
Router.get(
  "/facebook",
  (req, res, next) => {
    const { rememberMe } = req.query;
    if (rememberMe === "true") {
      req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days
    } else {
      req.session.cookie.expires = null; // Session cookie (expires when browser closes)
    }
    next();
  },
  passport.authenticate("facebook")
);

Router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: process.env.CLIENT_URL,
  }),
  handleOAuthSuccess
);

// TWITTER LOGIN
Router.get(
  "/twitter",
  (req, res, next) => {
    const { rememberMe } = req.query;
    if (rememberMe === "true") {
      req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days
    } else {
      req.session.cookie.expires = null; // Session cookie (expires when browser closes)
    }
    next();
  },
  passport.authenticate("twitter")
);

Router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: process.env.CLIENT_URL }),
  handleOAuthSuccess
);

// Auth Routes
Router.post("/signup", validateSignup, signupHandler);
Router.post("/verify", verifyHandler);
Router.post("/login", loginHandler);
Router.get("/logout", isAuthenticated, logoutHandler);
Router.get("/user", isAuthenticated, userHandler);
Router.get('/getnotifications', isAuthenticated, userController.getNotificationsSettings);
Router.put('/putnotifications', isAuthenticated, userController.putNotificationSettings);
Router.get('/getVegMode', isAuthenticated, userController.getVegMode);
Router.put('/updateVegMode', isAuthenticated, userController.updateVegMode);
Router.post('/postNotificationsInfo',isAuthenticated,userController.PostNotifications);
Router.get('/getNotificationsInfo', isAuthenticated, userController.GetNotifications);
Router.delete('/deleteNotificatonsInfo/:id',isAuthenticated,userController.DeleteNotification)
// Step 3: Reset Password
Router.post("/reset-password", resetPassword);
Router.get("/profile", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to your profile!" });
});

// Error Handling Middleware
Router.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "An error occurred. Please try again." });
});

module.exports = Router;
