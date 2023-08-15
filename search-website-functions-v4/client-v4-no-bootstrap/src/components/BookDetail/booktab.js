import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BookCardDetail from ".//detail";
import BookCardDetailRaw from "./raw";
import Container from "@mui/material/Container";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function BookDetailsTab({ document }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Book" />
            <Tab label="Raw Data" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Container className="book-card-detail-container" align="center">
            <BookCardDetail document={document} />
          </Container>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Container className="book-card-detail-container-raw" align="left">
            <BookCardDetailRaw document={document} />
          </Container>
        </CustomTabPanel>
      </Box>
    </>
  );
}
