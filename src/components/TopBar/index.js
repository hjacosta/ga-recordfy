import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";

import "./index.css";
import { updateSearchPath } from "../../hooks/useUpdateSearchPath";

function TopBar({ label, button, backTo, btnIcon }) {
  const navigate = useNavigate();

  let historyPath = sessionStorage.getItem("search_path");

  return (
    <div className="TopBar-container">
      <div className="TopBar-left">
        {backTo && (
          <IoReturnUpBackOutline
            className="TopBar-left-icon"
            onClick={() => navigate("/records")} //navigate(backTo)}
          />
        )}
        <p>
          {label || "Expedientes"}{" "}
          {label == "Expediente" &&
            historyPath
              .split("/")
              .filter((item) => item != "")
              .map((link, index) => (
                <>
                  {" / "}
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "var(--dark-blue)",
                    }}
                    key={index}
                    to={`/records/${link.trim()}`}
                    onClick={() => updateSearchPath(link.trim())}
                  >
                    {link}
                  </Link>
                </>
              ))}
        </p>
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
