import React from "react";
import { getFileTypeApi, createFileTypeApi } from "../../api/fileType";
import { SearchBar } from "../SearchBar";
import { CustomDatatable } from "../CustomDatatable";
import { AuthContext } from "../../contexts/AuthContext";
import { errorHandler } from "../../utils/errorhandler";
import { useNavigate } from "react-router-dom";
import { AccordionForm } from "../AccordionForm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputMask } from "@react-input/mask";

function FileTypeCrud() {
  const generalColumns = [
    {
      name: "Creado por",
      selector: (row) => row.created_by,
      reorder: true,
    },
    {
      name: "Creado",
      selector: (row) => row.created_at,
      reorder: true,
    },
    {
      name: "Modificado por",
      selector: (row) => row.modified_by,
      reorder: true,
    },
    {
      name: "Creado por",
      selector: (row) => row.modified_at,
      reorder: true,
    },
    {
      name: "Opciones",
      //selector: (row) => row.modified_at,
      reorder: false,
    },
  ];

  const fileTypeColumns = [
    {
      name: "Descripción",
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

  const [fileType, setFileType] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [toggleReq, setToggleReq] = React.useState(false);
  const [formVisible, setFormVisible] = React.useState(false);
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

  return (
    <>
      <SearchBar
        addFormVisible={formVisible}
        addButton={{
          label: "Añadir tipo archivo",
          onClick: () => {
            setFormVisible(!formVisible);
          },
        }}
        searchButton={{
          onClick: () => {
            console.log("hi");
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

function FileTypeForm({ setIsLoading, setToggleReq }) {
  const { auth, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const fileTypeForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      prefix: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Campo requerido"),
    }),
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      let data = {
        ...values,
        createdBy: auth.userProfile.email,
        modifiedBy: auth.userProfile.email,
      };

      try {
        setIsLoading(true);

        await createFileTypeApi(data);
        setToggleReq((state) => !state);
        console.log(data);
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

  let userFields = [
    {
      label: "Descripcion",
      field: "name",
      type: "input",
    },
    {
      label: "Prefijo",
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
                placeholder={item.label}
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
        <div className="search-bar-group">
          <button
            type="button"
            className="search-bar-input"
            onClick={fileTypeForm.handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}

export { FileTypeCrud };
