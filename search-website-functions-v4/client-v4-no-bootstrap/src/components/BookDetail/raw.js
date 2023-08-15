import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function BookCardDetailRaw({document}) {

  return (
    <Card component="div" sx={{ minWidth: 250, margin:1 }}>
      <CardContent component="div">
         <Typography component="div"  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
         <pre>{ JSON.stringify(document, null, 2) }</pre>
          </Typography>
         </CardContent>
    </Card>
  );
}