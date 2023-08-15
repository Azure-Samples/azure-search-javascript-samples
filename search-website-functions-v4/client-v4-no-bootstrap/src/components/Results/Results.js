import React from 'react';
import Result from './Result/Result';

import "./Results.css";

export default function Results({q, skip, top, count, documents }) {

  let results = documents.map((result, index) => {
    return <Result 
        key={index} 
        document={result.document}
      />;
  });

  let beginDocNumber = Math.min(skip + 1, count);
  let endDocNumber = Math.min(skip + top, count);

  return (
    <div>
      <p className="results-info">{q}</p>
      <p className="results-info">Showing {beginDocNumber}-{endDocNumber} of {count} results</p>
      <div className="row row-cols-md-5 results">
        {results}
      </div>
    </div>
  );
};
