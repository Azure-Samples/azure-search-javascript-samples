import React from "react";
import "./Result.css";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function Result(props) {



  return (
    <Card sx={{ minWidth: 250, margin:1 }}>
      <CardActionArea href={`/details/${props.document.id}`}>
        <CardMedia
          sx={{ height: 180, width: 120 }}
          image={props.document.image_url}
          title={props.document.original_title}
          alt={props.document.original_title}
        />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.document.original_title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
