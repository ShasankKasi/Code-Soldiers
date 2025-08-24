import React, { useState } from "react";
import Homebar from "./Homebar";
import "./Home.css";
import QuestionRow from "./QuestionRow";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";
import styled from "styled-components";
import api from "../src/utils/axiosHelper"; // <-- use axiosHelper

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  column-gap: 2.4rem;
  align-items: center;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

export default function Home() {
  const [difficulty, setDifficulty] = useState("all");
  const queryClient = useQueryClient();

  const fetchQuestions = async (difficulty) => {
    const response = await api.get("/home", { params: { difficulty } });
    return response.data;
  };

  const {
    data: questions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["questions", difficulty],
    queryFn: () => fetchQuestions(difficulty),
    refetchOnWindowFocus: false,
  });

  const { data: cachedUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => Promise.resolve({ name: "Guest" }),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const handleFilterChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    queryClient.invalidateQueries(["questions"]);
  };

  return (
    <div>
      <Homebar />
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          textTransform: "capitalize",
        }}
      >
        Welcome {cachedUser?.name}
      </h1>

      <div className="filter-container">
        {["all", "easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            className={`${level} ${difficulty === level ? `active ${level}` : ""}`}
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
          <StyledHeader $columns="0.9fr 1.8fr 2.2fr 1fr 1fr 1fr 1fr">
            <span>ID</span>
            <span>Title</span>
            <span>Description</span>
            <span>Difficulty</span>
            <span>Created At</span>
            <span>Status</span>
            <span>Actions</span>
          </StyledHeader>
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
  );
}
