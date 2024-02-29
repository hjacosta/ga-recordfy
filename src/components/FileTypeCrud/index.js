import React from "react";
import {
  getFileTypeApi,
  createFileTypeApi,
  updateFileTypeApi,
} from "../../api/fileType";
import { SearchBar } from "../SearchBar";
import { CustomDatatable } from "../CustomDatatable";
import { AuthContext } from "../../contexts/AuthContext";
import { errorHandler } from "../../utils/errorhandler";
import { useNavigate } from "react-router-dom";
import { AccordionForm } from "../AccordionForm";
import { useFormik } from "formik";
import { DTOptionsMenu } from "../DTOptionsMenu";
import * as Yup from "yup";
import { InputMask } from "@react-input/mask";
import { snakeToCamel } from "../../utils/stringFunctions";
import { isEqual } from "lodash";
import "./index.css";

function FileTypeCrud() {
  const { logout } = React.useContext(AuthContext);
  const [fileType, setFileType] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [toggleReq, setToggleReq] = React.useState(false);
  const [formVisible, setFormVisible] = React.useState(false);
  const [preDataUpdate, setPreDataUpdate] = React.useState({});
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

  const generalColumns = [
    {
      name: "Creado por",
      selector: (row) => row.created_by,
      reorder: true,
    },
    {
      name: "Creado en",
      selector: (row) => new Date(row.created_at).toLocaleString("do-ES"),
      reorder: true,
    },
    {
      name: "Modificado por",
      selector: (row) => row.last_modified_by,
      reorder: true,
    },
    {
      name: "Modificado en",
      selector: (row) => new Date(row.last_modified_at).toLocaleString("do-ES"),
      reorder: true,
    },
    {
      name: "Opciones",
      selector: (row) => (
        <DTOptionsMenu
          row={row}
          setCurrentItem={setPreDataUpdate}
          setFormVisible={setFormVisible}
        />
      ),
      reorder: false,
    },
  ];

  const fileTypeColumns = [
    {
      name: "Tipo de archivo",
      width: "200px",
      selector: (row) => row.name,
      reorder: true,
    },
    {
      name: "Prefijo",
      selector: (row) => row.prefix,
      reorder: true,
    },
    ...generalColumns,
  ];

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setFileType([]);
        const fileType = await getFileTypeApi({
          queryParams: searchParams,
        });

        if (fileType.error === true) {
          throw new Error(fileType.body);
        }

        setFileType(fileType.body);
      } catch (error) {
        if (error.message.includes("jwt")) {
          logout();
          navigate("/");
        }
      }
      setIsLoading(false);
    })();
  }, [toggleReq, searchParams]);

  React.useEffect(() => {
    (() => {
      if (formVisible == false) {
        setPreDataUpdate({});
      }
    })();
  }, [formVisible]);

  return (
    <>
      <SearchBar
        addFormVisible={formVisible}
        addButton={{
          label: "Añadir tipo archivo",
          onClick: () => {
            setPreDataUpdate({});
            setFormVisible(!formVisible);
          },
        }}
        searchButton={{
          onClick: () => {
            setToggleReq(!toggleReq);
          },
        }}
        searchItems={searchItems}
        setSearchItems={setSearchItems}
        setSearchParams={setSearchParams}
        mainFilter="name"
        placeholder={"Buscar por descripción..."}
      />
      <AccordionForm
        isVisible={formVisible}
        form={
          <FileTypeForm
            setIsLoading={setIsLoading}
            setToggleReq={setToggleReq}
            preDataUpdate={preDataUpdate}
            setPreDataUpdate={setPreDataUpdate}
          />
        }
      />
      <CustomDatatable
        columns={fileTypeColumns}
        data={fileType}
        isLoading={isLoading}
      />
    </>
  );
}

function FileTypeForm({
  setIsLoading,
  setToggleReq,
  preDataUpdate,
  setPreDataUpdate,
}) {
  const { auth, logout } = React.useContext(AuthContext);
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = React.useState(false);
  const [lastFormValue, setLastFormValue] = React.useState({});
  const navigate = useNavigate();

  const fileTypeForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      prefix: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Campo requerido"),
      prefix: Yup.string().required("Campo requerido"),
    }),
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      let data = {
        ...values,
        createdBy: auth.userProfile.email,
        lastModifiedBy: auth.userProfile.email,
      };

      try {
        setIsLoading(true);
        if (Object.entries(preDataUpdate).length > 0) {
          await updateFileTypeApi(data, preDataUpdate.file_type_id);
        } else {
          await createFileTypeApi(data);
        }
        setToggleReq((state) => !state);
      } catch (error) {
        if (error.message.includes("jwt")) {
          logout();
          navigate("/");
        }
        console.log(error);
      }

      setIsLoading(false);

      resetForm();
    },
  });

  React.useEffect(() => {
    (() => {
      if (Object.entries(preDataUpdate).length > 0) {
        fileTypeForm.setFieldValue("name", preDataUpdate.name);
        fileTypeForm.setFieldValue("prefix", preDataUpdate.prefix);
        let arr = Object.entries(preDataUpdate).map((item) => {
          let key = snakeToCamel(item[0]);

          return {
            [key]: item[1],
          };
        });

        let obj = {};
        let keys = Object.keys(fileTypeForm.initialValues);
        arr.sort().forEach((item, index) => {
          let [key, value] = Object.entries(item)[0];
          if (keys.filter((item) => item == key).length > 0) {
            obj[key] = key.toLowerCase().includes("date")
              ? value.split("T")[0]
              : value;
          }
        });

        setLastFormValue(obj);
        setIsSaveBtnDisabled(true);
      } else {
        fileTypeForm.resetForm();
      }
    })();
  }, [preDataUpdate]);

  React.useEffect(() => {
    (() => {
      if (isEqual(lastFormValue, fileTypeForm.values)) {
        setIsSaveBtnDisabled(true);
      } else {
        setIsSaveBtnDisabled(false);
      }
    })();
  }, [fileTypeForm.values]);

  let userFields = [
    {
      label: "Tipo de archivo (Cedula, pasaporte, etc...)",
      placeholder: "Ej. Cedula",
      field: "name",
      type: "input",
    },
    {
      label: "Prefijo (Ej. CED-nombre-archivo)",
      placeholder: "Ej. CED",
      field: "prefix",
      type: "input",
    },
  ];

  return (
    <>
      <span
        style={{
          fontWeight: "500",
          fontSize: 14,
          padding: "4px 16px",
          color: "var(--dark-blue)",
          borderRadius: 4,
        }}
      >
        Nuevo tipo de archivo
      </span>
      <div className="search-bar">
        {userFields.map((item, index) => (
          <div key={index} className="search-bar-group">
            <label>{item.label}</label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                className="search-bar-input"
                placeholder={item.placeholder}
                value={fileTypeForm.values[item.field]}
                onChange={(e) =>
                  fileTypeForm.setFieldValue(item.field, e.target.value)
                }
              />
              <span
                style={{
                  position: "absolute",
                  marginTop: 28,
                  marginLeft: 4,
                  fontSize: 10,
                  color: "red",
                }}
              >
                {fileTypeForm.errors[item.field]}
              </span>
            </div>
          </div>
        ))}
        <div className="FileTypeForm-footer">
          <button
            type="button"
            className={`${isSaveBtnDisabled ? "disabled" : "selected"} `}
            disabled={isSaveBtnDisabled}
            onClick={fileTypeForm.handleSubmit}
          >
            Guardar
          </button>
          {isSaveBtnDisabled && (
            <button
              type="button"
              className={"discard"}
              onClick={() => {
                fileTypeForm.setFieldValue("name", "");
                fileTypeForm.setFieldValue("prefix", "");
                setIsSaveBtnDisabled(false);
                setPreDataUpdate({});
              }}
            >
              Descartar
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export { FileTypeCrud };
