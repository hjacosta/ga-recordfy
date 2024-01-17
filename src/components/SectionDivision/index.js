import React from "react";

function SectionDivision({ title, icon, containerStyle, textStyle }) {
  const styles = {
    fontSize: 14,
    color: "grey",
    fontWeight: 500,
    textTransform: "uppercase",
    margin: "30px 0",
    paddingLeft: 8,
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        ...containerStyle,
      }}
    >
      {icon}
      <p style={{ ...styles, ...textStyle }}>{title}</p>
    </div>
  );
}

export { SectionDivision };
