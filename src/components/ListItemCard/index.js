import React from "react";
import { useNavigate } from "react-router-dom";
import { setStatusFromFileNumber, getStatusColor } from "../../utils/records";
import "./index.css";

function ListItemCard({ data, limit }) {
  const navigate = useNavigate();

  console.log("#########", limit, data);
  let fileLimit =
    limit.filter((i) => i.name == data.customer_type)[0]?.limit || 4;

  return (
    <div
      className="ListItemCard"
      onClick={() => navigate(`/records/${data.record_code}`)}
    >
      <div className="ListItemCard-header">
        <p>{`${data.customer_name}`}</p>
        <span>{data.identification_number}</span>
        <div
          className="ListItemCard-header-status"
          style={getStatusColor(
            setStatusFromFileNumber(data.file_amount, fileLimit)
          )} //fileLimit to be replace by data.file_limit
        ></div>
      </div>
      <div className="ListItemCard-detail">
        <ul>
          <li>
            <span>No. expediente</span>
            <span>{data.record_code}</span>
          </li>
          <li>
            <span>Tipo de Cliente</span>
            <span>{data.customer_type}</span>
          </li>
          <li>
            <span>Archivos</span>
            <span>
              {data.file_amount} de {fileLimit}
            </span>
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
