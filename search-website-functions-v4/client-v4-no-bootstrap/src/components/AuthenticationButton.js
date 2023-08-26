import React from "react";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";

// React Context for Auth
import { useAuth } from "../contexts/AuthContext";

const StyledAuthenticationButton = styled(Button)`
  // Font color
  color: white;
`;

export default function AuthenticationButton() {
  // React Context: User Authentication
  const user = useAuth();

  // User profile and sign out
  const clientPrincipal = (user && user.clientPrincipal) || null,
    userDetails = (clientPrincipal && clientPrincipal.userDetails) || null;

  const route = userDetails ? `/logout` : `/login`;
  const text = userDetails ? `Sign Out` : `Sign In`;

  return (
    <StyledAuthenticationButton
      key="auth"
      onClick={() => {
        window.location.href = route;
      }}
    >
      {text}
    </StyledAuthenticationButton>
  );
}
