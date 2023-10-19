import React from "react";
import { TopBar } from "../../components/TopBar";
import "./index.css";
import Layout from "../../components/Layout";
import { getRecordsApi } from "../../api/record";
import { ListItemCard } from "../../components/ListItemCard";
import { ListWrapper } from "../../components/ListWrapper";
import { RecordContext } from "../../contexts/RecordContext";
import { SearchBar } from "../../components/SearchBar";
import { CustomModal } from "../../components/CustomModal";
import { AiOutlineSearch } from "react-icons/ai";
import { useFormik } from "formik";

function RecordScreen() {
  const { records, setRecords } = React.useContext(RecordContext);
  const [searchParams, setSearchParams] = React.useState({});
  const [searchedText, setSearchedText] = React.useState("");
  const [isFormOpened, setIsFormOpened] = React.useState(false);

  const recordForm = useFormik({
    initialValues: {
      recordCode: "",
      customerId: "",
    },
  });

  React.useEffect(() => {
    (async () => {
      try {
        setRecords([]);
        const records = await getRecordsApi(searchParams);

        if (records.error === true) {
          throw new Error(records.body);
        }
        console.log(records);
        setRecords(records.body);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [searchParams]);

  const handleOpenForm = () => {
    setIsFormOpened(true);
  };

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
                value={recordForm.values.recordCode}
                onChange={(e) =>
                  recordForm.setFieldValue("recordCode", e.target.value)
                }
              />
            </div>
            <div className="RecordForm-group">
              <span>Cliente</span>
              <div className="RecordForm-search">
                <AiOutlineSearch
                  style={{ position: "absolute", top: 15, left: 15 }}
                />
                <input type="search" placeholder="Nombre o cédula cliente..." />
              </div>
            </div>
            <div className="RecordForm-group">
              <button>Guardar</button>
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
          mainFilter={"firstName"}
          searchItems={[]}
          setSearchParams={setSearchParams}
        />
        <ListWrapper>
          {records?.map((record, key) => (
            <ListItemCard key={key} data={record} />
          ))}
        </ListWrapper>
      </Layout>
    </div>
  );
}

export { RecordScreen };
