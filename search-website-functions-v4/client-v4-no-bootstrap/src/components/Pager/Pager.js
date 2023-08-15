import React from "react";
import TablePagination from "@mui/material/TablePagination";
import Container from "@mui/material/Container";

import "./Pager.css";

export default function Pager2(props) {
  const pagesInResultSet = Math.round(props.resultCount / props.resultsPerPage);
  const moreThanOnePage = pagesInResultSet > 1;

  if (!moreThanOnePage) return <></>;

  const handleChangePage = (event, newPage) => {
    props.setCurrentPage(newPage + 1);
  };
  return (
    <Container className="pager" align="center">
    <TablePagination
      className="pager"
      align="center"
      component="div"
      count={props.resultCount}
      page={props.currentPage - 1} // zero-based control from material ui
      onPageChange={handleChangePage}
      rowsPerPage={props.resultsPerPage}
      rowsPerPageOptions={[props.resultsPerPage]} // don't display b/c there is a single value
      showFirstButton={true}
      showLastButton={true}
      labelDisplayedRows={({ from, to, count }) =>
        `${props.currentPage} of ${Math.round(
          props.resultCount / props.resultsPerPage
        )} pages`
      }
    />
    </Container>
  );
}
