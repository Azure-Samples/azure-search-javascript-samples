import React from "react";
import TablePagination from "@mui/material/TablePagination";
import styled from "@emotion/styled";

const StyledTablePagination = styled(TablePagination)`
margin: auto;
max-width: fit-content;
border-bottom: 0;
`;

export default function Pager(props) {
  const pagesInResultSet = Math.round(props.resultCount / props.resultsPerPage);
  const moreThanOnePage = pagesInResultSet > 1;

  if (!moreThanOnePage) return <></>;

  const handleChangePage = (event, newPage) => {
    props.setCurrentPage(newPage + 1);
  };
  return (
    <StyledTablePagination
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
  );
}
