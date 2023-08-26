import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import styled from "@emotion/styled";

const StyledBox = styled(Box)`

  // Uncomment to debug
  //border: 1px solid red;

  // <HR> equivalent
  border-top: 1px solid #666; 
  opacity: 0.25; 

  // Space between HR and text
  padding-top: 1rem;

  // center the text
  display: flex; 
  justify-content: center;

  `;

const StyledTypography = styled(Typography)`

  // Font color
  color: #000000;
  
`;

export default function AppFooter() {
  return (
    <StyledBox>
      <StyledTypography>
        &copy; {new Date().getFullYear()} Microsoft
      </StyledTypography>
    </StyledBox>
  );
}
