import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function Status() {
  const [status, setStatus] = useState({});

    useEffect(() => {
    axios.get('/api/status')
      .then(response => {
        console.log(JSON.stringify(response.data))
        setStatus(response.data);

      },
      error => {
        console.log(error);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  return (
    <main className="main main--home">
      <div className="row home-search">
      <div><pre>{JSON.stringify(status, null, 2) }</pre></div>
      </div>
    </main>
  );
};
