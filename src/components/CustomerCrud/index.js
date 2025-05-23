import React from "react";
import {
  createCustomerApi,
  updateCustomerApi,
  getCustomerTypeApi,
  getCustomersApi,
  removeCustomerApi,
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
import { SectionDivision } from "../SectionDivision";
import * as Yup from "yup";
import { getCountries } from "../../utils/preData/countries";
import { getStates } from "../../utils/preData/states";
import { getCities } from "../../utils/preData/cities";
import { FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { DTOptionsMenu } from "../DTOptionsMenu";
import { ConfirmModal } from "../ConfirmModal";
import { isEqual } from "lodash";
import { snakeToCamel } from "../../utils/stringFunctions";
import getLabelName from "../../utils/appLabels";
import "./index.css";
import { ErrorModal } from "../ErrorModal";

function CustomerCrud() {
  const { logout } = React.useContext(AuthContext);
  const [customers, setCustomers] = React.useState([]);
  const [formVisible, setFormVisible] = React.useState(false);
  const [toggleReq, setToggleReq] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [preDataUpdate, setPreDataUpdate] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const [currentItem, setCurrentItem] = React.useState(false);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = React.useState({});

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
      selector: (row) => row.last_modified_by,
      sortable: true,
    },
    {
      name: "Modificado en",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
    {
      name: "Opciones",
      selector: (row) => (
        <DTOptionsMenu
          row={row}
          setCurrentItem={setPreDataUpdate}
          setFormVisible={setFormVisible}
          setConfirmDeletion={setIsConfirmOpen}
        />
      ),
      sortable: true,
    },
  ];
  const customersColumns = [
    {
      name: "Nombre / Razón Social",
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
      selector: (row) => getLabelName(row.customer_type),
      sortable: true,
      reorder: true,
    },
    ...generalColumns,
  ];

  const [searchItems, setSearchItems] = React.useState([
    // {
    //   label: "Apellido",
    //   name: "lastName",
    //   type: "text",
    //   active: false,
    // },
    {
      label: "RNC o Cédula",
      name: "identificationNumber",
      type: "text",
      active: true,
    },
    {
      label: "Tipo de cliente",
      name: "customerType",
      type: "select",
      active: true,
      options: [
        {
          label: "Seleccionar tipo cliente",
          value: "",
        },
        {
          label: "Persona Jurídica",
          value: "LEGAL_PERSON",
        },
        {
          label: "Persona Física",
          value: "PHYSICAL_PERSON",
        },
      ],
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

  return (
    <>
      <SearchBar
        addFormVisible={formVisible}
        addButton={{
          label: "Añadir un cliente",
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
        mainLabel="Nombre / Razón social"
        searchItems={searchItems}
        setSearchItems={setSearchItems}
        setSearchParams={setSearchParams}
        mainFilter="customerName"
        placeholder={"Buscar por nombre ..."}
      />
      <CustomerForm
        isFormOpened={formVisible}
        setIsFormOpened={setFormVisible}
        setIsLoading={setIsLoading}
        setToggleReq={setToggleReq}
        preDataUpdate={preDataUpdate}
        setPreDataUpdate={setPreDataUpdate}
      />
      <CustomDatatable
        columns={customersColumns}
        data={customers}
        isLoading={isLoading}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        modalMessage={
          <p>
            Este cliente y su expediente asociado será irrevesiblemente
            eliminado, ¿Desea continuar?
          </p>
        }
        modalType={"DELETE"}
        confirmFunction={async () => {
          let res = await removeCustomerApi(preDataUpdate.customer_id);
          // if (res.error == true) {
          //   setErrorBody(JSON.parse(res.body));
          //   setIsError(true);
          // }
          setToggleReq(!toggleReq);
        }}
      />
    </>
  );
}

function CustomerForm({
  setIsLoading,
  setToggleReq,
  preDataUpdate,
  setPreDataUpdate,
  isFormOpened,
  setIsFormOpened,
}) {
  const { auth, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [customerTypes, setCustomerTypes] = React.useState([]);
  const [lastFormValue, setLastFormValue] = React.useState({});
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = React.useState(false);
  const [onSaveOpenNew, setOnSaveOpenNew] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  // const [discardConfirmed, setDiscardConfirmed] = React.useState(false);

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      customerName: "",
      customerType: "PHYSICAL_PERSON",
      identificationType: "PERSONAL_ID",
      identificationNumber: "",
      nationality: "138",
      riskLevel: "LOW",
      phoneNumber: "",
      birthDate: "",
      emailAddress: "",
      country: "138",
      state: "387",
      city: "4982",
      street: "",
      residencyNumber: "",
      sector: "",
      incomeSource: "COMMERCIAL_ACTIVITY",
      commercialActivityType: "PRIVATE",
      commercialRegistry: "",
      employeerType: "PRIVATE",
      economicSector: "COMMERCIAL",
      commercialActivityCommentary: "",
      companyType: "PRIVATE",
      companyFundsOrigin: "PRIVATE",
      companyPrivatePct: "",
      companyPublicPct: "",
      isPep: false,
      isPolitician: false,
      isPoliticianRelative: false,
    },
    validationSchema: Yup.object({
      customerName: Yup.string().required("Campo requerido"),
      identificationNumber: Yup.string().required("Campo requerido"),
      nationality: Yup.string().required("Campo requerido"),
      //riskLevel: Yup.string().required("Campo requerido"),
      phoneNumber: Yup.string().required("Campo requerido"),
      customerType: Yup.string().required("Campo requerido"),
      birthDate: Yup.string().required("Campo requerido"),
      country: Yup.string().required("Campo requerido"),
      state: Yup.string().required("Campo requerido"),
      city: Yup.string().required("Campo requerido"),
      incomeSource: Yup.string().required("Campo requerido"),
      //commercialActivityType: Yup.string().required("Campo requerido"),
      //employeerType: Yup.string().required("Campo requerido"),
      economicSector: Yup.string().required("Campo requerido"),
      companyType: Yup.string().required("Campo requerido"),
      companyFundsOrigin: Yup.string().required("Campo requerido"),
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
          await updateCustomerApi(data, preDataUpdate.customer_id);
        } else {
          await createCustomerApi(data);
        }
        setToggleReq((state) => !state);

        if (onSaveOpenNew == false) {
          setIsFormOpened(false);
        }
        resetForm();
      } catch (error) {
        if (error.message.includes("jwt")) {
          logout();
          navigate("/");
        }
        console.log("$$$", error.message);
        setError(error.message);
      }

      setIsLoading(false);
    },
  });

  React.useEffect(() => {
    (() => {
      if (Object.entries(preDataUpdate).length > 0) {
        form.setFieldValue("customerName", preDataUpdate.customer_name);
        form.setFieldValue(
          "identificationType",
          preDataUpdate.identification_type
        );
        form.setFieldValue(
          "identificationNumber",
          preDataUpdate.identification_number
        );
        form.setFieldValue("nationality", preDataUpdate.nationality);
        form.setFieldValue("riskLevel", preDataUpdate.risk_level);
        form.setFieldValue("phoneNumber", preDataUpdate.phone_number);
        form.setFieldValue("customerType", preDataUpdate.customer_type);
        form.setFieldValue(
          "birthDate",
          preDataUpdate.birth_date?.split("T")[0]
        );
        form.setFieldValue("emailAddress", preDataUpdate.email_address);
        form.setFieldValue("country", preDataUpdate.country);
        form.setFieldValue("state", preDataUpdate.state);
        form.setFieldValue("city", preDataUpdate.city);
        form.setFieldValue("street", preDataUpdate.street);
        form.setFieldValue("residencyNumber", preDataUpdate.residency_number);
        form.setFieldValue("sector", preDataUpdate.sector);
        form.setFieldValue("incomeSource", preDataUpdate.income_source);
        form.setFieldValue(
          "commercialActivityType",
          preDataUpdate.commercial_activity_type
        );
        form.setFieldValue(
          "commercialRegistry",
          preDataUpdate.commercial_registry
        );
        form.setFieldValue("employeerType", preDataUpdate.employeer_type);
        form.setFieldValue("economicSector", preDataUpdate.economic_sector);
        form.setFieldValue(
          "commercialActivityCommentary",
          preDataUpdate.commercial_activity_commentary
        );
        form.setFieldValue("companyType", preDataUpdate.company_type);
        form.setFieldValue(
          "companyFundsOrigin",
          preDataUpdate.company_funds_origin
        );
        form.setFieldValue(
          "companyPrivatePct",
          preDataUpdate.company_private_pct
        );
        form.setFieldValue(
          "companyPublicPct",
          preDataUpdate.company_public_pct
        );
        form.setFieldValue("isPep", preDataUpdate.is_pep);
        form.setFieldValue("isPolitician", preDataUpdate.is_politician);
        form.setFieldValue(
          "isPoliticianRelative",
          preDataUpdate.is_politician_relative
        );

        let arr = Object.entries(preDataUpdate).map((item) => {
          let key = snakeToCamel(item[0]);

          return {
            [key]: item[1],
          };
        });

        let obj = {};
        let keys = Object.keys(form.initialValues);
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
      }
    })();
  }, [preDataUpdate]);

  React.useEffect(() => {
    (() => {
      if (isEqual(lastFormValue, form.values)) {
        setIsSaveBtnDisabled(true);
      } else {
        setIsSaveBtnDisabled(false);
      }
    })();
  }, [form.values]);

  React.useEffect(() => {
    (async () => {
      let res = await getCountries();
      setCountries(res);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      let res = await getStates(form.values.country);
      setStates(res);
    })();
  }, [form.values.country]);

  React.useEffect(() => {
    (async () => {
      let res = await getCities(form.values.state);

      setCities(res);
    })();
  }, [form.values.state]);

  const [identificationMask, setIdentificationMask] =
    React.useState("___-_______-_");

  const handleClose = (discardConfirmed) => {
    if (discardConfirmed === true) {
      setIsFormOpened(false);
      setPreDataUpdate({});
      form.resetForm();
    } else {
      setIsConfirmOpen(true);
    }
  };

  return (
    <>
      <CustomModal
        open={isFormOpened}
        setOpen={setIsFormOpened}
        onClose={handleClose}
      >
        <span
          style={{
            fontWeight: "500",
            fontSize: 14,
            padding: "4px 0",
            // backgroundColor: "var(--dark-blue)",
            color: "var(--dark-blue)",
            // border: "1px solid grey",
            borderRadius: 4,
          }}
        >
          {Object.entries(preDataUpdate).length > 0 ? "Editar" : "Nuevo"}{" "}
          cliente
        </span>

        <div className="CustomerForm-wrapper">
          <SectionDivision
            title={"Información General"}
            icon={<FaUser color="grey" />}
          />
          <div className="CustomerForm-group">
            <div>
              <span className="required">Tipo de cliente</span>
              <select
                value={form.values.customerType}
                onChange={(e) => {
                  form.resetForm();
                  form.setFieldValue("customerType", e.target.value);
                }}
              >
                <option value="PHYSICAL_PERSON">Persona Física</option>
                <option value="LEGAL_PERSON">Persona Jurídica</option>
              </select>
              <span className="error">{form.errors.customerType}</span>
            </div>
            <div>
              <span className="required">Nombre / Razón Social</span>
              <input
                type="text"
                value={form.values.customerName}
                onChange={(e) =>
                  form.setFieldValue(
                    "customerName",
                    e.target.value.toUpperCase()
                  )
                }
              />
              <span className="error">{form.errors.customerName}</span>
            </div>
          </div>
          <div className="CustomerForm-group">
            <div>
              <span className="required">Tipo de Identificación</span>
              <select
                value={form.values.identificationType}
                onChange={(e) => {
                  form.setFieldValue("identificationType", e.target.value);

                  let mask = "";
                  switch (e.target.value) {
                    case "RNC":
                      mask = "___-_____-_";
                      break;
                    case "PERSONAL_ID":
                      mask = "___-_______-_";
                      break;
                    case "PASSPORT":
                      mask = "_________";
                      break;
                    default:
                      break;
                  }
                  setIdentificationMask(mask);
                  form.setFieldValue("identificationNumber", "");
                }}
              >
                <option value="PERSONAL_ID">Cédula</option>
                <option value="RNC">RNC</option>
                <option value="PASSPORT">Pasaporte</option>
              </select>
              <span className="error">{form.errors.identificationType}</span>
            </div>
            <div>
              <span className="required">Número de Identification</span>
              <InputMask
                showMask={true}
                mask={identificationMask}
                replacement={{ _: /\d/ }}
                type="text"
                value={form.values.identificationNumber}
                onChange={(e) =>
                  form.setFieldValue("identificationNumber", e.target.value)
                }
              />
              <span className="error">{form.errors.identificationNumber}</span>
            </div>
          </div>
          <div className="CustomerForm-group">
            <div>
              <span className="required">Teléfono</span>
              <InputMask
                mask={"(___)-___-____"}
                replacement={{ _: /\d/ }}
                type="text"
                value={form.values.phoneNumber}
                onChange={(e) =>
                  form.setFieldValue("phoneNumber", e.target.value)
                }
              />
              <span className="error">{form.errors.phoneNumber}</span>
            </div>
            <div>
              <span className="required">País de nacionalidad</span>
              <select
                value={form.values.nationality}
                onChange={(e) =>
                  form.setFieldValue("nationality", e.target.value)
                }
              >
                {countries.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="CustomerForm-group">
            <div>
              <span className="required">
                {form.values.customerType === "PHYSICAL_PERSON"
                  ? "Fecha Nacimiento"
                  : "Fecha de constitución"}
              </span>
              <input
                value={form.values.birthDate}
                onChange={(e) =>
                  form.setFieldValue("birthDate", e.target.value)
                }
                type="date"
              />
              <span className="error">{form.errors.birthDate}</span>
            </div>
            <div>
              <span>Correo electrónico</span>
              <input
                value={form.values.emailAddress}
                onChange={(e) =>
                  form.setFieldValue("emailAddress", e.target.value)
                }
              />
            </div>
          </div>
          {form.values.customerType == "LEGAL_PERSON" && (
            <div className="CustomerForm-group">
              <div>
                <span>Registro Mercantil</span>
                <input
                  type="text"
                  value={form.values.commercialRegistry}
                  onChange={(e) =>
                    form.setFieldValue(
                      "commercialRegistry",
                      e.target.value.toUpperCase()
                    )
                  }
                />
              </div>
            </div>
          )}

          <SectionDivision
            title={"Domicilio Legal"}
            icon={<FaMapMarkerAlt color="grey" />}
          />
          <div className="CustomerForm-group">
            <div>
              <span>Pais</span>
              <select
                value={form.values.country}
                onChange={(e) => form.setFieldValue("country", e.target.value)}
              >
                {countries.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="CustomerForm-group">
            <div>
              <span>Estado / Provincia</span>
              <select
                value={form.values.state}
                placeholder="C/ Leopoldo Navarro"
                onChange={(e) => form.setFieldValue("state", e.target.value)}
              >
                {states.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="CustomerForm-group">
            <div>
              <span>Ciudad</span>
              <select
                value={form.values.city}
                placeholder="C/ Leopoldo Navarro"
                onChange={(e) => form.setFieldValue("city", e.target.value)}
              >
                {cities.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="CustomerForm-group">
            <div>
              <span>Calle</span>
              <input
                value={form.values.street}
                placeholder="C/ Leopoldo Navarro"
                onChange={(e) => form.setFieldValue("street", e.target.value)}
              />
            </div>
          </div>
          <div className="CustomerForm-group">
            <div>
              <span>Número</span>
              <input
                value={form.values.residencyNumber}
                placeholder="28"
                onChange={(e) =>
                  form.setFieldValue("residencyNumber", e.target.value)
                }
                type="number"
              />
            </div>
            <div>
              <span>Sector</span>
              <input
                value={form.values.sector}
                placeholder="Miraflores"
                onChange={(e) => form.setFieldValue("sector", e.target.value)}
              />
            </div>
          </div>
          <SectionDivision
            title={"Actividad económica"}
            icon={<BsCashCoin color="grey" size={16} />}
          />
          {form.values.customerType === "PHYSICAL_PERSON" ? (
            <>
              <div className="CustomerForm-group">
                <div>
                  <span>Fuente de ingresos</span>
                  <select
                    value={form.values.incomeSource}
                    onChange={(e) =>
                      form.setFieldValue("incomeSource", e.target.value)
                    }
                  >
                    <option value="COMMERCIAL_ACTIVITY">
                      Actvidad Comercial
                    </option>
                    <option value="SAVINGS">Ahorros</option>
                    <option value="FAMILIAR_HERITAGE">
                      Patrimonio Familiar
                    </option>
                    <option value="INHERITANCE">Herencia</option>
                  </select>
                </div>
                <div>
                  <span>Ocupación</span>
                  <select
                    value={form.values.commercialActivityType}
                    onChange={(e) =>
                      form.setFieldValue(
                        "commercialActivityType",
                        e.target.value
                      )
                    }
                  >
                    <option value="PRIVATE">Empleado privado</option>
                    <option value="PUBLIC">Empleado público</option>
                    <option value="UNEMPLOYED">Desempleado</option>
                    <option value="STUDENT">Estudiante</option>
                    <option value="BUSINESS_OWNER">Negocio propio</option>
                    <option value="COMPANY_PARTNER">
                      Socio de sociedad mercantil
                    </option>
                    <option value="RETIRED">Retirado</option>
                  </select>
                </div>
              </div>
              <div className="CustomerForm-group">
                <div>
                  <span>Naturaleza del empleador</span>
                  <select
                    value={form.values.employeerType}
                    onChange={(e) =>
                      form.setFieldValue("employeerType", e.target.value)
                    }
                  >
                    <option value="PRIVATE">Privado</option>
                    <option value="PUBLIC">Público</option>
                    <option value="BOTH">Público/Privado</option>
                  </select>
                </div>
                <div>
                  <span>Sector económico</span>
                  <select
                    value={form.values.economicSector}
                    onChange={(e) =>
                      form.setFieldValue("economicSector", e.target.value)
                    }
                  >
                    <option value="COMMERCIAL">Comercial</option>
                    <option value="INDUSTRY">Industrial</option>
                    <option value="FINANCIARY">Financiero</option>
                    <option value="SERVICES">Servicios</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>
              </div>
              <div className="CustomerForm-group">
                <div>
                  <span>
                    Especificar nombre de la empresa y actividad económica
                  </span>
                  <textarea
                    rows={4}
                    value={form.values.commercialActivityCommentary}
                    onChange={(e) =>
                      form.setFieldValue(
                        "commercialActivityCommentary",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="CustomerForm-group">
                <div>
                  <span>Tipo de empresa</span>
                  <select
                    value={form.values.companyType}
                    onChange={(e) => {
                      form.setFieldValue("companyType", e.target.value);
                      if (e.target.value == "MIXED") {
                        form.setFieldValue("companyFundsOrigin", "BOTH");
                      }
                    }}
                  >
                    <option value="PRIVATE">Privada</option>
                    <option value="PUBLIC">Pública</option>
                    <option value="ONG">ONG</option>
                    <option value="MIXED">Mixta</option>
                  </select>
                </div>
                <div>
                  <span>Procedencia de los fondos</span>
                  <select
                    value={form.values.companyFundsOrigin}
                    onChange={(e) =>
                      form.setFieldValue("companyFundsOrigin", e.target.value)
                    }
                  >
                    <option value="PRIVATE">Privado</option>
                    <option value="PUBLIC">Público</option>
                    <option value="BOTH">Ambos</option>
                  </select>
                </div>
              </div>
              {form.values.companyType === "MIXED" && (
                <div className="CustomerForm-group">
                  <div>
                    <span>Porcentaje proporcion fondos privados</span>
                    <input
                      type="text"
                      placeholder="ej. 50%"
                      value={form.values.companyPrivatePct}
                      onChange={(e) =>
                        form.setFieldValue("companyPrivatePct", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <span>Porcentaje proporcion fondos públicos</span>
                    <input
                      type="text"
                      placeholder="ej. 50%"
                      value={form.values.companyPublicPct}
                      onChange={(e) =>
                        form.setFieldValue("companyPublicPct", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
              <div className="CustomerForm-group">
                <div>
                  <span>Sector económico</span>
                  <select
                    value={form.values.economicSector}
                    onChange={(e) =>
                      form.setFieldValue("economicSector", e.target.value)
                    }
                  >
                    <option value="COMMERCIAL">Comercial</option>
                    <option value="INDUSTRY">Industrial</option>
                    <option value="FINANCIARY">Financiero</option>
                    <option value="SERVICES">Servicios</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>
              </div>
              <div className="CustomerForm-group">
                <div>
                  <span>
                    Especificar nombre de la empresa y actividad económica
                  </span>
                  <textarea
                    rows={4}
                    value={form.values.commercialActivityCommentary}
                    onChange={(e) =>
                      form.setFieldValue(
                        "commercialActivityCommentary",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </>
          )}

          {form.values.customerType === "PHYSICAL_PERSON" && (
            <>
              <SectionDivision
                title={"Otras informaciones Relevantes"}
                icon={<FaInfoCircle color="grey" size={14} />}
              />
              <div className="CustomerForm-group--pep">
                <div>
                  <input
                    id="isPep"
                    value={form.values.isPep}
                    checked={form.values.isPep}
                    type="checkbox"
                    onChange={(e) => {
                      form.setFieldValue("isPep", e.target.checked);
                      if (e.target.checked) {
                        form.setFieldValue("riskLevel", "HIGH");
                      }
                    }}
                  />
                  <label for="isPep">
                    Es una persona politicamente expuesta
                  </label>
                </div>
                <div>
                  <input
                    id="isPolitician"
                    value={form.values.isPolitician}
                    checked={form.values.isPolitician}
                    type="checkbox"
                    onChange={(e) => {
                      form.setFieldValue("isPep", true);
                      form.setFieldValue("isPolitician", e.target.checked);

                      if (e.target.checked) {
                        form.setFieldValue("riskLevel", "HIGH");
                      }
                    }}
                  />
                  <label for="isPolitician">
                    ¿Ha ocupado alguna posición como funcionario público o
                    dirigente político en lo último 5 años?
                  </label>
                </div>
                <div>
                  <input
                    id="isPoliticianRelative"
                    value={form.values.isPoliticianRelative}
                    checked={form.values.isPoliticianRelative}
                    type="checkbox"
                    onChange={(e) => {
                      form.setFieldValue(
                        "isPoliticianRelative",
                        e.target.checked
                      );
                      if (e.target.checked) {
                        form.setFieldValue("riskLevel", "HIGH");
                      }
                    }}
                  />
                  <label for="isPoliticianRelative">
                    ¿Es algún miembro de su familia nuclear o familiar hasta el
                    tercer grado servidor público en el estado dominicano?
                  </label>
                </div>
              </div>
            </>
          )}

          <SectionDivision
            title={"Nivel de Riesgo"}
            icon={<IoWarning color="grey" size={16} />}
          />
          <div className="CustomerForm-group">
            <div>
              <span className="required">Nivel de rieso</span>
              <select
                value={form.values.riskLevel}
                onChange={(e) =>
                  form.setFieldValue("riskLevel", e.target.value)
                }
              >
                <option value="LOW">Bajo</option>
                <option value="MEDIUM">Medio</option>
                <option value="HIGH">Alto</option>
              </select>
            </div>
          </div>
        </div>
        <div className="CustomerForm-footer">
          <span
            onClick={() => {
              handleClose(false);
            }}
          >
            Cancelar
          </span>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
              }}
            >
              <input
                id="openNew"
                name="openNew"
                type="checkbox"
                value={onSaveOpenNew}
                onChange={(e) => setOnSaveOpenNew(e.target.checked)}
              />
              <label for="openNew">Al guardar, abrir uno nuevo</label>
            </div>
            <button
              className={`${isSaveBtnDisabled ? "disabled" : ""}`}
              disabled={isSaveBtnDisabled}
              onClick={() => form.handleSubmit()}
            >
              Guardar
            </button>
          </div>
        </div>
      </CustomModal>
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        confirmFunction={handleClose}
        modalType={"FORM"}
      />
      <ErrorModal
        isOpen={error ? true : false}
        errorBody={error}
        onClose={() => setError(undefined)}
      />
    </>
  );
}

export { CustomerCrud };
