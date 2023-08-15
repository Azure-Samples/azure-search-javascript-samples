import React from "react";
import AppHeaderAuth from "./AppHeaderAuth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import logo from "../images/microsoft_small.png";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const pages = [
  {
    key: 'search-nav',
    link: "/search",
    text: "Search",
  },
  {
    key: 'learn-more-nav',
    link: "https://azure.microsoft.com/services/search/",
    text: "Learn more",
  },
];

export default function AppHeader() {
  return (
    <header className="header">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar disableGutters>
              <Button
                key="Home"
                onClick={() => {
                  window.location.href = `/`;
                }}
              >
                <img
                  src={logo}
                  height="50"
                  className="navbar-logo"
                  alt="Microsoft"
                />
              </Button>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page.key}
                    onClick={() => {
                      window.location.href = page.link;
                    }}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.text}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <AppHeaderAuth />
              </Box>
            </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
}