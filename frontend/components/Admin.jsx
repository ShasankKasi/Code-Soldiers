import React, { useState } from "react";
import toast from "react-hot-toast";
import Homebar from "./Homebar";
import api from "../src/utils/axiosHelper";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");

  const handleChange = (event) => {
    setDifficulty(event.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const testcases = [];
    for (let i = 0; i < 5; i++) {
      testcases.push({
        input: input[i] || "",
        output: output[i] || "",
      });
    }

    try {
      const response = await api.post("/admin", {
        title,
        description,
        testcases,
        difficulty,
      });

      if (response.data.status === "success") {
        toast.success("✅ Question Submitted Successfully!");
        setTitle("");
        setDescription("");
        setInput([]);
        setOutput([]);
        setDifficulty("easy");
      }
    } catch (e) {
      console.error(e);
      toast.error("❌ Error occurred while submitting question");
    }
  }

  return (
    <div>
      <Homebar />
      <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "2rem", background: "#f9f9f9", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>Admin Panel - Add New Question</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Title of Question"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "10px", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />

          <textarea
            placeholder="Type the question here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ padding: "10px", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />

          <h3 style={{ marginTop: "1rem", color: "#444" }}>Test Cases</h3>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <textarea
                placeholder={`Input ${i + 1}`}
                value={input[i] || ""}
                onChange={(e) => {
                  const newInput = [...input];
                  newInput[i] = e.target.value;
                  setInput(newInput);
                }}
                rows={2}
                style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <textarea
                placeholder={`Output ${i + 1}`}
                value={output[i] || ""}
                onChange={(e) => {
                  const newOutput = [...output];
                  newOutput[i] = e.target.value;
                  setOutput(newOutput);
                }}
                rows={2}
                style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>
          ))}

          <label htmlFor="difficulty" style={{ fontWeight: "bold" }}>Select Difficulty Level:</label>
          <select
            id="difficulty"
            name="difficulty"
            value={difficulty}
            onChange={handleChange}
            style={{ padding: "10px", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc", maxWidth: "200px" }}
          >
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟡 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>

          <button
            type="submit"
            style={{ marginTop: "1rem", padding: "12px", background: "#4CAF50", color: "white", fontSize: "1rem", borderRadius: "8px", border: "none", cursor: "pointer" }}
          >
            🚀 Submit Question
          </button>
        </form>
      </div>
    </div>
  );
}
