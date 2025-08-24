const express = require("express");
const router = express.Router();
const { getQuestions, getQuestionById, runTestcases } = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// Public/Protected routes
router.get("/", authMiddleware, getQuestions);
router.get("/:id", authMiddleware, getQuestionById);
router.post("/:id", authMiddleware, runTestcases);

module.exports = router;
