const Question = require("../models/Question");
const { generateFile } = require("../utils/generateFile");
const { execute } = require("../utils/execute");

// ✅ Get all questions
exports.getQuestions = async (req, res) => {
  try {
    // console.log("Query Params:", req.query);
    const { difficulty } = req.query;
    let filter = {};

    if (difficulty && difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    const questions = await Question.find(filter);
    // console.log("Fetched Questions:", questions.length);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions" });
  }
};

// ✅ Get single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch question" });
  }
};
// ✅ Run testcases for a question
exports.runTestcases = async (req, res) => {
  const { testcases, language, code, limit } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Code is empty" });
  }

  try {
    let count = 0;
    let results = [];
    let solve = [];

    for (let i = 0; i < limit; i++) {
      let input = testcases[i].input;
      let output_req = testcases[i].output.trim();

      let { filePath, filePath2 } = await generateFile(language, code, input);
      let output = await execute(filePath, filePath2, language);

      output = output.trim();
      results[i] = output;
      solve[i] = output === output_req;

      if (solve[i]) count++;
      else if (limit > 2) break;
    }

    if (count === limit) {
      res.json({ status: "Success", count, results, solve });
    } else {
      res.json({ status: "Fail", count, results, solve });
    }
  } catch (err) {
    // ✅ Forward actual error info
      res.json({ status: "Compilation Error", stderr: err.error });

  }
};
