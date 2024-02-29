import React from "react";
import { Card } from "../Card";
import { CardHeader } from "../CardHeader";
import { CardBody } from "../CardBody";
import { FaTimesCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function FileCard({ data, handleRemove }) {
  return (
    <Card>
      <FaTimesCircle
        onClick={(e) => {
          handleRemove();
        }}
        size={18}
        color="#ba1514"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          marginTop: -4,
          marginRight: -4,
        }}
      />
      <NavLink
        style={{ textDecoration: "none", color: "var(--text-black)" }}
        to={data.source}
        target="_blank"
      >
        <CardHeader>
          <p style={{ textTransform: "uppercase" }}>{data.file_type.name}</p>
          {/* <span>Exp. {data.expiration_date}</span> */}
        </CardHeader>
        <CardBody>
          <ul>
            <li>
              <span>Archivo</span>
              <span>{data.name}</span>
            </li>
            <li>
              <span>Fecha de creación</span>
              <span>{new Date(data.created_at).toLocaleString("do-Es")}</span>
            </li>
            <li>
              <span>Fecha de expiración</span>
              <span>
                {new Date(data.expiration_date).toLocaleDateString("do-Es", {
                  timeZone: "UTC",
                })}
              </span>
            </li>
            <li>
              <span>Creado por</span>
              <span>{data.created_by}</span>
            </li>
          </ul>
        </CardBody>
      </NavLink>
    </Card>
  );
}

export default FileCard;
