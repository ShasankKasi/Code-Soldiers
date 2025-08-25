// questionRoutes.js
const express = require("express");
const router = express.Router();
const { getQuestions, getQuestionById, runTestcases } = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// Public
router.get("/", getQuestions);
router.get("/:id", getQuestionById);

// Protected (requires login)
router.post("/:id", authMiddleware, runTestcases);

module.exports = router;
