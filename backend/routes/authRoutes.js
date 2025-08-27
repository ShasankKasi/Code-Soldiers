const express = require("express");
const router = express.Router();
const { signup, login, forgotPassword, verifyOtp,resetPassword } = require("../controllers/authController");

// Auth-related routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/verify", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
