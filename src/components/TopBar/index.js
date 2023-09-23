import React from "react";
import "./index.css";

function TopBar({ label, button }) {
  return (
    <div className="TopBar-container">
      <p>{label || "Expedientes"}</p>

      {button && (
        <span onClick={button.onClick}>
          {button?.label || "Nuevo expediente"}
        </span>
      )}
    </div>
  );
}

export { TopBar };
