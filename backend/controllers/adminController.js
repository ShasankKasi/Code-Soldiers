const User = require("../models/User");
const Question = require("../models/Question");

// ✅ Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ✅ Add question (admin only)
exports.addQuestion = async (req, res) => {
  try {
    const { title, description, testcases } = req.body;

    if (!title || !description || !testcases) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const question = new Question({ title, description, testcases });
    await question.save();

    res.status(201).json({ status: "success", question });
  } catch (err) {
    res.status(500).json({ message: "Failed to add question" });
  }
};
