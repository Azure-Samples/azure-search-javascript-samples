import React from "react";

import "./Suggestions.css";

export default function Suggestions(props) {
  const suggestionClickHandler = (e) => {
    props.suggestionClickHandler(e.currentTarget.id);
  };
  /*
  let suggestions = props.suggestions.map((s, index) => {
    return (
      <div
        className="suggestion-item"
        key={index}
        id={s.text}
        onMouseDown={suggestionClickHandler}
      >
        {s.text}
      </div>
    );
  });*/

  return (
    <div className="suggestion-border">
      {props.suggestions.map((s, index) => (
        <div
          className="suggestion-item"
          key={index}
          id={s.text}
          onMouseDown={suggestionClickHandler}
        >
          {s.text}
        </div>
      ))}
    </div>
  );
}
