import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function BookCardSimple({ document }) {
  return (
    <Card sx={{ minWidth: 250, margin: 1 }}>
      <CardActionArea href={`/details/${document.id}`}>
        <CardMedia
          component="div"
          sx={{ height: 180, width: 120 }}
          image={document.image_url}
          title={document.original_title}
          alt={document.original_title}
        />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {document.original_title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
