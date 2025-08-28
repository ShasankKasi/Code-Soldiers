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
    ],
    difficulty: { 
      type: String, 
      enum: ["Easy", "Medium", "Hard"], 
      required: true 
    },
    "Input Format": { type: String, required: true },  // ✅ space in key
    "Output Format": { type: String, required: true } // ✅ space in key
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
