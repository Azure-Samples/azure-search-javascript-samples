import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import styled from "@emotion/styled";

const StyledBox = styled(Box)`
  margin: auto;
  padding: 1rem;
  color: #666;
  display: flex;
  justify-content: center;
  border-top: 1px solid #666;
  opacity: 0.25;
`;

const StyledTypography = styled(Typography)`
  margin-left: "auto";
  margin-right: "auto";
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
