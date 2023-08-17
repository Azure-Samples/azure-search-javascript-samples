import React, { useEffect, useState } from "react";
import { List, Chip } from "@mui/material";
import CheckboxFacet from "./CheckboxFacet";
import styled from "styled-components";

export default function Facets(props) {
  const [filters, setFilters] = useState([]);
  const [facets, setFacets] = useState({});

  useEffect(() => {
    setFilters(props.filters);
    setFacets(props.facets);
  }, [props.filters, props.facets]);

  function mapFacetName(facetName) {
    const capitalizeFirstLetter = (string) =>
      string[0] ? `${string[0].toUpperCase()}${string.substring(1)}` : "";
    facetName = facetName.trim();
    facetName = capitalizeFirstLetter(facetName);

    facetName = facetName.replace("_", " ");

    return facetName;
  }

  var renderFacets;
  try {
    renderFacets = Object.keys(facets).map((key) => {
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
    });
  } catch (error) {
    console.log(error);
  }

  const renderFilters = filters.map((filter, index) => {
    return (
      <li key={index}>
        <Chip
          label={`${mapFacetName(filter.field)}: ${filter.value}`}
          onDelete={() => removeFilter(filter)}
          className="chip"
        />
      </li>
    );
  });

  // events
  function addFilter(name, value) {
    const newFilters = filters.concat({ field: name, value: value });
    props.setFilters(newFilters);
  }

  function removeFilter(filter) {
    const newFilters = filters.filter(
      (item) => item.value !== filter.value
    );
    props.setFilters(newFilters);
  }

  return (
    <div sx={{height: "100%"}}>
      <div sx={{borderRight: "1px solid #f0f0f0"}}>
        <div id="clearFilters">
          <ul sx={{listStyle: "none"}} className="filterlist">{renderFilters}</ul>
        </div>
        <FacetList sx={{margin: "0.25em", paddingLeft: "36px !important"}} component="nav" className="listitem">
          {renderFacets}
        </FacetList>
      </div>
    </div>
  );
}

const FacetList = styled(List)({
  marginTop: "32px !important",
});
