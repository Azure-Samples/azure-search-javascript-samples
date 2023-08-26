import React, { useState } from "react";
import request from "../api";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import styled from "@emotion/styled";

import { useQuery } from "@tanstack/react-query";

const StyledContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: center;
  gap: 1em;
  margin-top: 1em;
`;

const StyledAutoComplete = styled(Autocomplete)`
  width: 80%;
`;

const StyledButton = styled(Button)`
  max-height: 40px;
`;

export default function SearchBar({ navigateToSearchPage, defaultTerm = "" }) {

  const [q, setQ] = useState(defaultTerm);
  const [suggestions, setSuggestions] = useState([]);

  const top = 5;
  const suggester = "sg";

  /* eslint-disable no-unused-vars */
  const { data, isLoading, error } = useQuery({
    queryKey: ["suggest", q, top, suggester],
    refetchOnMount: true,
    enabled: q.length > 0,
    queryFn: async () => {
      if (q.length > 0) {
        return request("/api/suggest", "POST", {
          q,
          top,
          suggester,
        }).then((response) => {
          let i = 0;
          const autoCompleteOptions = response.suggestions.map(
            (suggestion) => ({ id: i++, label: suggestion.text })
          );
          setSuggestions(autoCompleteOptions);
          return response;
        });
      }
    },
  });

  const onFormSubmit = () => {
    if (navigateToSearchPage) {
      navigateToSearchPage(q);
    }
  };

  function hasLabelValue (option){
    return (
      option !== undefined &&
      option !== null &&
      option.label !== undefined &&
      option.label !== null
    );
  }

  return (
    <StyledContainer onSubmit={onFormSubmit}>
      <StyledAutoComplete
        key="autocomplete"
        freeSolo // accepts both entered text or selected suggestion
        autoSelect // text in box selected
        autoFocus="autoFocus"
        filterOptions={(x) => x}
        options={suggestions}
        value={q}
        noOptionsText="What are you looking for?"
        onChange={
          (e, value, reason) => setQ(value?.label || "")
        }
        onInputChange={(e, newValue, reason) => {
          if (newValue) {
            setQ(newValue);
          }
        }}
        getOptionLabel={(option) => hasLabelValue(option) ? option.label : q}
        // set key to force re-render when q changes
        renderOption={(props, option) => {
          return hasLabelValue(option) ? (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          ) :  (
            <li {...props} key={q}>
              {q}
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="What are you looking for?"
            onKeyDown={(e) => {
              if (e.code.toLowerCase() === "enter" && e.target.value) {
                onFormSubmit(e.target.value);
              }
            }}
          />
        )}
      />
      <StyledButton
        key="styledbutton"
        variant="contained"
        onClick={onFormSubmit}
      >
        Search
      </StyledButton>
    </StyledContainer>
  );
}
