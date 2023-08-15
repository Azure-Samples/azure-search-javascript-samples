import React from "react";
import Button from "@mui/material/Button";

// React Context for Auth
import { useAuth } from "../contexts/AuthContext";

export default function AppHeaderAuth() {
  // React Context: User Authentication
  const user = useAuth();

  // User profile and sign out
  const clientPrincipal = (user && user.clientPrincipal) || null,
    userDetails = (clientPrincipal && clientPrincipal.userDetails) || null;

  const route = userDetails ? `/logout` : `/login`;
  const text = userDetails ? `Sign Out` : `Sign In`;

  return (
    <Button
      key="auth"
      sx={{ my: 2, color: "white", display: "block" }}
      onClick={() => {
        window.location.href = route;
      }}
    >
      {text}
    </Button>
  );
}
