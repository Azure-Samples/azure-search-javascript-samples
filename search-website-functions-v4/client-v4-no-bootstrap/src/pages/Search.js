import React, { useState } from "react";
import request from "../api";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import Results from "../components/Results/Results";
import Pager from "../components/Pager";
import Facets from "../components/Facets/Facets";
import SearchBar from "../components/SearchBar";

import { useQuery } from "@tanstack/react-query";

const StyledPager = styled(Pager)({
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "fit-content",
});

const StyledSearchBar = styled(SearchBar)({

});
const LeftColumn = styled(Stack)`
width: 40%;
border-right: 1px solid #f0f0f0;
`;

const RightColumn = styled(Container)``;

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(
    new URLSearchParams(location.search).get("p") ?? 1
  );
  const [searchTerm, setSearchTerm] = useState(
    new URLSearchParams(location.search).get("q") ?? "*"
  );
  const [top] = useState(new URLSearchParams(location.search).get("top") ?? 8);
  const [skip, setSkip] = useState(
    new URLSearchParams(location.search).get("skip") ?? 0
  );
  const [filters, setFilters] = useState([]);
  const [facets, setFacets] = useState({});

  let resultsPerPage = top;

  function setNavigation(q, p) {

    console.log(`setNavigation: ${q}, ${p}`);

    navigate(`/search?q=${q}&p=${p}`);
  }

  function changeCurrentPage(newPage) {

    console.log(`changeCurrentPage: ${newPage}`);

    const newSkip = (newPage - 1) * top;
    setNavigation(searchTerm, newPage);
    setCurrentPage(newPage);
    setSkip(newSkip);
  }

  const fiveMinutes = 1000 * 60 * 5;

    /* eslint-disable no-unused-vars */
  const { data, isLoading, dataUpdatedAt, error } = useQuery({
    queryKey: ["search", searchTerm, top, skip, currentPage, filters, facets],
    //refetchOnMount: false,
    //refetchOnWindowFocus: false,
    //refetchOnReconnect: false,
    enabled: searchTerm !== undefined,
    staleTime: fiveMinutes, // time in milliseconds
    cacheTime: fiveMinutes,
    queryFn: async () => {
      setSkip((currentPage - 1) * top);
      return request("/api/search", "POST", {
        q: searchTerm,
        top: top,
        skip: (currentPage - 1) * top,
        filters: filters,
      }).then((response) => {
        setFacets(response.facets);
        setFilters(response.filters);
        return response;
      });
    },
  });

  const postSearchHandler = (searchTerm) => {

    console.log(`postSearchHandler: ${searchTerm}`);

    setNavigation(searchTerm, 1);
    setSearchTerm(searchTerm);
    setCurrentPage(1);
    setSkip(0);
  };

  const updateFilters = (filters) => {
    setFilters(filters);
  };
  return (
    <>
      <Stack direction="row">
        <LeftColumn>
          <StyledSearchBar
            navigateToSearchPage={postSearchHandler}
            defaultTerm={searchTerm}
          ></StyledSearchBar>
          <Facets
            facets={facets}
            filters={filters}
            setFilters={updateFilters}
          ></Facets>
        </LeftColumn>
        <RightColumn>
          {isLoading ? (
            <div className="col-md-9">
              <CircularProgress />
            </div>
          ) : (
            <Grid container>
              <Results
                q={searchTerm}
                documents={data.results}
                top={top}
                skip={skip}
                count={data.count}
              ></Results>
              <StyledPager
                className="pager-style"
                currentPage={currentPage}
                resultCount={data.count}
                resultsPerPage={resultsPerPage}
                setCurrentPage={changeCurrentPage}
              ></StyledPager>
            </Grid>
          )}
        </RightColumn>
      </Stack>
    </>
  );
}
