import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";

function isObject(v) {
  return '[object Object]' === Object.prototype.toString.call(v);
};

// Alpha sort JSON for easy reading
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

const StyledCard = styled(Card)`
  // Uncomment to debug
  //border: 1px solid red;

  min-width: 250px;
  margin: 1em auto;
`;

const StyledTypography = styled(Typography)`
  // Text size of book title
  font-size: 14px;

  // Text color is black with 60% opacity
  color: #000;
  opacity: 0.6;
`;

export default function BookCardDetailRaw({document}) {

  return (
    <StyledCard>
      <CardContent >
        {/* Force component to div so pre doesn't throw error */}
         <StyledTypography component='div' gutterBottom>
         <pre>{ JSON.stringify(sortJson(document), null, 2) }</pre>
          </StyledTypography>
         </CardContent>
    </StyledCard>
  );
}