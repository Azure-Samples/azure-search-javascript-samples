import React from 'react';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import styled from "@emotion/styled";

const StyledBox = styled(Box)`
  margin-top: 1rem;
  padding: 1rem;
  color: #666;
  text-align: "center";
`;

const StyledDivider = styled(Divider)`
color: #666;
margin: 1rem 0;
border-top: 1px solid #666;
opacity: 0.25;
`;

const StyledTypography = styled(Typography)`
font-size: 0.85em;
`;

export default function AppFooter() {
  return (
    <StyledBox>
      <StyledDivider />
      <StyledTypography >&copy; {new Date().getFullYear()} Microsoft</StyledTypography>
    </StyledBox>
  );
}
