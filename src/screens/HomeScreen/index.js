import React from "react";
import { TopBar } from "../../components/TopBar";
import "./index.css";

function HomeScreen() {
  return (
    <div className="home">
      <TopBar
        label="Dashboard"
        // button={{ label: "Nuevo Expediente", onClick: () => console.log("hi") }}
      />
    </div>
  );
}

export { HomeScreen };
