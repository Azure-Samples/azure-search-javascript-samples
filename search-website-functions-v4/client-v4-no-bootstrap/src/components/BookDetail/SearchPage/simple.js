import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styled from "@emotion/styled";

const StyledCard = styled(Card)`
  width: 10rem;
  padding: 16px;
  text-align: center;
  margin: 10px;
  inline-block;
  max-height: 18rem;
`;

const StyledCardActionArea = styled(CardActionArea)`
  cursor: pointer;
  &:hover: {
    background-color: #C0DDF5;
  } 
`;

const StyledCardContentImage = styled(CardContent)`
  padding: 16px;
  text-align: center;
  height: auto;

`;

const StyledImg = styled(CardMedia)`
  height: 180px;
  max-width: 120px;
  margin: 0 auto;
`;

export default function BookCardSimple({ document }) {

  const shortenTitle = (title) => {
    if (title.length > 20) {
      return title.slice(0, 35) + "...";
    }
    return title;
  };

  return (
    <StyledCard>
      <StyledCardActionArea href={`/details/${document.id}`}>
        <StyledCardContentImage>
          <StyledImg
            image={document.image_url}
            title={document.original_title}
            alt={document.original_title}
          />
        </StyledCardContentImage>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {shortenTitle(document.original_title)}
          </Typography>
        </CardContent>
      </StyledCardActionArea>
    </StyledCard>
  );
}
