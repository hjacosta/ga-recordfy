import React from "react";
import { TopBar } from "../../components/TopBar";
import "./index.css";
import Layout from "../../components/Layout";
import { getRecordsApi, createRecordApi } from "../../api/record";
import { getCustomersApi } from "../../api/customer";
import { ListItemCard } from "../../components/ListItemCard";
import { ListWrapper } from "../../components/ListWrapper";
import { AuthContext } from "../../contexts/AuthContext";
import { RecordContext } from "../../contexts/RecordContext";
import { SearchBar } from "../../components/SearchBar";
import { CustomModal } from "../../components/CustomModal";
import { AiOutlineSearch } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NoDataFound } from "../../components/NoDataFound";
import { Loader } from "../../components/Loader";
import { createNotification } from "../../utils/notifications";
import { NotificationManager } from "react-notifications";
import { SectionDivision } from "../../components/SectionDivision";
import { getCountries } from "../../utils/preData/countries";
import { InputMask } from "@react-input/mask";
import "react-notifications/lib/notifications.css";

function RecordScreen() {
  const { auth, logout } = React.useContext(AuthContext);
  const { records, setRecords, fileLimitByUserType } =
    React.useContext(RecordContext);
  // const [records, setRecords] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState({});
  const [requestToggle, setRequestToggle] = React.useState(false);
  const [searchedText, setSearchedText] = React.useState("");
  const [isFormOpened, setIsFormOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = React.useState(false);
  const [onSaveOpenNew, setOnSaveOpenNew] = React.useState(false);

  const recordForm = useFormik({
    initialValues: {
      recordCode: "",
      customerType: "",
      customerId: "",
      customerName: "",
      numberOfBeneficiaries: 1,
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      recordCode: Yup.string().required(),
      customerId: Yup.string().required(),
      numberOfBeneficiaries: Yup.number()
        .required()
        .min(1, "Debe haber al menos un socio en el expediente")
        .max(5, "Solo se permiten 5 socios por expediente"),
    }),
    onSubmit: async (values, { resetForm }) => {
      let data = {
        recordCode: values.recordCode,
        customerId: values.customerId,
        numberOfBeneficiaries: values.numberOfBeneficiaries,
        beneficiaries: currentBeneficiaries,
        createdBy: auth.userProfile.email,
        lastModifiedBy: auth.userProfile.email,
      };

      try {
        let res = await createRecordApi(data);

        if (res.error === true) {
          throw new Error(res.body);
        }
        resetForm();
        setRequestToggle(!requestToggle);
      } catch (error) {
        if (error.message.includes("already exists"))
          NotificationManager.error("error", "Ya existe el expediente");
      }

      if (onSaveOpenNew == false) {
        setIsFormOpened(false);
      }
    },
  });

  React.useEffect(() => {
    (async () => {
      try {
        // setRecords([]);
        setIsLoading(true);
        const records = await getRecordsApi(searchParams);

        const customers = await getCustomersApi({});
        setIsLoading(false);

        setCustomers(customers.body);
        if (records.error === true) {
          throw new Error(records.body);
        }

        setRecords(records.body);
        // const maxRecordCode = Math.max(
        //   ...records.body.map((i) => i.record_code)
        // );

        // recordForm.setFieldValue("recordCode", maxRecordCode + 1);
      } catch (error) {
        if (error.message.includes("jwt expired")) {
          NotificationManager.info("Tu sesión ha expirado");
          setTimeout(() => {
            logout();
          }, 4000);
        }

        if (error.message.includes("not found")) {
          setRecords([]);
          setIsLoading(false);
          // recordForm.setFieldValue("recordCode", 1);
        }

        console.log(error);
      }
    })();
  }, [searchParams, requestToggle]);

  const handleCustomerSelection = (customer) => {
    recordForm.setFieldValue("customerId", customer.customer_id);
    recordForm.setFieldValue("customerName", `${customer.customer_name}`);
    recordForm.setFieldValue("recordCode", customer.identification_number);
    recordForm.setFieldValue("customerType", customer.customer_type);
    if (customer.customer_type == "PHYSICAL_PERSON") {
      setCurrentBenficiaries([
        {
          order: 0,
          beneficiaryType: "PHYSICAL_PERSON",
          name: customer.customer_name,
          identificationType: "PERSONAL_ID",
          identificationNumber: customer.identification_number,
          nationality: 138,
          stocksPercentage: 100,
          isPep: customer.is_pep,
          isPolitician: customer.is_politician,
          isPoliticianRelative: customer.is_politician_relative,
        },
      ]);
    }
    setSearchedText("");
  };

  const searchedCustomers = customers
    .filter((item) => Object.entries(item.record || {}).length == 0)
    .filter((customer) => {
      const matchcase = `${customer.customer_name} ${customer.identification_number}`;

      return matchcase.toLowerCase().includes(searchedText.toLowerCase());
    });

  const [currentBeneficiaries, setCurrentBenficiaries] = React.useState([]);
  const [searchItems, setSearchItems] = React.useState([
    {
      label: "No. expediente",
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
          label: "Todos",
          value: "",
        },
        {
          label: "Persona Física",
          value: "PHYSICAL_PERSON",
        },
        {
          label: "Persona Júrídica",
          value: "LEGAL_PERSON",
        },
      ],
    },
    // {
    //   label: "Estado",
    //   name: "status",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Activo",
    //       value: "active",
    //     },
    //   ],
    // },
  ]);
  const [countries, setCountries] = React.useState([]);
  const [identificationMask, setIdentificationMask] =
    React.useState("___-_______-_");

  const updateBeneficiaryField = (index, prop, value) => {
    let newBeneficiaries = currentBeneficiaries;

    newBeneficiaries[index][prop] = value;
    newBeneficiaries[index].order = index;
    setIdentificationMask("___-_______-_");
    setCurrentBenficiaries(newBeneficiaries);
  };

  React.useEffect(() => {
    (async () => {
      let res = await getCountries();
      setCountries(res);
    })();
  }, []);

  const handleOpenForm = () => {
    setIsFormOpened(true);
    setCurrentBenficiaries([
      {
        order: 0,
        beneficiaryType: "PHYSICAL_PERSON",
        name: "",
        identificationType: "PERSONAL_ID",
        identificationNumber: "",
        nationality: 138,
        stocksPercentage: 0,
        isPep: false,
        isPolitician: false,
        isPoliticianRelative: false,
      },
    ]);
  };

  const handleClose = () => {
    recordForm.resetForm();
    setCurrentBenficiaries([]);
    setIsFormOpened(false);
  };

  return (
    <div>
      <CustomModal
        open={isFormOpened}
        setOpen={setIsFormOpened}
        onClose={handleClose}
      >
        <div className="RecordForm-container">
          <div className="RecordForm-header">
            <h2>Nuevo Expediente</h2>
          </div>
          <div className="RecordForm-wrapper">
            <SectionDivision title={"Información del cliente"} />
            <div className="RecordForm-group">
              <div>
                <span className="">Código expediente</span>
                <input
                  type="text"
                  disabled
                  value={recordForm.values.recordCode}
                  onChange={(e) =>
                    recordForm.setFieldValue(
                      "recordCode",
                      e.target.value.toUpperCase()
                    )
                  }
                />
                <span className="error">{recordForm.errors.recordCode}</span>
              </div>
              <div>
                <span className="">Cliente</span>
                <input
                  type="text"
                  disabled
                  value={recordForm.values.customerName}
                  onChange={(e) =>
                    recordForm.setFieldValue(
                      "customerName",
                      e.target.value.toUpperCase()
                    )
                  }
                />
                <span className="error">{recordForm.errors.customerName}</span>
              </div>
            </div>
            {/* <div className="RecordForm-group">
              <div>
                <span className="">Tipo de cliente</span>
                <input
                  type="text"
                  disabled
                  value={
                    recordForm.values.customerType == "PHYSICAL_PERSON"
                      ? "Persona física"
                      : "Persona Jurídica"
                  }
                  onChange={(e) =>
                    recordForm.setFieldValue(
                      "customerType",
                      e.target.value.toUpperCase()
                    )
                  }
                />
                <span className="error">{recordForm.errors.customerType}</span>
              </div>
            </div> */}
            <div className="RecordForm-group">
              <div className="RecordForm-search">
                <AiOutlineSearch
                  style={{ position: "absolute", top: 22, left: 15 }}
                />
                <input
                  type="search"
                  placeholder="Nombre o cédula cliente..."
                  value={searchedText}
                  onChange={(e) =>
                    e.target.value.length > 0
                      ? setSearchedText(e.target.value)
                      : setSearchedText("")
                  }
                />
                <ul className="RecordForm-customers">
                  {searchedCustomers.map((customer, index) => (
                    <li
                      key={index}
                      onClick={() => handleCustomerSelection(customer)}
                    >
                      {`${customer.customer_name}  ${
                        customer.identification_number
                      } (${
                        customer.customer_type == "PHYSICAL_PERSON"
                          ? "Persona física"
                          : "Persona Jurídica"
                      })`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {recordForm.values.customerType == "LEGAL_PERSON" && (
              <>
                <SectionDivision title={"Beneficiarios"} />
                <div className="RecordForm-group">
                  <div>
                    <span className="required">Número de benficiarios</span>
                    <select
                      value={recordForm.values.numberOfBeneficiaries}
                      onChange={(e) => {
                        recordForm.setFieldValue(
                          "numberOfBeneficiaries",
                          parseInt(e.target.value)
                        );
                        let arr = [];
                        for (let i = 0; i < parseInt(e.target.value); i++) {
                          arr.push({
                            order: 0,
                            beneficiaryType: "PHYSICAL_PERSON",
                            name: "",
                            identificationType: "PERSONAL_ID",
                            identificationNumber: "",
                            nationality: 138,
                            stocksPercentage: 0,
                            isPep: false,
                            isPolitician: false,
                            isPoliticianRelative: false,
                          });
                        }
                        setCurrentBenficiaries(arr);
                      }}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                    <span className="error">
                      {recordForm.errors.customerName}
                    </span>
                  </div>
                </div>
                {currentBeneficiaries?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid rgba(0,0,0,0.1)",
                      padding: "12px 12px 8px 12px",
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                  >
                    <SectionDivision
                      title={`Beneficiario ${index + 1}`}
                      textStyle={{ marginTop: 6, marginBottom: 14 }}
                    />
                    <div className="RecordForm-group">
                      <div>
                        <span className="">Nombre</span>
                        <input
                          type="text"
                          // value={currentBeneficiaries[index]?.name}
                          onChange={(e) => {
                            updateBeneficiaryField(
                              index,
                              "name",
                              e.target.value.toUpperCase()
                            );
                          }}
                        />
                        <span className="error">
                          {recordForm.errors.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="">Nacionalidad</span>
                        <select
                          type="text"
                          // value={currentBeneficiaries[index]?.nationality}
                          onChange={(e) =>
                            updateBeneficiaryField(
                              index,
                              "nationality",
                              e.target.value
                            )
                          }
                        >
                          {countries.map(({ id, name }) => (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          ))}
                        </select>
                        <span className="error">
                          {recordForm.errors.customerName}
                        </span>
                      </div>
                    </div>
                    <div className="RecordForm-group">
                      <div>
                        <span className="">Tipo de beneficiario</span>
                        <select
                          type="text"
                          //value={currentBeneficiaries[index]?.beneficiaryType}
                          onChange={(e) =>
                            updateBeneficiaryField(
                              index,
                              "beneficiaryType",
                              e.target.value
                            )
                          }
                        >
                          <option value="PHYSICAL_PERSON">
                            Persona Física
                          </option>
                          <option value="LEGAL_PERSON">Persona Jurídica</option>
                        </select>
                        <span className="error">
                          {recordForm.errors.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="">Tipo de identificación</span>
                        <select
                          type="text"
                          //value={currentBeneficiaries[index]?.identificationType}
                          onChange={(e) => {
                            updateBeneficiaryField(
                              index,
                              "identificationType",
                              e.target.value
                            );

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
                            updateBeneficiaryField(
                              index,
                              "identificationNumber",
                              ""
                            );
                            setIdentificationMask(mask);
                          }}
                        >
                          <option value="PERSONAL_ID">Cédula</option>
                          <option value="RNC">RNC</option>
                          <option value="PASSPORT">Pasaporte</option>
                        </select>
                        <span className="error">
                          {recordForm.errors.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="">Número de identificación</span>
                        <InputMask
                          showMask={true}
                          mask={identificationMask}
                          replacement={{ _: /\d/ }}
                          type="text"
                          //value={currentBeneficiaries[index].identificationNumber}
                          onChange={(e) =>
                            updateBeneficiaryField(
                              index,
                              "identificationNumber",
                              e.target.value
                            )
                          }
                        />
                        <span className="error">
                          {recordForm.errors.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="">Porcentaje de acciones (%)</span>
                        <input
                          type="text"
                          // value={currentBeneficiaries[index]?.stocksPercentage}
                          onChange={(e) => {
                            updateBeneficiaryField(
                              index,
                              "stocksPercentage",
                              e.target.value
                            );
                          }}
                        />
                        <span className="error">
                          {recordForm.errors.customerName}
                        </span>
                      </div>
                    </div>
                    <div className="CustomerForm-group--pep">
                      <div>
                        <input
                          id="isPep"
                          // value={recordForm.values.isPep}
                          type="checkbox"
                          onChange={(e) => {
                            updateBeneficiaryField(
                              index,
                              "isPep",
                              Boolean(e.target.value)
                            );
                          }}
                        />
                        <label for="isPep">
                          Es una persona politicamente expuesta
                        </label>
                      </div>
                      <div>
                        <input
                          id="isPolitician"
                          // value={recordForm.values.isPolitician}
                          type="checkbox"
                          onChange={(e) => {
                            updateBeneficiaryField(
                              index,
                              "isPolitician",
                              Boolean(e.target.value)
                            );
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
                          // value={recordForm.values.isPoliticianRelative}
                          type="checkbox"
                          onChange={(e) => {
                            updateBeneficiaryField(
                              index,
                              "isPoliticianRelative",
                              Boolean(e.target.value)
                            );
                          }}
                        />
                        <label for="isPoliticianRelative">
                          ¿Es algún miembro de su familia nuclear o familiar
                          hasta el tercer grado servidor público en el estado
                          dominicano?
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="RecordForm-footer">
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
                onClick={() => recordForm.handleSubmit()}
              >
                Guardar
              </button>
            </div>
          </div>
          {/* <div className="RecordForm-body">
            <div className="RecordForm-group">
              <span>Código</span>
              <input
                type="text"
                title="No editable"
                value={recordForm.values.recordCode}
                onChange={(e) =>
                  recordForm.setFieldValue("recordCode", e.target.value)
                }
                disabled
              />
            </div>
            <div className="RecordForm-group">
              <span>No. de Beneficiarios</span>
              <input
                type="number"
                value={recordForm.values.numberOfPartners}
                onChange={(e) =>
                  recordForm.setFieldValue("numberOfPartners", e.target.value)
                }
              />
              <span className="RecordDetail-form-error">
                {recordForm.errors.numberOfPartners}
              </span>
            </div>
            {Array.from(Array(5)).map((item) => (
              <div className="RecordForm-group beneficiary">
                <div>
                  <span>No. de Representantes</span>
                  <input
                    type="number"
                    value={recordForm.values.numberOfPartners}
                    onChange={(e) =>
                      recordForm.setFieldValue(
                        "numberOfPartners",
                        e.target.value
                      )
                    }
                  />
                  <span className="RecordDetail-form-error">
                    {recordForm.errors.numberOfPartners}
                  </span>
                </div>
              </div>
            ))}
            <div className="RecordForm-group">
              <span>Cliente</span>
              <div className="RecordForm-search">
                <input
                  type="text"
                  value={recordForm.values.customerName}
                  disabled
                />
                <AiOutlineSearch
                  style={{ position: "absolute", top: 61, left: 15 }}
                />
                <input
                  type="search"
                  placeholder="Nombre o cédula cliente..."
                  value={searchedText}
                  onChange={(e) =>
                    e.target.value.length > 0
                      ? setSearchedText(e.target.value)
                      : setSearchedText("")
                  }
                />
                <ul className="RecordForm-customers">
                  {searchedCustomers.map((customer, index) => (
                    <li
                      key={index}
                      onClick={() => handleCustomerSelection(customer)}
                    >
                      {`${customer.customer_name} - ${customer.identification_number}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="RecordForm-group">
              <button onClick={recordForm.handleSubmit}>Guardar</button>
            </div>
          </div> */}
        </div>
      </CustomModal>
      <TopBar
        label="Expedientes"
        button={{ label: "Nuevo Expediente", onClick: () => handleOpenForm() }}
      />
      <Layout>
        <SearchBar
          mainLabel={"Búsqueda por nombre"}
          mainFilter={"customerName"}
          searchItems={searchItems}
          setSearchItems={setSearchItems}
          setSearchParams={setSearchParams}
        />
        <ListWrapper>
          {records?.length === 0 && !isLoading && (
            <NoDataFound label={"No se econtro ningún expediente"} />
          )}

          {isLoading ? (
            <Loader />
          ) : (
            records?.map((record, key) => (
              <ListItemCard
                key={key}
                data={record}
                limit={fileLimitByUserType}
              />
            ))
          )}
        </ListWrapper>
      </Layout>
    </div>
  );
}

export { RecordScreen };
