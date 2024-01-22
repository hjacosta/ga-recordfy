import React from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { PieChart } from "../PieChar";
import getLabelName from "../../utils/appLabels";
import { getCountries } from "../../utils/preData/countries";
import "./index.css";

function SummaryCard({ data }) {
  const [countries, setCountries] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let res = await getCountries();
      setCountries(res);
    })();
  }, []);
  let requiredFiles = data.beneficiaries.reduce(
    (acc, item) => acc + item.required_files,
    0
  );

  let recordFiles = data.beneficiaries.reduce(
    (acc, item) => acc + item.record_files.length,
    0
  );

  let completedPct = (recordFiles / requiredFiles) * 100;
  let borderColor = recordFiles != requiredFiles ? "#3289cc" : "#fff";

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
          <span>{data?.customer.customer_name}</span>
        </div>
        <div className="SummaryCard-content-item">
          <span>Tipo de cliente : </span>
          <span>{getLabelName(data?.customer.customer_type)}</span>
        </div>
        <div className="SummaryCard-content-item">
          <span>Cédula : </span>
          <span>{data?.customer.identification_number}</span>
        </div>
        <div className="SummaryCard-content-item">
          <span>Teléfono : </span>
          <span>{data?.customer.phone_number}</span>
        </div>
        <div className="SummaryCard-content-item">
          <span>Correo electrónico: </span>
          <span>{data?.customer.email_address}</span>
        </div>
        <div className="SummaryCard-content-item">
          <span>
            {data?.customer.customer_type == "PHYSICAL_PERSON"
              ? "Nacionalidad"
              : "País de origen"}
          </span>
          <span>
            {
              countries.filter(
                (item) => item.id == data?.customer.nationality
              )[0]?.name
            }
          </span>
        </div>
        <div className="SummaryCard-content-item">
          <span>Fecha creación : </span>
          <span>{new Date(data?.created_at).toLocaleString("do-Es")}</span>
        </div>
      </div>
      {/* <div className="SummaryCard-img">
        <div></div>
        <ul>
          {fileTypes.map((ft, index) => {
            const isUploaded = data.beneficiaries.record_files?.filter(
              (f) => f.file_type_id === ft.file_type_id
            ).length;

            console.log("IS UPLOAODED", data);

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
      </div> */}
      <div className="SummaryCard-img chart">
        <PieChart data={chartData} />
      </div>
    </div>
  );
}

export { SummaryCard };
