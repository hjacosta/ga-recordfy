import React from "react";
import {
  createCustomerApi,
  getCustomerTypeApi,
  getCustomersApi,
} from "../../api/customer";
import { SearchBar } from "../SearchBar";
import { CustomDatatable } from "../CustomDatatable";
import { AuthContext } from "../../contexts/AuthContext";
import { errorHandler } from "../../utils/errorhandler";
import { useNavigate } from "react-router-dom";
import { AccordionForm } from "../AccordionForm";
import { useFormik } from "formik";
import * as Yup from "yup";

function CustomerCrud() {
  const [customers, setCustomers] = React.useState([]);
  const [formVisible, setFormVisible] = React.useState(false);
  const [toggleReq, setToggleReq] = React.useState(false);
  const [preDataUpdate, setPreDataUpdate] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = React.useState({});
  const [searchItems, setSearchItems] = React.useState([
    {
      label: "Apellido",
      name: "lastName",
      type: "text",
      active: false,
    },
    {
      label: "Cédula",
      name: "identificationNumber",
      type: "text",
      active: false,
    },
    {
      label: "Teléfono",
      name: "phoneNumber",
      type: "text",
      active: false,
    },
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
        setCustomers([]);
        const customers = await getCustomersApi({ queryParams: searchParams });

        if (customers.error === true) {
          throw new Error(customers.body);
        }

        setCustomers(customers.body);
      } catch (error) {
        if (error.message.includes("jwt")) {
          logout();
          navigate("/");
        }
      }
      setIsLoading(false);
    })();
  }, [toggleReq, searchParams]);

  const generalColumns = [
    {
      name: "Creado por",
      selector: (row) => row.created_by,
      sortable: true,
    },
    {
      name: "Creado",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Modificado por",
      selector: (row) => row.modified_by,
      sortable: true,
    },
    {
      name: "Creado por",
      selector: (row) => row.modified_at,
      sortable: true,
    },
  ];
  const customersColumns = [
    {
      name: "Nombre(s)",
      selector: (row) => row.first_name,
      sortable: true,
      reorder: true,
    },
    {
      name: "Apellido(s)",
      selector: (row) => row.last_name,
      sortable: true,
      reorder: true,
    },
    {
      name: "Cédula",
      selector: (row) => row.identification_number,
      sortable: true,
      reorder: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.phone_number,
      sortable: true,
      reorder: true,
    },
    {
      name: "Tipo Cliente",
      selector: (row) => row.customer_type_id,
      sortable: true,
      reorder: true,
    },
    ...generalColumns,
  ];

  return (
    <>
      <SearchBar
        addFormVisible={formVisible}
        addButton={{
          label: "Añadir un cliente",
          onClick: () => {
            setFormVisible(!formVisible);
            setPreDataUpdate(!preDataUpdate);
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
        mainFilter="firstName"
        placeholder={"Buscar por nombre ..."}
      />
      <AccordionForm
        isVisible={formVisible}
        form={
          <CustomerForm
            setIsLoading={setIsLoading}
            setToggleReq={setToggleReq}
            preDataUpdate={preDataUpdate}
          />
        }
      />
      <CustomDatatable
        columns={customersColumns}
        data={customers}
        isLoading={isLoading}
      />
    </>
  );
}

function CustomerForm({ setIsLoading, setToggleReq, preDataUpdate }) {
  const { auth, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [customerTypes, setCustomerTypes] = React.useState([]);

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      identificationNumber: "",
      phoneNumber: "",
      customerTypeId: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Campo requerido"),
      lastName: Yup.string().required("Campo requerido"),
      identificationNumber: Yup.string().required("Campo requerido"),
      phoneNumber: Yup.string().required("Campo requerido"),
      customerTypeId: Yup.string().required("Campo requerido"),
    }),
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      let data = {
        ...values,
        createdBy: auth.userProfile.email,
        modifiedBy: auth.userProfile.email,
      };

      form.setFieldValue("customerTypeId", "");
      try {
        setIsLoading(true);

        await createCustomerApi(data);
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
      console.log("hi");
      resetForm();
    },
  });

  React.useEffect(() => {
    (async () => {
      console.log("hi");
      try {
        const customerTypes = await getCustomerTypeApi({});

        setCustomerTypes(customerTypes.body);
      } catch (error) {
        if (error.message.includes("jwt")) {
          logout();
          navigate("/");
        }

        console.log(error);
      }
    })();
  }, [preDataUpdate]);

  let userFields = [
    {
      label: "Nombre",
      field: "firstName",
      type: "input",
    },
    {
      label: "Apellido",
      field: "lastName",
      type: "input",
    },
    {
      label: "Cédula",
      field: "identificationNumber",
      type: "input",
    },
    {
      label: "Teléfono",
      field: "phoneNumber",
      type: "input",
    },
    {
      label: "Tipo de cliente",
      field: "customerTypeId",
      type: "select",
    },
  ];

  return (
    <>
      <span
        style={{
          fontWeight: "500",
          fontSize: 14,
          padding: "4px 16px",
          // backgroundColor: "var(--dark-blue)",
          color: "var(--dark-blue)",
          // border: "1px solid grey",
          borderRadius: 4,
        }}
      >
        Nuevo cliente
      </span>
      <div className="search-bar">
        {userFields.map((item) => (
          <div className="search-bar-group">
            <label>{item.label}</label>
            {item.type == "input" ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  className="search-bar-input"
                  placeholder={item.label}
                  value={form.values[item.field]}
                  onChange={(e) =>
                    form.setFieldValue(item.field, e.target.value)
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
                  {form.errors[item.field]}
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <select
                  value={form.values[item.field]}
                  onChange={(e) =>
                    form.setFieldValue(item.field, e.target.value)
                  }
                  className="search-bar-input"
                >
                  <option value="">Seleccione un tipo de cliente</option>
                  {customerTypes.map((opt) => (
                    <option value={opt.customer_type_id}>{opt.name}</option>
                  ))}
                </select>
                <span
                  style={{
                    position: "absolute",
                    marginTop: 28,
                    marginLeft: 4,
                    fontSize: 10,
                    color: "red",
                  }}
                >
                  {form.errors[item.field]}
                </span>
              </div>
            )}
          </div>
        ))}
        <div className="search-bar-group">
          <button className="search-bar-input" onClick={form.handleSubmit}>
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}

export { CustomerCrud };
