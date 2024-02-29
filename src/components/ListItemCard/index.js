import React from "react";
import { useNavigate } from "react-router-dom";
import { setStatusFromFileNumber, getStatusColor } from "../../utils/records";
import getLabelName from "../../utils/appLabels";
import "./index.css";

function ListItemCard({ data, limit }) {
  const navigate = useNavigate();

  let requiredFiles = data.beneficiaries.reduce(
    (acc, item) => acc + item.required_files.length,
    0
  );

  let recordFiles = data.beneficiaries.reduce(
    (acc, item) => acc + item.record_files.length,
    0
  );

  return (
    <div
      className="ListItemCard"
      onClick={() => navigate(`/records/${data.record_id}`)}
    >
      <div className="ListItemCard-header">
        <p>{`${data.customer.customer_name}`}</p>
        <span>{data.customer.identification_number}</span>
        <div
          className="ListItemCard-header-status"
          style={getStatusColor(
            setStatusFromFileNumber(recordFiles, requiredFiles)
          )}
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
            <span>{getLabelName(data.customer.customer_type)}</span>
          </li>
          <li>
            <span>Archivos</span>
            <span>
              {recordFiles} de {requiredFiles}
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
