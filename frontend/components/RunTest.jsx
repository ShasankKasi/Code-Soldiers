import React, { useState } from "react";
import "./RunTest.css";
import { MdAccessTimeFilled } from "react-icons/md";

export default function RunTest({ flag, solve, verdict, timeTaken, testcases }) {
  const [activeCase, setActiveCase] = useState(0);

  const isAccepted = flag && solve[activeCase];
  const isWrong = flag && !solve[activeCase];

  return (
    <div className="boxx">
      <div className="buttons">
        {testcases.map((_, idx) => (
          <button
            key={idx}
            className={`case ${activeCase === idx ? "active" : ""}`}
            onClick={() => setActiveCase(idx)}
            disabled={activeCase === idx}
          >
            Case {idx + 1}
          </button>
        ))}
      </div>

      <div className="results">
        {isAccepted && (
          <p style={{ color: "green" }}>
            Accepted &nbsp;
            <MdAccessTimeFilled /> &nbsp;{timeTaken} s
          </p>
        )}
        {isWrong && <p style={{ color: "red" }}>Wrong Answer</p>}

        <div className="inputt">
          <p>Input : {testcases[activeCase].input}</p>
        </div>

        {flag && (
          <div className="expected-output">
            <p>Output : {verdict[activeCase]}</p>
          </div>
        )}

        <div className="expected-output">
          <p>Expected : {testcases[activeCase].output}</p>
        </div>
      </div>
    </div>
  );
}
