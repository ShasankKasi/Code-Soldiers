import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Homebar from "./Homebar";
import "./Home.css";
import QuestionRow from "./QuestionRow";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";
import styled from "styled-components";
import api from "../src/utils/axiosHelper";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const difficultyParam = searchParams.get("difficulty") || "all";
  const [difficulty, setDifficulty] = useState(difficultyParam);

  useEffect(() => {
    setDifficulty(difficultyParam);
  }, [difficultyParam]);

  const fetchQuestions = async () => {
    const response = await api.get("/api/questions", { params: { difficulty } });
    return response.data;
  };

  const {
    data: questions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["questions", difficulty],
    queryFn: fetchQuestions,
    refetchOnWindowFocus: false,
  });

  // Replace with your real user API call later
  const { data: cachedUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => Promise.resolve({ name: null }), 
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const handleFilterChange = (newDifficulty) => {
    setSearchParams({ difficulty: newDifficulty });
    setDifficulty(newDifficulty);
  };

  return (
    <div>
      <Homebar />
      <div className="home-container">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            textTransform: "capitalize",
          }}
        >
          Welcome{" "}
          {cachedUser?.name ? (
            <span style={{ color: "#008bff", fontWeight: "600" }}>
              {cachedUser.name}
            </span>
          ) : null}{" "}
          ✨
          {/* {!cachedUser?.name && (
            <span
              style={{
                fontSize: "16px",
                fontWeight: "400",
                color: "#555",
                marginLeft: "8px",
              }}
            >
              ( Log in to unlock more features 🚀)
            </span>
          )} */}
        </h1>

        <div className="filter-container">
          {["all", "easy", "medium", "hard"].map((level) => (
            <button
              key={level}
              className={`${level} ${
                difficulty === level ? `active ${level}` : ""
              }`}
              onClick={() => handleFilterChange(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Spinner />
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>
            Failed to load questions: {error.message}
          </p>
        ) : (
          <StyledTable>
            <StyledBody>
              {questions.length > 0 ? (
                questions.map((question) => (
                  <QuestionRow key={question._id} question={question} />
                ))
              ) : (
                <p style={{ textAlign: "center", padding: "1rem" }}>
                  No questions found.
                </p>
              )}
            </StyledBody>
          </StyledTable>
        )}
      </div>
    </div>
  );
}
