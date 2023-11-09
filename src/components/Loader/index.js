import React from "react";
import { BallTriangle } from "react-loader-spinner";

function Loader() {
  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 460px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#99a6c1"
        ariaLabel="ball-triangle-loading"
        wrapperClass={{}}
        wrapperStyle=""
        visible={true}
      />
    </div>
  );
}

export { Loader };
