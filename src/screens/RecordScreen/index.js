import React from "react";
import { TopBar } from "../../components/TopBar";
import "./index.css";

function RecordScreen() {
  return (
    <div>
      <TopBar
        label="Expedientes"
        button={{ label: "Nuevo Expediente", onClick: () => console.log("hi") }}
      />
    </div>
  );
}

export { RecordScreen };
