import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import request from '../api';
import BookDetailsTab from "../components/BookDetail/DetailPage/booktab";

import {
  useQuery,
} from '@tanstack/react-query'

export default function Details() {

  let { id } = useParams();
  const [document, setDocument] = useState({});

  const lookupRequest = () => request('/api/lookup?id=' + id, "GET").then(response => {
    const doc = response.document;
    setDocument(doc);
    return response
  });

  const fiveMinutes = 1000 * 60 * 5;

    /* eslint-disable no-unused-vars */
  const { data, isLoading, error } = useQuery({
    queryKey: ["lookup", id], 
    queryFn: async() =>  lookupRequest(),
    enabled: id !== undefined,
    staleTime: fiveMinutes, // time in milliseconds
    cacheTime: fiveMinutes,
    //refetchOnMount: false,
    //refetchOnWindowFocus: false,
    //refetchOnReconnect: false,
  });

  return (
    <Container sx = {{
      padding: 4
    }}>
      { isLoading ? <CircularProgress /> : <BookDetailsTab document={document}/>}
      { error && <div>{error}</div> }
    </Container>
   
  );
}
