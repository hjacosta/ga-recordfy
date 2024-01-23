import React from "react";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";

import "./index.css";

function TopBar({ label, button, backTo, btnIcon }) {
  const navigate = useNavigate();

  return (
    <div className="TopBar-container">
      <div className="TopBar-left">
        {backTo && (
          <IoReturnUpBackOutline
            className="TopBar-left-icon"
            onClick={() => navigate(backTo)}
          />
        )}
        <p>{label || "Expedientes"}</p>
      </div>

      {button && (
        <span
          onClick={button.onClick}
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          {btnIcon ? btnIcon : ""}
          {button?.label || "Nuevo expediente"}
        </span>
      )}
    </div>
  );
}

export { TopBar };
