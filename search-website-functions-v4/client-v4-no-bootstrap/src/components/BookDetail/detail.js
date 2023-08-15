import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from '@mui/material/Rating';

export default function BookCardDetail({ document }) {
  return (
    <Card sx={{ minWidth: 250, maxWidth: 300, margin: 1 }}>
      <CardContent
        sx={{
          padding: 3,
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }} color="text.secondary" gutterBottom>
          {document.original_title}
        </Typography>

        <CardMedia
          sx={{ height: 180, width: 120, marginBottom:4 }}
          image={document.image_url}
          title={document.original_title}
          alt={document.original_title}
        />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {document.authors?.join("; ")} - {document.original_publication_year}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          ISBN {document.isbn}
        </Typography>
        <Rating name="half-rating-read" value={parseInt(document.average_rating)} precision={0.1} readOnly></Rating>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {document.ratings_count} Ratings
        </Typography>
      </CardContent>
    </Card>
  );
}
