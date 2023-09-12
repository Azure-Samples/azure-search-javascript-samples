import React from "react";
import SimpleBook from "./BookDetail/SearchPage/simple";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import styled from "@emotion/styled";

const StyledResultsHeader = styled(Container)`
  width: 100%;
  align-items: left;
`;

const StyledTypography = styled(Typography)`
  margin: 1em;
`;

const StyledContainer = styled(Container)`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  width: 100%;
  margin: 1em;
`;

const StyledResults = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  width: 100%;
  margin: auto;
  margin-left: 0em;
  margin-right: 0em;
`;

export default function Results({ q, skip, top, count, documents }) {
  let results = documents.map((result, index) => {
    return <SimpleBook key={index} document={result.document} />;
  });

  let beginDocNumber = Math.min(skip + 1, count);
  let endDocNumber = Math.min(skip + top, count);

  return (
    <StyledContainer>
      <StyledResultsHeader>
        <StyledTypography>
          {count === 0
            ? ("No results")
            : count > 1
            ? (`Showing ${beginDocNumber}-${endDocNumber} of ${count} results`)
            : ("1 result")}
        </StyledTypography>
      </StyledResultsHeader>
      <StyledResults>{results}</StyledResults>
    </StyledContainer>
  );
}
