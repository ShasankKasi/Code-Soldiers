const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    testcases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
