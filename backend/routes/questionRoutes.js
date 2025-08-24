const express = require("express");
const router = express.Router();
const { getQuestions, getQuestionById, runTestcases } = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// Public/Protected routes
router.get("/questions", authMiddleware, getQuestions);
router.get("/questions/:id", authMiddleware, getQuestionById);
router.post("/questions/:id/run", authMiddleware, runTestcases);

module.exports = router;
