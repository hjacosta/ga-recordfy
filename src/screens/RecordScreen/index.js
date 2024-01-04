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

  const recordForm = useFormik({
    initialValues: {
      recordCode: "",
      customerId: "",
      customerName: "",
      numberOfPartners: 1,
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      recordCode: Yup.string().required(),
      customerId: Yup.string().required(),
      numberOfPartners: Yup.number()
        .required()
        .min(1, "Debe haber al menos un socio en el expediente")
        .max(5, "Solo se permiten 5 socios por expediente"),
    }),
    onSubmit: async (values, { resetForm }) => {
      // console.log(auth);

      let data = {
        recordCode: values.recordCode,
        customerId: values.customerId,
        numberOfPartners: values.numberOfPartners,
        createdBy: auth.userProfile.email,
        modifiedBy: auth.userProfile.email,
      };

      try {
        let res = await createRecordApi(data);

        if (res.error === true) {
          throw new Error(res.body);
        }

        resetForm();
        setRequestToggle(!requestToggle);
      } catch (error) {
        console.log("HERE", error.message);

        if (error.message.includes("already exists"))
          NotificationManager.error("error", "Ya existe el expediente");

        if (
          error.message.includes("record_code") &&
          error.message.includes("unique")
        ) {
          recordForm.setFieldValue(
            "recordCode",
            parseInt(recordForm.values.recordCode) + 1
          );
        }
      }
    },
  });

  console.log(searchParams);

  React.useEffect(() => {
    (async () => {
      // console.log("LARGE OF SEARCHPARAMS", Object.values(searchParams).length);

      try {
        // setRecords([]);
        setIsLoading(true);
        const records = await getRecordsApi(searchParams);

        const customers = await getCustomersApi({});
        setIsLoading(false);
        // console.log("CUSTOMERS", customers);

        setCustomers(customers.body);
        if (records.error === true) {
          throw new Error(records.body);
        }

        setRecords(records.body);
        const maxRecordCode = Math.max(
          ...records.body.map((i) => i.record_code)
        );

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

      setIsFormOpened(false);
    })();
  }, [searchParams, requestToggle]);

  const handleOpenForm = () => {
    setIsFormOpened(true);
  };

  const handleCustomerSelection = (customer) => {
    recordForm.setFieldValue("customerId", customer.customer_id);
    recordForm.setFieldValue("customerName", `${customer.customer_name}`);
    recordForm.setFieldValue("recordCode", customer.identification_number);
    setSearchedText("");
  };

  const searchedCustomers = customers.filter((customer) => {
    const matchcase = `${customer.customer_name} ${customer.identification_number}`;

    return matchcase.toLowerCase().includes(searchedText.toLowerCase());
  });

  const [searchItems, setSearchItems] = React.useState([
    {
      label: "Cédula/Pasaporte",
      name: "identificationNumber",
      type: "text",
      // options: [
      //   {
      //     label: "Activo",
      //     value: "active",
      //   },
      // ],
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

  return (
    <div>
      <CustomModal open={isFormOpened} setOpen={setIsFormOpened}>
        <div className="RecordForm-container">
          <div className="RecordForm-header">
            <h2>Nuevo Expediente</h2>
          </div>
          <div className="RecordForm-body">
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
              <span>No. de Representantes</span>
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
          </div>
        </div>
      </CustomModal>
      <TopBar
        label="Expedientes"
        button={{ label: "Nuevo Expediente", onClick: () => handleOpenForm() }}
      />
      <Layout>
        <SearchBar
          mainLabel={"Búsqueda por nombre"}
          mainFilter={"firstName"}
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
