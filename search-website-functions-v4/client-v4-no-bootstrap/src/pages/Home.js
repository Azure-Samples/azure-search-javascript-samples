import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
//import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import logo from "../images/cognitive_search.jpg";
import Stack from "@mui/system/Stack";
import styled from "@emotion/styled";

/* const StyledHomeBox = styled(Box)`

`; */
const StyledStack = styled(Stack)`
margin: 5em auto;
min-height: 30em;
padding-left: 0px;
padding-right: 0px;
max-width: 75%;
outline: 0px;
  * { outline: 1px solid red;};
`;
const StyledImageContainer = styled(Container)`
  width: 500px;
  margin: auto;
`;

const StyledTypographyContainer = styled(Container)`
  display: flex;
  justify-content: center;
`;
const StyledImage = styled.img`
  height: auto;
  width: 100%;
`;

const StyledTypography = styled(Typography)``;

/* * { outline: 1px solid red; } */

const StyledHomeSearchBox = styled(Container)`
  width: 100%;
  margin: 10px auto;
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

        <StyledStack
          className="HomeContainerStack"
          spacing={2}
          direction="column"
        >
          <StyledImageContainer className="ImageContainer">
            <StyledImage className="Image" src={logo} alt="Cognitive Search" />
          </StyledImageContainer>
          <StyledTypographyContainer className="TypographyTextContainer">
            <StyledTypography className="Typography">
              Powered by Azure Cognitive Search
            </StyledTypography>
          </StyledTypographyContainer>
          <StyledHomeSearchBox className="StyledHomeSearchBox">
            <SearchBar
              className="HomeSearchBar"
              navigateToSearchPage={navigateToSearchPage}
            ></SearchBar>
          </StyledHomeSearchBox>
        </StyledStack>

    </>
  );
}
