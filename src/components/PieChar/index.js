import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data, width }) {
  return (
    <Pie
      style={{
        width: width || "100%",
        height: "100%",
      }}
      data={data}
    />
  );
}

export { PieChart };
