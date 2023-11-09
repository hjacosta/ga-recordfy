import React from "react";
import NotFoundImg from "../../assets/images/not-found.png";

function NoDataFound({ label }) {
  return (
    <div
      style={{
        height: 400,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.5,
        color: "grey",
        fontSize: 14,
        transition: "ease-in 300ms",
      }}
    >
      <img src={NotFoundImg} />
      <span style={{ marginTop: 12 }}>
        {label || "No se econtro ningún elemento"}
      </span>
    </div>
  );
}

export { NoDataFound };
