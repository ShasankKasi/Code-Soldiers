import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Row = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
  text-decoration: none;

  &:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
`;

const QuestionTitle = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  transition: color 0.3s;

  ${Row}:hover & {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DifficultyBox = styled.div`
  display: inline-block;
  min-width: 70px;
  padding: 0.2rem 0.6rem;
  border-radius: 5px;
  color: white;
  font-size: 0.9rem;
  text-align: center;
  background-color: ${(props) => {
    switch (props.$level) {
      case "easy":
        return "#28a745";
      case "medium":
        return "#ffc107";
      case "hard":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }};

  @media (max-width: 768px) {
    font-size: 0.8rem;
    min-width: 60px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

export default function QuestionRow({ question }) {
  return (
    <Row
      to={`/Question/${question._id}`}
      state={{
        id: question._id,
        title: question.title,
        description: question.description,
        testcases: question.testcases,
      }}
    >
      <ContentWrapper>
        <QuestionTitle>{question.title}</QuestionTitle>
      </ContentWrapper>
      <DifficultyBox $level={question.difficulty}>
        {question.difficulty.charAt(0).toUpperCase() +
          question.difficulty.slice(1)}
      </DifficultyBox>
    </Row>
  );
}
