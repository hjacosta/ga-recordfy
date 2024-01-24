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

function CustomerTypeCrud() {
  const generalColumns = [
    {
      name: "Creado por",
      selector: (row) => row.created_by,
      reorder: true,
    },
    {
      name: "Creado",
      selector: (row) => new Date(row.created_at).toLocaleString("es-ES"),
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

  const customerTypeColumns = [
    {
      name: "Descripción",
      selector: (row) => row.name,
      reorder: true,
    },
    ...generalColumns,
  ];

  const [customerType, setCustomerType] = React.useState([]);
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
        setCustomerType([]);
        const customerType = await getCustomerTypeApi({
          queryParams: searchParams,
        });

        if (customerType.error === true) {
          throw new Error(customerType.body);
        }

        setCustomerType(customerType.body);
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
          label: "Añadir tipo cliente",
          onClick: () => {
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
          <CustomerTypeForm
            setIsLoading={setIsLoading}
            setToggleReq={setToggleReq}
          />
        }
      />
      <CustomDatatable
        columns={customerTypeColumns}
        data={customerType}
        isLoading={isLoading}
      />
    </>
  );
}

function CustomerTypeForm({ setIsLoading, setToggleReq }) {
  const { auth, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const customerTypeForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
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

        await createCustomerTypeApi(data);
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

  let userFields = [
    {
      label: "Descripcion",
      field: "name",
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
        Nuevo cliente
      </span>
      <div className="search-bar">
        {userFields.map((item, index) => (
          <div key={index} className="search-bar-group">
            <label>{item.label}</label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                className="search-bar-input"
                placeholder={item.label}
                value={customerTypeForm.values[item.field]}
                onChange={(e) =>
                  customerTypeForm.setFieldValue(item.field, e.target.value)
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
                {customerTypeForm.errors[item.field]}
              </span>
            </div>
          </div>
        ))}
        <div className="search-bar-group">
          <button
            type="button"
            className="search-bar-input"
            onClick={customerTypeForm.handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}

export { CustomerTypeCrud };
