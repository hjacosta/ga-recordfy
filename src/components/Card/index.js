import React from "react";
import "./index.css";

function Card({ children, handleClick }) {
  return (
    <div onClick={handleClick} className="Card">
      {children}
    </div>
  );
}

export { Card };
