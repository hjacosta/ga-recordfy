import React from "react";
import "./index.css";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { PieChart } from "../PieChar";

function SummaryCard({ data, files, fileTypes, limit, numberOfPartners }) {
  let fileLimit =
    limit.filter((i) => i.name == data.customer_type)[0]?.limit || 4;

  let completedPct =
    (parseInt(data?.file_amount) /
      parseInt(fileLimit * parseInt(numberOfPartners))) *
    100;
  let borderColor = data?.file_amount != fileLimit ? "#3289cc" : "#fff";

  let chartData = {
    labels: [],
    datasets: [
      {
        label: " %",
        data: [completedPct == 0 ? 0.1 : 100 - completedPct, completedPct],
        backgroundColor: ["transparent", "#3289cc"],
        borderColor: [borderColor],
        borderWidth: 0.5,
      },
    ],
  };

  return (
    <div className="SummaryCard">
      <div className="SummaryCard-content">
        <h1>Resumen</h1>
        <div className="SummaryCard-content-item">
          <span>Cliente : </span>
          <span>{data?.customer_name}</span>
        </div>
        <div className="SummaryCard-content-item">
          <span>Cédula : </span>
          <span>{data?.identification_number}</span>
        </div>
        <div className="SummaryCard-content-item">
          <span>Fecha creación : </span>
          <span>{data?.created_at}</span>
        </div>
        <div className="SummaryCard-content-item">
          <span>Creado por : </span>
          <span>{data?.created_by}</span>
        </div>
      </div>
      <div className="SummaryCard-img">
        <div></div>
        <ul>
          {fileTypes.map((ft, index) => {
            const isUploaded = files.filter(
              (f) => f.file_type === ft.name
            ).length;

            return (
              <li key={index}>
                <span>{ft.name}</span>
                <span>
                  {" "}
                  {isUploaded}/{numberOfPartners}
                </span>
                <BsFillCheckCircleFill
                  size={12.5}
                  color={`${
                    isUploaded >= numberOfPartners
                      ? "var(--success)"
                      : "var(--error)"
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="SummaryCard-img">
        <PieChart data={chartData} />
      </div>
    </div>
  );
}

export { SummaryCard };
