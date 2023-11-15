import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
//import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import logo from "../images/cognitive_search.jpg";
import styled from "@emotion/styled";

/* const StyledHomeBox = styled(Box)`

`; */
const StyledContainer = styled.div`

  // Uncomment to debug
  // border: 1px solid red;

  // Center body with space around
  margin: 10rem auto;
  
  min-height: 30em;
  padding-left: 0px;
  padding-right: 0px;
  max-width: 75%;
  outline: 0px;
`;
const StyledImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledTypographyContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledImage = styled.img`
  margin-bottom: 30px;
  max-width: 400px;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 30px;
`;

const StyledHomeSearchBox = styled(Container)`
  width: 100%;
  margin: 10px auto;
`;

export default function Home() {
  const navigate = useNavigate();
  const navigateToSearchPage = (q) => {

    if (!q || q === "") {
      q = "*";
    }
    navigate(`/search?q=${q}&page=1`);
  };

  return (
    <>
      <StyledContainer
        className="HomeContainerStack"
        spacing={2}
        direction="column"
      >
        <StyledImageContainer className="ImageContainer">
          <StyledImage className="Image" src={logo} alt="Cognitive Search" />
        </StyledImageContainer>
        <StyledTypographyContainer className="TypographyTextContainer">
          <StyledTypography className="Typography">
            Powered by Azure AI Search
          </StyledTypography>
        </StyledTypographyContainer>
        <StyledHomeSearchBox className="StyledHomeSearchBox">
          <SearchBar
            className="HomeSearchBar"
            navigateToSearchPage={navigateToSearchPage}
          ></SearchBar>
        </StyledHomeSearchBox>
      </StyledContainer>
    </>
  );
}
