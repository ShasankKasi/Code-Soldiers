const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");

const otpStore = {};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log("Signup request received:", req.body);
  try {
    if (!name || !email || !password) {
      return res.json({ status: "emptyerror" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ status: "exist" });

    if (password.length < 8) return res.json({ status: "passerror" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return res.json({ status: "success" });
  } catch (error) {
    return res.status(500).json({ status: "fail" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ status: "doesnotexist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ status: "incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    if (email === process.env.adminEmail) {
      return res.json({ status: "admin", email: user.email, name: user.name, token });
    }

    res.json({ status: "success", email: user.email, name: user.name, token });
  } catch (error) {
    res.status(500).json({ status: "fail" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ status: "Doesnotexist" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = otp;

    await sendEmail(
      email,
      "Forgot Password - OTP Verification",
      `Hi, your OTP is ${otp}. Please do not share it.`
    );

    res.json({ status: "otpsent", email });
  } catch (error) {
    res.json({ status: "fail" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, number } = req.body;
  try {
    if (otpStore[email] && otpStore[email] === number.trim()) {
      delete otpStore[email];
      const user = await User.findOne({ email });
      return res.json({ status: "success", email: user.email, name: user.name });
    } else {
      return res.json({ status: "otpincorrect" });
    }
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};
