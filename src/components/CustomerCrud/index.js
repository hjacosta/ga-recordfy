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
import { InputMask } from "@react-input/mask";
import { CustomModal } from "../CustomModal";
import { countries } from "../../utils/preData";
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
    // {
    //   label: "Apellido",
    //   name: "lastName",
    //   type: "text",
    //   active: false,
    // },
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
      name: "Creado en",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
    {
      name: "Modificado por",
      selector: (row) => row.modified_by,
      sortable: true,
    },
    {
      name: "Modificado en",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
  ];
  const customersColumns = [
    {
      name: "Nombre / Rezón Social",
      selector: (row) => row.customer_name,
      sortable: true,
      reorder: true,
    },
    // {
    //   name: "Apellido(s)",
    //   selector: (row) => row.last_name,
    //   sortable: true,
    //   reorder: true,
    // },
    {
      name: "No. de Identificación",
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
      selector: (row) => row.name,
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
        mainLabel="Nombre / Razón social"
        searchItems={searchItems}
        setSearchItems={setSearchItems}
        setSearchParams={setSearchParams}
        mainFilter="firstName"
        placeholder={"Buscar por nombre ..."}
      />
      <CustomerForm
        isFormOpened={formVisible}
        setIsFormOpened={setFormVisible}
        setIsLoading={setIsLoading}
        setToggleReq={setToggleReq}
        preDataUpdate={preDataUpdate}
      />
      <CustomDatatable
        columns={customersColumns}
        data={customers}
        isLoading={isLoading}
      />
    </>
  );
}

function CustomerForm({
  setIsLoading,
  setToggleReq,
  preDataUpdate,
  isFormOpened,
  setIsFormOpened,
}) {
  const { auth, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [customerTypes, setCustomerTypes] = React.useState([]);

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      customerName: "",
      // lastName: "",
      identificationNumber: "",
      identificationType: "rnc",
      nacionality: "Dominican Republic",
      riskLevel: "Seleccione nivel de riesgo",
      phoneNumber: "",
      customerTypeId: "",
    },
    validationSchema: Yup.object({
      customerName: Yup.string().required("Campo requerido"),
      // lastName: Yup.string().required("Campo requerido"),
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
      setIsFormOpened(false);
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
      label: "Nombre / Razon Social",
      field: "customerName",
      type: "input",
    },
    {
      label: "Tipo de identificación",
      field: "identificationType",
      type: "select",
      options: [
        {
          value: "rnc",
          label: "RNC",
        },
        {
          value: "person_id",
          label: "Cédula",
        },
        {
          value: "passport",
          label: "Pasaporte",
        },
      ],
    },
    // {
    //   label: "Apellido",
    //   field: "lastName",
    //   type: "input",
    // },
    {
      label: "Número de Identificación",
      field: "identificationNumber",
      type: "input",
      props: {
        mask: (() => {
          let mask = "";
          switch (form.values.identificationType) {
            case "rnc":
              mask = "___-_____-_";
              break;
            case "person_id":
              mask = "___-_______-_";
              break;
            case "passport":
              mask = "_________";
              break;
            default:
              break;
          }
          return mask;
        })(),
        replacement: { _: /\d/ },
      },
    },
    {
      label: "Teléfono",
      field: "phoneNumber",
      type: "input",
      props: {
        mask: "(___)-___-____",
        replacement: { _: /\d/ },
      },
    },
    {
      label: "Tipo de cliente",
      field: "customerTypeId",
      type: "select",
      options: [
        {
          label: "Tipo de cliente",
          value: "",
        },
        ...customerTypes.map((item) => {
          return {
            label: item.name,
            value: item.customer_type_id,
          };
        }),
      ],
    },
    {
      label: "Nivel de Riesgo",
      field: "riskLevel",
      type: "select",
      options: [
        {
          label: "Seleccione nivel de riesgo",
          value: "",
        },
        {
          label: "Bajo",
          value: "LOW",
        },
        {
          label: "Medio",
          value: "MEDIUM",
        },
        {
          label: "Alto",
          value: "HIGH",
        },
      ],
    },
    {
      label: "Nacionalidad",
      field: "nationality",
      type: "select",
      options: [
        ...countries.sort((a, b) => {
          if (a.firstname < b.firstname) {
            return -1;
          }
          if (a.firstname > b.firstname) {
            return 1;
          }
          return 0;
        }),
      ],
    },
    // {
    //   label: "Tipo de cliente",
    //   field: "customerTypeId",
    //   type: "select",

    // },
  ];

  return (
    <CustomModal open={isFormOpened} setOpen={setIsFormOpened}>
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
        {userFields.map((item, index) => (
          <div key={index} className="search-bar-group">
            <label>{item.label}</label>
            {item.type == "input" ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {item.props && Object.entries(item.props).length > 0 ? (
                  <InputMask
                    {...item.props}
                    className="search-bar-input"
                    value={form.values[item.field]}
                    onChange={(e) =>
                      form.setFieldValue(item.field, e.target.value)
                    }
                  />
                ) : (
                  <input
                    className="search-bar-input"
                    value={form.values[item.field]}
                    onChange={(e) =>
                      form.setFieldValue(item.field, e.target.value)
                    }
                  />
                )}

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
                  onChange={(e) => {
                    form.setFieldValue(item.field, e.target.value);
                    if (item.field == "identificationType") {
                      form.setFieldValue("identificationNumber", "");
                    }
                  }}
                  className="search-bar-input"
                >
                  {item.options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
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
    </CustomModal>
  );
}

export { CustomerCrud };
