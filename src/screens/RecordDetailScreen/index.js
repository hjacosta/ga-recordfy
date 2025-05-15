import React from "react";
import Layout from "../../components/Layout";
import { TopBar } from "../../components/TopBar";
import { SearchBar } from "../../components/SearchBar";
import { RecordContext } from "../../contexts/RecordContext";
import { SummaryCard } from "../../components/SummaryCard";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { ListWrapper } from "../../components/ListWrapper";
import {
  getRecordFilesApi,
  removeRecordFileApi,
  uploadRecordFileApi,
} from "../../api/recordFile";
import { getRecordsApi } from "../../api/record";
import FileCard from "../../components/FileCard";
import { NoDataFound } from "../../components/NoDataFound";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFileTypeApi } from "../../api/fileType";
import { AuthContext } from "../../contexts/AuthContext";
import { SectionDivision } from "../../components/SectionDivision";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import getLabelName from "../../utils/appLabels";
import { ConfirmModal } from "../../components/ConfirmModal";
import { MdHistory } from "react-icons/md";
import { groupBy as lodashGroupBy, orderBy } from "lodash";
import "./index.css";
import { getCurrentRecordFiles } from "../../utils/records";
import { NotificationManager } from "react-notifications";

function RecordDetailScreen() {
  const [files, setFiles] = React.useState([]);
  const [loadedFile, setLoadedFile] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const { auth, logout } = React.useContext(AuthContext);
  const { records, setRecords, fileTypes, setFileTypes, fileLimitByUserType } =
    React.useContext(RecordContext);

  const [currentRecord, setCurrentRecord] = React.useState();
  const [itemToDelete, setItemToDelete] = React.useState({});
  const navigate = useNavigate();

  const uploadForm = useFormik({
    initialValues: {
      filename: "",
      prefix: "",
      fileExt: "",
      fileTypeId: "all",
      expirationDate: "",
      docCreationDate: "",
      file: "",
      beneficiaryId: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      filename: Yup.string().required("Este campo no puede estar vacio"),
      fileTypeId: Yup.string().required("Este campo no puede estar vacio"),
      beneficiaryId:
        currentRecord?.customer.customer_type == "LEGAL_PERSON" &&
        Yup.string().required("Este campo no puede estar vacio"),
      //expirationDate: Yup.date().required("Este campo no puede estar vacio"),
      //docCreationDate: Yup.date().required("Este campo no puede estar vacio"),
    }),
    onSubmit: async (values, { resetForm }) => {
      let docDate = new Date(values.docCreationDate);
      let currentDate = new Date(values.expirationDate);

      console.log(values.expirationDate ? true : false);

      try {
        let data = {
          filename: `${values.prefix}-${values.filename}.${values.fileExt}`,
          recordId: currentRecord.record_id,
          customerIdentification: currentRecord.customer.identification_number,
          fileTypeId: values.fileTypeId,
          expirationDate: values.expirationDate
            ? currentDate.toISOString("en-EN", { timeZone: "UTC" })
            : null,
          docCreationDate: values.docDate
            ? docDate.toISOString("en-EN", { timeZone: "UTC" })
            : null,
          beneficiaryId:
            values.beneficiaryId ||
            currentRecord.beneficiaries[0].beneficiary_id,
          lastModifiedBy: auth.userProfile.email,
          createdBy: auth.userProfile.email,
          file: values.file,
        };

        const response = await uploadRecordFileApi(data);

        if (response.error === true) {
          throw new Error(response.body);
        }

        setReqToggle(!reqToggle);
      } catch (error) {
        console.log(error.message);
      }
      resetForm();
    },
  });

  React.useEffect(() => {
    (async () => {
      try {
        let recordId = window.location.pathname?.substring(
          window.location.pathname.lastIndexOf("/") + 1
        );
        setIsLoading(true);
        const retrievedRecords = await getRecordsApi({
          recordId,
        });

        // const searchedRecords = await getRecordsApi({});
        // if (searchedRecords.error === true) {
        //   throw new Error(searchedRecords.body);
        // }
        // setRecords(searchedRecords.body);

        // const [cRecord] = searchedRecords.filter(
        //   (record) => record.record_code === recordCode
        // );

        // const recordFiles =  await getRecordFilesApi({
        //   recordId: currentRecord.record_id,
        // });

        const recordFiles = [];

        const fileTypes = await getFileTypeApi({});

        if (fileTypes.error === true) {
          throw new Error(fileTypes.body);
        }
        setFileTypes(fileTypes.body);
        setCurrentRecord(retrievedRecords.body[0]);
        setIsLoading(false);

        if (retrievedRecords.error === true) {
          throw new Error(retrievedRecords.body);
        }
        setFiles(retrievedRecords.body);
      } catch (error) {
        if (error.message.includes("jwt")) {
          NotificationManager.info("Tu sesión ha expirado");

          setTimeout(() => {
            NotificationManager.listNotify = [];
            logout();
            navigate("/");
          }, 4000);
        }
        // alert(error.message);
        if (error.message.includes("not found")) {
          setFiles([]);
        }
      }
    })();
  }, [reqToggle, useParams().id]);

  const selectFileType = (id) => {
    const target = fileTypes.filter((ft) => ft.file_type_id === id)[0];

    uploadForm.setFieldValue("fileTypeId", target.file_type_id);
    uploadForm.setFieldValue("prefix", target.prefix);
  };

  const handleDelete = async (isDeletionConfirmed, params) => {
    if (isDeletionConfirmed == true) {
      try {
        let res = await removeRecordFileApi(params);
        setReqToggle(!reqToggle);
      } catch (error) {
        console.log(error);
      }
      setItemToDelete({});
    }
  };

  const getRequiredFilesLabels = () => {
    let labels = {};

    currentRecord?.beneficiaries?.forEach((item) => {
      item?.required_files?.forEach((sbItem) => {
        labels[sbItem.file_type.name] = "";
      });
    });

    return Object.keys(labels);
  };
  return (
    <React.Fragment>
      <TopBar
        label={`Expediente  NO. ${currentRecord?.record_code}`}
        backTo={"/records"}
        button={{
          label: "Ver histórico",
          onClick: () =>
            navigate(`${window.location.pathname}/history`, {
              recordId: currentRecord.record_id,
            }),
        }}
        btnIcon={<MdHistory size={18} />}
      />
      {currentRecord && (
        <Layout>
          <SummaryCard
            data={currentRecord}
            fileTypes={fileTypes}
            riskLevel={currentRecord.customer.risk_level}
          />

          {
            <div className="RecordDetail-uploader-container">
              <div
                style={{ position: "relative" }}
                className="RecordDetail-uploader-container-item "
              >
                <label htmlFor="myFile">
                  <div className="RecordDetail-uploader-icon">
                    <BsFillCloudUploadFill size={60} color="grey" />

                    <span style={{ fontSize: 13 }}>
                      Selecciona tu archivo aquí
                    </span>
                  </div>

                  <input
                    style={{ display: "none" }}
                    id="myFile"
                    type="file"
                    title="jk"
                    onChange={(e) => {
                      uploadForm.setFieldValue(
                        "fileExt",
                        e.target.files[0].type.split("/")[1]
                      );
                      uploadForm.setFieldValue(
                        "filename",
                        e.target.files[0].name.split(".")[0]
                      );

                      uploadForm.setFieldValue("file", e.target.files[0]);
                      // setLoadedFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
              <div className="RecordDetail-uploader-container-item ">
                <span>Nombre del archivo</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span
                    style={{
                      fontSize: 14,
                      marginLeft: 4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {uploadForm.values.prefix}-
                  </span>
                  <input
                    type="text"
                    placeholder="Nombre del archivo"
                    value={`${uploadForm.values.filename}`}
                    onChange={(e) =>
                      uploadForm.setFieldValue("filename", `${e.target.value}`)
                    }
                    // disabled
                  />
                  <p className="RecordDetail-form-error">
                    {uploadForm.errors.filename}
                  </p>
                </div>

                <div style={{ display: "flex", width: "100%" }}>
                  <div style={{ flex: 1, marginRight: 8 }}>
                    <span>Tipo de archivo</span>
                    <select
                      value={uploadForm.values.fileTypeId}
                      onChange={(e) => {
                        selectFileType(e.target.value);
                      }}
                    >
                      <option value="all" disabled>
                        Seleccione un tipo de archivo
                      </option>
                      {fileTypes
                        ?.filter((item) =>
                          getRequiredFilesLabels().some((l) => l == item.name)
                        )
                        .map((ft, index) => (
                          <option key={index} value={ft.file_type_id}>
                            {ft.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span>
                      {currentRecord.customer.customer_type == "PHYSICAL_PERSON"
                        ? "Cliente"
                        : "Beneficiario"}
                    </span>
                    <select
                      value={uploadForm.values.beneficiaryId}
                      disabled={
                        currentRecord.customer.customer_type ==
                        "PHYSICAL_PERSON"
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        uploadForm.setFieldValue(
                          "beneficiaryId",
                          e.target.value
                        );
                      }}
                    >
                      {currentRecord.customer.customer_type !=
                        "PHYSICAL_PERSON" && (
                        <option value="" disabled selected>
                          Seleccione un beneficiario
                        </option>
                      )}

                      {orderBy(
                        currentRecord.beneficiaries,
                        ["order"],
                        "desc"
                      )?.map((opt, index) => (
                        <option key={index} value={opt.beneficiary_id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="RecordDetail-form-error">
                  {uploadForm.errors.partner}
                </p>
                <span>Fecha de expiración (opcional)</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="date"
                    placeholder="Nombre del archivo"
                    value={`${uploadForm.values.expirationDate}`}
                    onChange={(e) =>
                      uploadForm.setFieldValue(
                        "expirationDate",
                        `${e.target.value || ""}`
                      )
                    }
                    // disabled
                  />
                  <p className="RecordDetail-form-error">
                    {uploadForm.errors.expirationDate}
                  </p>
                </div>

                <span>
                  Fecha de creación ( fecha en que fue emitido el documento )
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="date"
                    placeholder="Nombre del archivo"
                    value={`${uploadForm.values.docCreationDate}`}
                    onChange={(e) =>
                      uploadForm.setFieldValue(
                        "docCreationDate",
                        `${e.target.value}`
                      )
                    }
                    // disabled
                  />
                  <p className="RecordDetail-form-error">
                    {uploadForm.errors.docCreationDate}
                  </p>
                </div>
                <button onClick={uploadForm.handleSubmit}>Subir archivo</button>
              </div>
            </div>
          }
          {/* <SearchBar mainFilter={"name"} searchItems={[]} /> */}
          {orderBy(currentRecord.beneficiaries, ["order"], "desc")?.map(
            (beneficiary, index) => {
              return (
                <>
                  <SectionDivision
                    title={`${beneficiary.name}  ---  ${getLabelName(
                      beneficiary.beneficiary_type
                    )} ${beneficiary.is_pep == true ? "| Pep " : ""}
                  ${beneficiary.is_politician == true ? "| Politico " : ""}
                  ${
                    beneficiary.is_politician_relative == true
                      ? "| Familiar politico"
                      : ""
                  }
                   (${
                     getCurrentRecordFiles(beneficiary.record_files)?.length
                   }/${beneficiary.required_files.length})`}
                    containerStyle={{}}
                  />

                  <ListWrapper>
                    {beneficiary.record_files?.length == 0 && (
                      <NoDataFound
                        label={"Aún no se ha cargado nigún archivo"}
                      />
                    )}
                    {}
                    {getCurrentRecordFiles(beneficiary.record_files)?.map(
                      (file, key) => {
                        return (
                          <FileCard
                            key={key}
                            data={file}
                            handleRemove={() => {
                              setItemToDelete({
                                fileLocation: file.source,
                                recordFileId: file.record_file_id,
                              });

                              setIsConfirmOpen(true);
                            }}
                          />
                        );
                      }
                    )}
                  </ListWrapper>
                </>
              );
            }
          )}
        </Layout>
      )}
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        confirmFunction={handleDelete}
        modalType={"DELETE"}
        deleteParams={itemToDelete}
        elementLabel={"archivo"}
      />
    </React.Fragment>
  );
}

export { RecordDetailScreen };
