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

const FacetListItem = styled(ListItem)({
  paddingLeft: "36px !important",
});

const FacetValueListItem = styled(ListItem)({
  paddingLeft: "46px !important",
});

const FacetValuesList = styled(List)({
  maxHeight: 340,
  overflowY: "auto !important",
  marginRight: "18px !important",
});

export default function CheckboxFacet(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <FacetListItem
        disableripple="true"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ListItemText primary={props.mapFacetName(props.name)} />
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </FacetListItem>
      <Collapse in={isExpanded} component="div">
        <FacetValuesList>
          {props.values.map((facetValue) => {
            // why are there empty facet values?
            if (facetValue.value.length === 0) {
              facetValue.value = `no value set`;
            }

            const isSelected = props.selectedFacets.some(
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
                          props.removeFilter({
                            field: props.name,
                            value: facetValue.value,
                          });
                        }
                      : () => {
                          props.addFilter(props.name, facetValue.value);
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


