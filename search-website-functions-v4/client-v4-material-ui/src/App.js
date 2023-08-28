import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Material UI design system
import { Box } from "@mui/material";
import styled from "@emotion/styled";

// Context for user authentication
import { AuthContext } from "./contexts/AuthContext";

// App Layout components
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

// React Router page components
import Home from "./pages/Home";
import Search from "./pages/Search";
import Details from "./pages/Details";

// Create a client
const queryClient = new QueryClient();

const AppStyledBox = styled(Box)({
  margin:0,
  border:0,
  padding:0,
  fontFamily: "sans-serif",
  backgroundColor: "#fff",
  minWidth: "375px",
  fontSize: "1rem",
  fontWeight: "400",
  marginBottom: "5em"
});

export default function App() {
  // React Hook: useState with a var name, set function, & default value
  const [user, setUser] = useState({});

  // Fetch authentication API & set user state
  async function fetchAuth() {
    const response = await fetch("/.auth/me");
    if (response) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        response
          .json()
          .then((response) => setUser(response))
          .catch((error) => console.error("Error:", error));
      }
    }
  }

  // React Hook: useEffect when component changes
  // Empty array ensure this only runs once on mount
  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={user}>
        <AppStyledBox>
          <AppHeader />
          <BrowserRouter>
            <Routes>
              <Route path={`/`} element={<Home />} />
              <Route path={`/search`} element={<Search />} />
              <Route path={`/details/:id`} element={<Details />} />
              <Route path={`*`} element={<Home />} />
            </Routes>
          </BrowserRouter>
          {<AppFooter />}
        </AppStyledBox>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}