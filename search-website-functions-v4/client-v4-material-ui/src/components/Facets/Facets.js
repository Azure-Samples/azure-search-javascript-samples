import React, { useEffect, useState } from "react";
import { List, Chip } from "@mui/material";
import CheckboxFacet from "./CheckboxFacet";
import styled from "@emotion/styled";

const StyledFacetComponent = styled.div`
  border-right: "1px solid #f0f0f0";
  height: "100%";
`;
const StyledSelectedFacets = styled.div``;
const StyledFacetList = styled(List)`
  margin: "0.25em";
  margin-top: "32px !important";
  padding-left: "36px !important";
`;
export default function Facets(props) {
  const [filters, setFilters] = useState([]);
  const [facets, setFacets] = useState({});

  useEffect(() => {
    setFilters(props.filters);
    setFacets(props.facets);
  }, [props.filters, props.facets]);

  // Change facet name to be more readable
  // e.g. "author" -> "Author"
  // e.g. "publication_year" -> "Publication Year"
  function mapFacetName(facetName) {
    facetName =
      `${facetName[0].toUpperCase()}${facetName.substring(1)}`.replace(
        "_",
        " "
      ) || ``;
    return facetName;
  }

  function addFilter(name, value) {
    const newFilters = filters.concat({ field: name, value: value });
    props.setFilters(newFilters);
  }

  function removeFilter(filter) {
    const newFilters = filters.filter((item) => item.value !== filter.value);
    props.setFilters(newFilters);
  }

  return (
    <StyledFacetComponent>
      <StyledSelectedFacets>
        <List>
          {filters.map((filter, index) => {
            return (
              <Chip
                key={index}
                label={`${mapFacetName(filter.field)}: ${filter.value}`}
                onDelete={() => removeFilter(filter)}
              />
            );
          })}
        </List>
      </StyledSelectedFacets>
      <StyledFacetList>
        {Object.keys(facets).map((key) => {
          return (
            <CheckboxFacet
              key={key}
              name={key}
              values={facets[key]}
              addFilter={addFilter}
              removeFilter={removeFilter}
              mapFacetName={mapFacetName}
              selectedFacets={filters.filter((f) => f.field === key)}
            />
          );
        })}
      </StyledFacetList>
    </StyledFacetComponent>
  );
}
