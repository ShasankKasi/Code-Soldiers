const express = require("express");
const router = express.Router();
const { signup, login, forgotPassword, verifyOtp } = require("../controllers/authController");

// Auth-related routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/verify", verifyOtp);

module.exports = router;
