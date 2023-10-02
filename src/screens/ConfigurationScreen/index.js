import React from "react";
import { TopBar } from "../../components/TopBar";
import { CustomAcordion } from "../../components/CustomAccordion";

function ConfigurationScreen() {
  return (
    <div>
      <TopBar
        label="Configuración"
        // button={{ label: "Nuevo Expediente", onClick: () => console.log("hi") }}
      />
      <div>
        <CustomAcordion />
      </div>
    </div>
  );
}

export { ConfigurationScreen };
