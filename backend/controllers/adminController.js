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
    const { title, description, testcases, difficulty, inputFormat, outputFormat } = req.body;

    if (!title || !description || !testcases || !difficulty || !inputFormat || !outputFormat) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const question = new Question({
      title,
      description,
      testcases,
      difficulty, // <-- fix case
      "Input Format": inputFormat,   // ✅ map correctly
      "Output Format": outputFormat, // ✅ map correctly
    });

    await question.save();
    res.status(201).json({ status: "success", question });
  } catch (err) {
    console.error("❌ Error in addQuestion:", err);
    res.status(500).json({ message: "Failed to add question", error: err.message });
  }
};