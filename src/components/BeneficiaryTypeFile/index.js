import React from "react";
import { getCustomerTypeApi, createCustomerTypeApi } from "../../api/customer";
import { SearchBar } from "../SearchBar";
import { CustomDatatable } from "../CustomDatatable";
import { AuthContext } from "../../contexts/AuthContext";
import { errorHandler } from "../../utils/errorhandler";
import { useNavigate } from "react-router-dom";
import { AccordionForm } from "../AccordionForm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaArrowRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { getFileTypeApi } from "../../api/fileType";
import "./index.css";
import {
  createBeneficiaryTypeFileApi,
  getBeneficiaryTypeFileApi,
  removeBeneficiaryTypeFileApi,
} from "../../api/beneficiaryTypeFile";
import { ConfirmModal } from "../ConfirmModal";
import { ErrorModal } from "../ErrorModal";

function BeneficiaryTypeFile() {
  const generalColumns = [
    {
      name: "Opciones",
      //selector: (row) => row.modified_at,
      reorder: false,
    },
  ];

  const customerTypeColumns = [
    {
      name: "Descripción",
      selector: (row) => row.name,
      reorder: true,
    },
    ...generalColumns,
  ];

  const [fileTypes, setFileTypes] = React.useState([]);
  const [beneficiaryTypeFile, setBeneficiaryTypeFile] = React.useState([]);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = React.useState([]);
  const [customerType, setCustomerType] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [toggleReq, setToggleReq] = React.useState(false);
  const [formVisible, setFormVisible] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [toDeleteItem, setToDeleteItem] = React.useState({});
  const [isError, setIsError] = React.useState(false);
  const [errorBody, setErrorBody] = React.useState({});
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = React.useState({});
  const [searchItems, setSearchItems] = React.useState([
    {
      label: "Creado por",
      name: "createdBy",
      type: "text",
      active: false,
    },
    {
      label: "Moficado por",
      name: "modifiedBy",
      type: "text",
      active: false,
    },
  ]);

  const [beneficiaryType, setBeneficiaryType] =
    React.useState("PHYSICAL_PERSON");

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const fTypes = await await getFileTypeApi({});
        const bTypeFile = await getBeneficiaryTypeFileApi({});
        setFileTypes(fTypes.body);
        setBeneficiaryTypeFile(bTypeFile.body);
        // setCustomerType([]);
        // const customerType = await getCustomerTypeApi({
        //   queryParams: searchParams,
        // });

        // if (customerType.error === true) {
        //   throw new Error(customerType.body);
        // }

        // setCustomerType(customerType.body);
      } catch (error) {
        // if (error.message.includes("jwt")) {
        //   logout();
        //   navigate("/");
        // }
      }
      setIsLoading(false);
    })();
  }, [toggleReq, searchParams]);

  const addFileType = (item) => {
    let arr = [...beneficiaryTypeFile, ...selectedBeneficiaries];
    const currentFile = arr.filter(
      (ft) =>
        (ft.name == item.name && ft.beneficiary_type == beneficiaryType) ||
        (ft.file_type?.name == item.name &&
          ft.beneficiary_type == beneficiaryType)
    );

    if (currentFile.length > 0 == false) {
      setSelectedBeneficiaries([
        ...selectedBeneficiaries,
        {
          name: item.name,
          file_type_id: item.file_type_id,
          beneficiary_type: beneficiaryType,
          status_type: "CREATED",
        },
      ]);
    }
  };

  const removeFileType = async (id) => {
    let targetItem = beneficiaryTypeFile.filter(
      (item) =>
        item.beneficiary_type == beneficiaryType && item.file_type_id == id
    )[0];

    let res = await removeBeneficiaryTypeFileApi(targetItem);
    if (res.error == true) {
      setErrorBody(JSON.parse(res.body));
      setIsError(true);
    } else {
      setToggleReq(!toggleReq);
    }
  };

  const undoSelect = (ft) => {
    setSelectedBeneficiaries(
      selectedBeneficiaries.filter(
        (item) => item.file_type_id != ft.file_type_id
      )
    );
  };

  const saveForm = async () => {
    try {
      let res = await createBeneficiaryTypeFileApi({
        bTypeFiles: selectedBeneficiaries,
      });
      setSelectedBeneficiaries([]);
      if (res.error) {
        throw new Error(res.error);
      }

      setToggleReq(!toggleReq);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="BeneficiaryTypeFile-wrapper">
        <div className="BeneficiaryTypeFile-section left">
          <ul>
            {fileTypes.map((item) => (
              <li
                onClick={() => {
                  addFileType(item);
                }}
              >
                <p>{item.name}</p>
                <FaArrowRight
                  title="Añadir"
                  size={14}
                  color=""
                  style={{ cursor: "pointer" }}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="BeneficiaryTypeFile-section right">
          <select
            value={beneficiaryType}
            onChange={(e) => {
              setBeneficiaryType(e.target.value);
            }}
          >
            <option value="PHYSICAL_PERSON"> Persona Física</option>
            <option value="PHYSICAL_PERSON_PEP">Persona Física (Pep)</option>
            {/* <option value="PHYSICAL_PERSON_POLITICIAN">
              Persona Física (Político)
            </option>
            <option value="PHYSICAL_PERSON_POLITICIAN_RELATIVE">
              Persona Física (Familiar hasta 3er grado de un político)
            </option> */}
            <option value="LEGAL_PERSON">Persona Jurídica</option>
            {/* <option value="LEGAL_PERSON_PEP">Persona Jurídica (Pep)</option>
            <option value="LEGAL_PERSON_POLITICIAN">
              {" "}
              Persona Jurídica (político)
            </option>
            <option value="LEGAL_PERSON_POLITICIAN_RELATIVE">
              Persona Jurídica (Familiar hasta 3er grado de un político)
            </option> */}
          </select>
          <div className="BeneficiaryTypeFile-section-list">
            <ul>
              {[...beneficiaryTypeFile]
                .filter((ft) => ft.beneficiary_type == beneficiaryType)
                .map((ft, index) => (
                  <li key={index}>
                    <p>{ft.name || ft.file_type?.name}</p>
                    <IoClose
                      onClick={() => {
                        setToDeleteItem(ft);
                        setIsConfirmOpen(true);
                      }}
                      title="Eliminar"
                      size={14}
                      color=""
                      style={{ cursor: "pointer" }}
                    />
                  </li>
                ))}

              {[...selectedBeneficiaries]
                .filter((ft) => ft.beneficiary_type == beneficiaryType)
                .map((ft, index) => (
                  <li
                    key={index}
                    className="selected"
                    onClick={() => undoSelect(ft)}
                  >
                    <p>{ft.name || ft.file_type?.name}</p>
                    <IoClose
                      title="Eliminar"
                      size={14}
                      color=""
                      style={{ cursor: "pointer" }}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="BeneficiaryTypeFile-footer">
        <button onClick={async () => await saveForm()}>Guardar</button>
      </div>
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        modalType={"DELETE"}
        confirmFunction={async () =>
          await removeFileType(toDeleteItem.file_type_id)
        }
      />
      <ErrorModal
        isOpen={isError}
        setIsOpen={setIsError}
        errorBody={
          <>
            {
              <div style={{ fontSize: 16 }}>
                <p>{errorBody.msg}</p>
                <ul
                  style={{
                    listStyle: "none",
                    marginLeft: 0,
                    paddingLeft: 0,
                    maxHeight: 100,
                    overflowY: "auto",
                  }}
                >
                  {errorBody?.detail?.map((item) => (
                    <li style={{ fontSize: 14 }}>
                      - &nbsp;
                      <a
                        style={{ textDecoration: "none" }}
                        href={`/records/${item.beneficiary.record_id}#${item.record_file_id}`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            }
          </>
        }
        onClose={() => {
          setErrorBody({});
        }}
      />
    </>
  );
}

export { BeneficiaryTypeFile };
