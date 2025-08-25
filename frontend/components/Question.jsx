import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Homebar from "./Homebar";
import "./Question.css";
import { useQuery } from "@tanstack/react-query";
import RunTest from "./RunTest";
import toast from "react-hot-toast";
import SpinnerMini from "../ui/SpinnerMini";
import Spinner from "../ui/Spinner";
import PageNotFound from "./PageNotFound";
import { MdAccessTimeFilled } from "react-icons/md";
import AceEditor from "react-ace";
import axiosHelper from "../src/utils/axiosHelper"; // ✅ JWT-enabled axios

// Import a theme and mode (language) for the editor
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/ext-language_tools";

// Set the base path for ACE editor
window.ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.23.1/src-noconflict/"
);

// ✅ Default templates for each language
const defaultTemplates = {
  cpp: `// Enter your C++ code here
#include <bits/stdc++.h>
using namespace std;

int main() {
    // your code
    return 0;
}`,
  c: `// Enter your C code here
#include <stdio.h>

int main() {
    // your code
    return 0;
}`,
  py: `# Enter your Python code here
def main():
    # your code
    pass

if __name__ == "__main__":
    main()`,
  java: `// Enter your Java code here
public class Main {
    public static void main(String[] args) {
        // your code
    }
}`,
};

const handleClick = async (
  testcases,
  code,
  id,
  limit,
  setPass,
  checking,
  setVerdict,
  setX,
  setY,
  setSolve,
  setCorrect,
  setError,
  setTimeTaken,
  language
) => {
  const startTime = Date.now();
  try {
    setError(false);
    setCorrect(false);
    if (limit === 2) setY(false);
    checking(true);

    const body = { testcases, language, code, limit };

    // ✅ Use axiosHelper instead of raw axios
    const response = await axiosHelper.post(`/api/questions/${id}`, body);

    checking(false);
    if (limit !== 2) setY(true);

    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    setTimeTaken(timeTaken);

    if (response.data.status === "NoOutput") {
      toast.error("No output");
    } else if (response.data.status === "Success") {
      setX(true);
      setSolve(response.data.solve);
      toast.success("Test cases ran successfully");
      setPass(response.data.count);
      setCorrect(true);
    } else if (response.data.status === "Fail") {
      setX(true);
      setSolve(response.data.solve);
      setPass(response.data.count);
    } else if (response.data.status === "Compilation Error") {
      setError(true);
      setX(false);
      setY(false);
      toast.error("Compilation error");
    }

    setVerdict(response.data.results);
  } catch (e) {
    toast.error(
      e.response?.data?.message || "Unknown error occurred. Please try again."
    );
  }
};

const fetchQuestion = async (id) => {
  const { data } = await axiosHelper.get(`/api/questions/${id}`);
  return data;
};

const Question = () => {
  const { id } = useParams();

  const {
    data: question,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["question", id],
    queryFn: () => fetchQuestion(id),
  });

  const [pass, setPass] = useState(0);
  const [code, setCode] = useState(defaultTemplates.cpp); // default C++
  const [solve, setSolve] = useState([]);
  const [y, setY] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [running, setRunning] = useState(false);
  const [x, setX] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [error, setError] = useState(false);
  const [verdict, setVerdict] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");

  const modeMap = {
    cpp: "c_cpp",
    c: "c_cpp",
    py: "python",
    java: "java",
  };

  // Reset editor whenever new question is fetched
  useEffect(() => {
    if (question) {
      setPass(0);
      setCode(defaultTemplates[language]);
      setSolve([]);
      setY(false);
      setRunning(false);
      setSubmitting(false);
      setCorrect(false);
      setError(false);
      setVerdict([]);
      setTimeTaken(null);
    }
  }, [question, language]);

  // ✅ Change editor template when language changes
  useEffect(() => {
    setCode(defaultTemplates[language]);
  }, [language]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch question data");
    }
  }, [isError]);

  if (isLoading) return <Spinner />;
  if (!question) return <PageNotFound />;

  return (
    <div>
      <Homebar />
      <div className="box">
        <div className="container">
          <h1 className="titles">{question.title}</h1>

          {/* ✅ Description */}
          <div className="description">
            <h2>Description</h2>
            <p>{question.description}</p>
          </div>

          {/* ✅ Input Format */}
          <div className="description">
            <p>
              <b>Input Format : </b>
              { question["Input Format"]}
            </p>
          </div>

          {/* ✅ Output Format */}
          <div className="description">
            <p>
              <b>Output Format : </b>
              { question["Output Format"]}
            </p>
          </div>
          <ul className="unorderedlist">
            {question.testcases.slice(0, 2).map((testcase, i) => (
              <li key={i} className="List">
                <div className="input">
                  <strong>Input</strong>
                  <pre className="pre">
                    <br />
                    {testcase.input}
                  </pre>
                </div>
                <div className="output">
                  <strong>Output</strong>
                  <pre>
                    <br />
                    {testcase.output}
                  </pre>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Language Selector */}
        <div className="language-selector">
          <label>Select language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="py">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Code Editor */}
        <div className="compiler">
          <AceEditor
            mode={modeMap[language]}
            theme="github"
            name="code-editor"
            value={code}
            onChange={setCode}
            fontSize={14}
            width="100%"
            height="400px"
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Run & Submit Buttons */}
      <div className="buttons">
  {isLoggedIn ? (
    <>
      <button
        type="button"
        className="button"
        onClick={() =>
          handleClick(
            question.testcases,
            code,
            id,
            2,
            setPass,
            setRunning,
            setVerdict,
            setX,
            setY,
            setSolve,
            setCorrect,
            setError,
            setTimeTaken,
            language
          )
        }
      >
        {running ? <SpinnerMini /> : "Run"}
      </button>
      <button
        type="button"
        className="button"
        onClick={() =>
          handleClick(
            question.testcases,
            code,
            id,
            question.testcases.length,
            setPass,
            setSubmitting,
            setVerdict,
            setX,
            setY,
            setSolve,
            setCorrect,
            setError,
            setTimeTaken,
            language
          )
        }
      >
        {submitting ? <SpinnerMini /> : "Submit"}
      </button>
    </>
  ) : (
    <div className="locked-editor">
      🔒 <span>Please <a href="/login">login</a> to unlock editor</span>
    </div>
  )}
</div>
      {/* Compilation Error */}
      {error && (
        <div className="c-Error">
          <strong>Compilation Error:</strong>
          <p className="c-error2">
            Check the possible syntax errors and try running it again.
          </p>
        </div>
      )}

      {/* Test Results */}
      {!error && !y && (
        <div className="result">
          <h1>
            {!x ? (
              <RunTest testcases={question.testcases} flag={false} />
            ) : (
              <RunTest
                testcases={question.testcases}
                flag={true}
                verdict={verdict}
                solve={solve}
                timeTaken={timeTaken}
              />
            )}
          </h1>
        </div>
      )}

      {/* Submission Verdict */}
      {!error && y && (
        <div
          className="submitted"
          style={{ border: correct ? "4px solid green" : "4px solid red" }}
        >
          <div>
            <h1>Submission</h1>
            {correct && <div className="tick">✅</div>}
            {!correct && <div className="wrong">❌</div>}
          </div>
          <table className="verdict-table">
            <thead>
              <tr>
                <th className="heading">No. of Test Cases</th>
                <th>Test Cases Passed</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="heading">{question.testcases.length}</td>
                <td>{pass}</td>
                <td>
                  <strong>
                    {correct
                      ? "All Test Cases Passed ✅"
                      : "Test Cases Failed ❌ "}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
          {timeTaken && (
            <div className="time-taken">
              <p>
                <MdAccessTimeFilled /> Time Taken: {timeTaken} seconds
              </p>
            </div>
          )}
          {!correct && (
            <div className="info">
              <p>Your Program failed for 😔:</p>
              <p>Input:</p>
              <p className="failed-input">
                <pre>
                  {question.testcases[solve.findIndex((item) => item === false)]
                    ?.input || "No failed test cases found"}
                </pre>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Question;
