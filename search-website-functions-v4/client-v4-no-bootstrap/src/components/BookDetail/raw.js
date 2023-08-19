import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function isObject(v) {
  return '[object Object]' === Object.prototype.toString.call(v);
};
function sortJson(o) {
  if (Array.isArray(o)) {
      return o.sort().map(sortJson);
  } else if (isObject(o)) {
      return Object
          .keys(o)
          .sort()
          .reduce(function (a, k) {
              a[k] = sortJson(o[k]);

              return a;
          }, {});
  }
  return o;
}

export default function BookCardDetailRaw({document}) {

  return (
    <Card component="div" sx={{ minWidth: 250, margin:1 }}>
      <CardContent component="div">
         <Typography component="div"  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
         <pre>{ JSON.stringify(sortJson(document), null, 2) }</pre>
          </Typography>
         </CardContent>
    </Card>
  );
}