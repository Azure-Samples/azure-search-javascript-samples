import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BookCardDetail from "./detail";
import BookCardDetailRaw from "./raw";
import Container from "@mui/material/Container";

// Generic tab panel used for both
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
        <Box>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function BookDetails({ document }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box>
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
        <Container>
          <BookCardDetail document={document} />
        </Container>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Container>
          <BookCardDetailRaw document={document} />
        </Container>
      </CustomTabPanel>
    </>
  );
}
