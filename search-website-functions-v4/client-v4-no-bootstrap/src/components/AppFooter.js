import React from 'react';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function AppFooter() {
  return (
    <Box sx={{
      marginLeft: "16px",
    }}>
      <Typography >&copy; {new Date().getFullYear()} Microsoft</Typography>
    </Box>
  );
}
