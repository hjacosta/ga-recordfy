import React from "react";
import "./index.css";

function ListItemCard({ data }) {
  return (
    <div className="ListItemCard">
      <div className="ListItemCard-header">
        <p>{`${data.customer_first_name} ${data.customer_last_name}`}</p>
        <span>{data.identification_number}</span>
      </div>
      <div className="ListItemCard-detail">
        <ul>
          <li>
            <span>No. expediente</span>
            <span>{data.record_code}</span>
          </li>
          <li>
            <span>Archivos</span>
            <span>8</span>
          </li>
          <li>
            <span>Fecha de creación</span>
            <span>{data.created_at.split("T")[0]}</span>
          </li>
          <li>
            <span>Cratedo por</span>
            <span>{data.created_by}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export { ListItemCard };
