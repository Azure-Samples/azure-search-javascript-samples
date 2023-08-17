import React from "react";
import Result from "./Result";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import styled from "@emotion/styled";

const StyledTypography = styled(Typography)`
  margin: 1em;
`;

const StyledContainer = styled(Container)`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  width: 100%;
  margin: auto;
  margin-left: 0em;
  margin-right: 0em;
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
    return <Result key={index} document={result.document} />;
  });

  let beginDocNumber = Math.min(skip + 1, count);
  let endDocNumber = Math.min(skip + top, count);

  return (
    <StyledContainer>
      <StyledTypography>{q}</StyledTypography>
      <StyledTypography>
        Showing {beginDocNumber}-{endDocNumber} of {count} results
      </StyledTypography>
      <StyledResults>{results}</StyledResults>
    </StyledContainer>
  );
}
