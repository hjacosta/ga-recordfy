import React from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { PieChart } from "../PieChar";
import getLabelName from "../../utils/appLabels";
import { getCountries } from "../../utils/preData/countries";
import { groupBy as lodashGroupBy } from "lodash";
import { BarChart } from "../BarChart";
import "./index.css";

function SummaryCard({ data, fileTypes }) {
  const [countries, setCountries] = React.useState([]);

  const getCurrentRecordFiles = (arr, byCategory) => {
    let result = [];
    let groupedObj = lodashGroupBy(arr, "file_type.name");
    //console.log(groupedObj);
    for (let i of Object.entries(groupedObj)) {
      result.push(i[1][0]);
    }

    //console.log(result);
    if (byCategory == true) {
      return groupedObj;
    } else {
      return result;
    }
  };

  React.useEffect(() => {
    (async () => {
      let res = await getCountries();
      setCountries(res);
    })();
  }, []);
  let requiredFiles = data.beneficiaries.reduce(
    (acc, item) => acc + item.required_files.length,
    0
  );

  let recordFiles = data.beneficiaries.reduce(
    (acc, item) => acc + getCurrentRecordFiles(item.record_files).length,
    0
  );

  // console.log(data.beneficiaries[1].record_files);

  let completedPct = recordFiles; //(recordFiles / requiredFiles) * 100;
  let borderColor = recordFiles != requiredFiles ? "#3289cc" : "#fff";

  let chartData = {
    labels: ["Restantes", "Subidos"],
    datasets: [
      {
        // label: "archivos",
        data: [
          completedPct == 0 ? 0.1 : requiredFiles - completedPct,
          completedPct,
        ],
        backgroundColor: ["transparent", "#99bee2"],
        borderColor: [borderColor],
        borderWidth: 0.5,
      },
    ],
  };

  let uploadedFiles = [];

  fileTypes
    .map((item) => item.name)
    .map((item, index) => {
      let itemCounter = 0;
      let foundFiles = getCurrentRecordFiles(
        data.beneficiaries[index]?.record_files,
        true
      );
      data.beneficiaries.map((b) => {
        //console.log(b.name, item, getCurrentRecordFiles(b?.record_files, true));
        Object.keys(getCurrentRecordFiles(b?.record_files, true)).map((key) => {
          if (key == item) {
            itemCounter += 1;
          }
        });
      });

      uploadedFiles.push(itemCounter);
    });

  let missingFiles = [];

  fileTypes
    .map((item) => item.name)
    .map((item, index) => {
      let itemCounter = 0;
      let foundFiles = getCurrentRecordFiles(
        data.beneficiaries[index]?.missing_files,
        true
      );
      data.beneficiaries.map((b) => {
        //console.log(b.name, item, getCurrentRecordFiles(b?.record_files, true));
        Object.keys(getCurrentRecordFiles(b?.missing_files, true)).map(
          (key) => {
            if (key == item) {
              itemCounter += 1;
            }
          }
        );
      });

      missingFiles.push(itemCounter);
    });

  // console.log(data.beneficiaries[0].required_files);

  let barChartData = {
    labels: [...fileTypes.map((item) => item.name)],
    datasets: [
      {
        label: "Subidos",
        data: uploadedFiles,
        backgroundColor: "#99bee2",
      },
      {
        label: "Restantes",
        data: missingFiles,
        backgroundColor: "rgba(0,0,0,0.05)",
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
      <div className="SummaryCard-img bar-chart">
        <BarChart data={barChartData} />
      </div>
    </div>
  );
}

export { SummaryCard };
