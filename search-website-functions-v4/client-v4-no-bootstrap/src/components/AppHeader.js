import React from "react";
import AuthenticationButton from "./AuthenticationButton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import logo from "../images/microsoft_small.png";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";

// Navigation links
const pages = [
  {
    key: "search-nav",
    link: "/search",
    text: "Search",
  },
  {
    key: "learn-more-nav",
    link: "https://azure.microsoft.com/services/search/",
    text: "Learn more",
  },
];

const StyledDiv = styled.div`
  // Uncomment to debug
  //border: 1px solid red;

  // Space between nav bar and the main body of the page
  margin-bottom: 3rem;
`;

const StyledHomeIconButton = styled(Button)`
  // Height of Microsoft Logo as clickable button
  height: 50;
`;
const StyledPageSection = styled(Box)`
  // Push Login butt to the right
  flex-grow: 1;

  // buttons are horizontally aligned side-by-side
  display: flex;
`;
const StyledPageButton = styled(Button)`
  color: white;
`;


function HomeIconButton() {
  return (
    <StyledHomeIconButton
      key="Home"
      onClick={() => {
        window.location.href = `/`;
      }}
    >
      <img src={logo} alt="Microsoft" />
    </StyledHomeIconButton>
  );
}

function PageButtons() {
  return (
    <StyledPageSection>
      {pages.map((page) => (
        <StyledPageButton
          key={page.key}
          onClick={() => {
            window.location.href = page.link;
          }}
        >
          {page.text}
        </StyledPageButton>
      ))}
    </StyledPageSection>
  );
}


export default function AppHeader() {
  return (
    <StyledDiv>
    <AppBar>
      <Toolbar>
        <HomeIconButton />
        <PageButtons />
        <AuthenticationButton />
      </Toolbar>
    </AppBar>
    </StyledDiv>
  );
}
