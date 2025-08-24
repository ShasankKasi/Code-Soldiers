import styled from "styled-components";

import { useMoveBack } from "../hooks/useMoveBack";

const StyledPageNotFound = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;
const BackButton = styled.button`
  background-color: var(--color-brand-600);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.6rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-brand-700);
  }
`;


const Box = styled.div`
  /* box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 4.8rem;
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: 3.2rem;
  }
`;

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <StyledPageNotFound>
      <Box>
        <h1>
          The page you are looking for could not be found 😢
        </h1>
        <BackButton onClick={moveBack} aria-label="Go back to previous page">
  &larr; Go back
</BackButton>

      </Box>
    </StyledPageNotFound>
  );
}

export default PageNotFound;
