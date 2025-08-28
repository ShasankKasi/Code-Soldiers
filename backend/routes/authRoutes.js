const express = require("express");
const router = express.Router();
const { login, forgotPassword, verifyOtp,resetPassword ,verifySignupOtp, sendSignupOtp } = require("../controllers/authController");

// Auth-related routes
router.post("/verifySignupOtp", verifySignupOtp);
router.post("/sendSignupOtp", sendSignupOtp);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/verify", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
