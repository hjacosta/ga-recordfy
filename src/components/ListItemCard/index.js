import React from "react";
import { useNavigate } from "react-router-dom";
import {
  setStatusFromFileNumber,
  getStatusColor,
  getRiskLevelTag,
  getCurrentRecordFiles,
} from "../../utils/records";
import getLabelName from "../../utils/appLabels";
import "./index.css";

function ListItemCard({ data, limit }) {
  console.log(data);

  const navigate = useNavigate();

  let requiredFiles = data.beneficiaries.reduce(
    (acc, item) => acc + getCurrentRecordFiles(item.required_files).length,
    0
  );

  let recordFiles = data.beneficiaries.reduce(
    (acc, item) => acc + getCurrentRecordFiles(item.record_files).length,
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
          <li
            className=""
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <span>Nivel de riesgo</span>
            <span
              className="SummaryCard-risktag"
              style={{
                backgroundColor: getRiskLevelTag(data.customer.risk_level)
                  .color,
              }}
            >
              {getRiskLevelTag(data.customer.risk_level).label}
            </span>
          </li>
          <li>
            <span>Pep</span>
            <span>{data.customer.is_pep ? "Si" : "No"}</span>
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
          {/* <li>
            <span>Creado por</span>
            <span>{data.created_by}</span>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export { ListItemCard };
