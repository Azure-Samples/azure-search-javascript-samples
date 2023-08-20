import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import logo from "../images/cognitive_search.jpg";
import Stack from "@mui/system/Stack";
import styled from "@emotion/styled";

const StyledHomeBox = styled(Box)`
margin: 5em auto;
min-height: 30em;
outline: 1px solid blue;
padding-left: 0px;
padding-right: 0px;
max-width: 50%;
outline: 0px;
`;

const StyledImageContainer = styled(Container)`
width: 500px;
margin: auto;
`;

const StyledImage = styled.img`
height: auto;
width: 100%;
`;

/* * { outline: 1px solid red; } */

const StyledHomeSearchBox = styled(Box)`
width: 100%;
margin: 10px auto;
`;

const StyledStack = styled(Stack)`
`;

const StyledTypography = styled(Typography)`
`;

const StyledSearchBar = styled(SearchBar)`
`;

export default function Home() {
  const navigate = useNavigate();
  const navigateToSearchPage = (q) => {
    console.log(`q: ${q}`);

    if (!q || q === "") {
      q = "*";
    }
    navigate(`/search?q=${q}&page=1`);
  };

  return (
    <>
      <StyledHomeBox align="center">
        <StyledStack spacing={2} direction="column" align="center">
          <StyledImageContainer align="center">
            <StyledImage
              src={logo}
              alt="Cognitive Search"
            />
          </StyledImageContainer>
          <StyledTypography >
            Powered by Azure Cognitive Search
          </StyledTypography>
          <StyledHomeSearchBox>
            <StyledSearchBar
              navigateToSearchPage={navigateToSearchPage}
            ></StyledSearchBar>
          </StyledHomeSearchBox>
        </StyledStack>
      </StyledHomeBox>
    </>
  );
}
