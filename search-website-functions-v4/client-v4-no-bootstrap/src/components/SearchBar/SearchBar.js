import React, {useState } from 'react';
import request from '../../api';
import Suggestions from './Suggestions/Suggestions';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "./SearchBar.css";
import {
    useQuery,
  } from '@tanstack/react-query'


export default function SearchBar(props) {

    let [q, setQ] = useState("");
    let [suggestions, setSuggestions] = useState([]);
    let [showSuggestions, setShowSuggestions] = useState(false);

    const top = 5;
    const suggester = 'sg';

    const onSearchHandler = () => {
        props.postSearchHandler(q);
        setShowSuggestions(false);
    }

    const suggestionClickHandler = (s) => {
        document.getElementById("search-box").value = s;
        setShowSuggestions(false);
        props.postSearchHandler(s);    
    }

    const onEnterButton = (event) => {
        if (event.keyCode === 13) {
            onSearchHandler();
        }
    }

    const onChangeHandler = () => {
        var searchTerm = document.getElementById("search-box").value;
        setShowSuggestions(true);
        setQ(searchTerm);

        // use this prop if you want to make the search more reactive
        if (props.searchChangeHandler) {
            props.searchChangeHandler(searchTerm);
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["suggest", q, top, suggester], 
        refetchOnMount: true,
        enabled: q.length > 0,
        queryFn: async() =>   {

            if (q.length > 0) {
    
                return request( '/api/suggest', "POST", {
                    q,
                    top,
                    suggester
                }).then(response => {
                    setSuggestions(response.suggestions);
                    return response
                });
            } 
        }

      });


    var suggestionDiv;
    if (showSuggestions && q.length > 0 && suggestions.length > 0) {
        suggestionDiv = (<Suggestions suggestions={suggestions} suggestionClickHandler={(s) => suggestionClickHandler(s)}></Suggestions>);
    } else {
        suggestionDiv = (<div></div>);
    }

    return (
        <Box sx={{
            paddingLeft: "16px",
            paddingRight: "16px",
        }}>
            <div className="input-group" onKeyDown={e => onEnterButton(e)}>
                <div className="suggestions" >
                    <TextField 
                        autoComplete="off" // setting for browsers; not the app
                        type="text" 
                        id="search-box" 
                        placeholder="What are you looking for?" 
                        onChange={onChangeHandler} 
                        defaultValue={props.q}
                        onBlur={() => setShowSuggestions(false)}
                        onClick={() => setShowSuggestions(true)}
                        sx={{
                            width: "100%",
                            height: "auto",
                        }}>
                    </TextField>
                    {suggestionDiv}
                </div>
                <div className="input-group-btn">
                    <Button variant="contained" type="submit" onClick={onSearchHandler} sx={{

                    }}>
                        Search
                    </Button>
                </div>
            </div>
        </Box>
    );
};