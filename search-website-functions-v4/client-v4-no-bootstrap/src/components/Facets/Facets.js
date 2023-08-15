import React, { useEffect, useState } from "react";
import { List, Chip } from "@mui/material";
import CheckboxFacet from "./CheckboxFacet/CheckboxFacet";
import styled from "styled-components";
import "./Facets.css";

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
    <div id="facetPanel" className="box">
      <div className="facetbox">
        <div id="clearFilters">
          <ul className="filterlist">{renderFilters}</ul>
        </div>
        <FacetList component="nav" className="listitem">
          {renderFacets}
        </FacetList>
      </div>
    </div>
  );
}

const FacetList = styled(List)({
  marginTop: "32px !important",
});
