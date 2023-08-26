import React, { useState } from "react";
import {
  Collapse,
  Checkbox,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import styled from "@emotion/styled";

const FacetListItem = styled(ListItem)`
  padding-left: "36px !important";
`;

const FacetValueListItem = styled(ListItem)`
  padding-left: "46px !important";
`;

const FacetValuesList = styled(List)`
  max-height: 340;
  overflow-y: "auto !important";
  margin-right: "18px !important";
`;

export default function CheckboxFacet({
  name,
  values,
  mapFacetName,
  selectedFacets,
  removeFilter,
  addFilter,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <FacetListItem
        disableripple="true"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ListItemText primary={mapFacetName(name)} />
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </FacetListItem>
      <Collapse in={isExpanded} component="div">
        <FacetValuesList>
          {values.map((facetValue) => {
            // why are there empty facet values?
            if (facetValue.value.length === 0) {
              facetValue.value = `no value set`;
            }

            const isSelected = selectedFacets.some(
              (facet) => facet.value === facetValue.value
            );

            return (
              <FacetValueListItem
                dense
                disableGutters
                id={facetValue.value}
                key={facetValue.value}
              >
                <Checkbox
                  edge="start"
                  disableripple="true"
                  checked={isSelected}
                  onClick={
                    isSelected
                      ? () => {
                          removeFilter({
                            field: name,
                            value: facetValue.value,
                          });
                        }
                      : () => {
                          addFilter(name, facetValue.value);
                        }
                  }
                />
                <ListItemText
                  primary={facetValue.value + " (" + facetValue.count + ")"}
                />
              </FacetValueListItem>
            );
          })}
        </FacetValuesList>
      </Collapse>
    </>
  );
}
