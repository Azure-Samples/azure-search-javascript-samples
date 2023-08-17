import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styled from "@emotion/styled";

const StyledCard = styled(Card)`
  width: 250px;
  padding: 16px;
  text-align: center;
  margin: 10px;
  inline-block;

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
`;

const StyledImg = styled(CardMedia)`
  height: 180px;
  max-width: 120px;
  margin: 0 auto;
`;

export default function Result(props) {
  return (
    <StyledCard>
      <StyledCardActionArea href={`/details/${props.document.id}`}>
        <StyledCardContentImage>
          <StyledImg
            image={props.document.image_url}
            title={props.document.original_title}
            alt={props.document.original_title}
          />
        </StyledCardContentImage>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.document.original_title}
          </Typography>
        </CardContent>
      </StyledCardActionArea>
    </StyledCard>
  );
}
