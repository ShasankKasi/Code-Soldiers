const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { sendEmail } = require("../utils/sendEmail");
const SenderEmail = process.env.SenderEmail; // set in .env
const passkey = process.env.adminPass; // set in .env
const nodemailer = require("nodemailer");

// const otpStore = {};
// In your auth controller
const otpStore = {}; // already exists

exports.sendSignupOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ status: "exist" });

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: String(SenderEmail),
        pass: String(passkey),
      },
    });

    const mailOptions = {
      from: String(SenderEmail),
      to: email,
      subject: "Signup Verification - OTP",
      text: `Hi, your OTP for signup is ${otp}. Please do not share it.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ status: "otpsent" });
  } catch (error) {
    res.json({ status: "fail" });
  }
};

exports.verifySignupOtp = async (req, res) => {
  const { email, number, name, password } = req.body;

  try {
    const record = otpStore[email];
    if (record && record.otp === number.trim() && Date.now() < record.expires) {
      delete otpStore[email];

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashedPassword });

      return res.json({ status: "success" });
    } else {
      return res.json({ status: "otpincorrect" });
    }
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ status: "doesnotexist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ status: "incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    // console.log(user.email,process.env.adminEmail);
    
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

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP before sending email
otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

    // --- Send Email ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: String(SenderEmail),
        pass: String(passkey),
      },
    });

    const mailOptions = {
      from: String(SenderEmail),
      to: email,
      subject: "Forgot Password - OTP Verification",
      text: `Hi, your OTP is ${otp}. Please do not share it.`,
    };

    // Use await to ensure OTP is stored before proceeding
    await transporter.sendMail(mailOptions);

    // console.log("OTP stored for:", email, otp);
    res.json({ status: "otpsent", email });
  } catch (error) {
    // console.error("Error in forgotPassword:", error);
    res.json({ status: "fail" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, number } = req.body;
  // console.log("Verifying OTP for:", email, number);

  try {
   const record = otpStore[email];
if (record && record.otp === number.trim() && Date.now() < record.expires) {
  delete otpStore[email];
      const user = await User.findOne({ email });
      return res.json({ status: "success", email: user.email, name: user.name });
    } else {
      return res.json({ status: "otpincorrect" });
    }
  } catch (error) {
    // console.error("Error in verifyOtp:", error);
    res.status(500).json({ status: "error" });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({ status: "emptyerror" });
    }

    if (password.length < 8) {
      return res.json({ status: "passerror" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "doesnotexist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ status: "success" });
  } catch (error) {
    return res.status(500).json({ status: "fail" });
  }
}