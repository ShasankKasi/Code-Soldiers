const express = require("express");
const router = express.Router();
const { addQuestion } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/questions", authMiddleware, addQuestion);

module.exports = router;
