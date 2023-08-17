import React, { useState, useRef } from "react";
import request from "../api";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import styled from "@emotion/styled";


import { useQuery } from "@tanstack/react-query";

const StyledContainer = styled.div`
padding: 0 16px 0 16px;
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

export default function SearchBar2({ navigateToSearchPage, defaultTerm = "" }) {
  //console.log(`SearchBar2 called with defaultTerm=${defaultTerm}`);

  const [q, setQ] = useState(defaultTerm);
  const [suggestions, setSuggestions] = useState([]);

  const top = 5;
  const suggester = "sg";

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
    console.log(`onFormSubmit called with '${q}'`);
    if (navigateToSearchPage) {
      navigateToSearchPage(q);
    }
  };



  return (
    <StyledContainer onSubmit={onFormSubmit}>
        <StyledAutoComplete
          key='autocomplete'
          freeSolo // accepts both entered text or selected suggestion
          //disableClearable // no x button
          autoSelect // text in box selected
          autoFocus="autoFocus"
          filterOptions={(x) => x}
          options={suggestions}
          value={q}
          noOptionsText="Enter a book title"
          //renderInput={(params) => <TextField {...params} label="Books" />}
          onChange={(e, value, reason) =>
            setQ(value?.label ||"")
            // console.log(
            //   `onChange ${JSON.stringify(value)} with ${JSON.stringify(reason)} - q=${q}`
            // )
          }
          onInputChange={(e, newValue, reason) => {
            // console.log(
            //   `onInputChange ${JSON.stringify(newValue)} with ${JSON.stringify(
            //     reason
            //   )}`
            // );
            if (newValue) {
              setQ(newValue);
            }
          }}
          getOptionLabel={(option) => {
            //console.log(`getOptionLabel 1 ${JSON.stringify(option)}`);
            if (
              option !== undefined &&
              option !== null &&
              option.label !== undefined &&
              option.label !== null
            ) {
               console.log(`getOptionLabel 2 ${JSON.stringify(option.label)}`);
              // item from list selected
              return option?.label;
            } else {
            //   console.log(`getOptionLabel 3 ${JSON.stringify(option)}`);
              // text entered
              return q;
            }
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Books"
              placeholder="Enter a book"
              onKeyDown={e => {
                console.log(`onKeyDown ${e.code} ${JSON.stringify(e?.target?.value)}`)
                if (e.code.toLowerCase() === 'enter' && e.target.value) {
                    onFormSubmit((e.target.value));
                }
              }}
            />
          )}
        />
        <StyledButton key='styledbutton' variant="contained" onClick={onFormSubmit}>
          Search
        </StyledButton>
      </StyledContainer>

  );
}
