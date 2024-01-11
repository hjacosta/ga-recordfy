import React from "react";
import Layout from "../../components/Layout";
import { TopBar } from "../../components/TopBar";
import { SearchBar } from "../../components/SearchBar";
import { RecordContext } from "../../contexts/RecordContext";
import { SummaryCard } from "../../components/SummaryCard";
import { BsFillCloudUploadFill } from "react-icons/bs";
import "./index.css";
import { ListWrapper } from "../../components/ListWrapper";
import { getRecordFilesApi, uploadRecordFileApi } from "../../api/recordFile";
import { getRecordsApi } from "../../api/record";
import FileCard from "../../components/FileCard";
import { NoDataFound } from "../../components/NoDataFound";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFileTypeApi } from "../../api/fileType";
import { AuthContext } from "../../contexts/AuthContext";
import { SectionDivision } from "../../components/SectionDivision";
import { useParams, useLocation } from "react-router-dom";

function RecordDetailScreen() {
  const [files, setFiles] = React.useState([]);
  const [loadedFile, setLoadedFile] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState(false);
  const { auth } = React.useContext(AuthContext);
  const { records, setRecords, fileTypes, setFileTypes, fileLimitByUserType } =
    React.useContext(RecordContext);
  let recordId = window.location.pathname.substring(
    window.location.pathname.lastIndexOf("/") + 1
  );

  let { id: recordCode } = useParams();

  const [currentRecord, setCurrentRecord] = React.useState(
    ...records.filter((record) => record.record_code === recordCode)
  );

  const uploadForm = useFormik({
    initialValues: {
      filename: "",
      prefix: "",
      fileExt: "",
      fileTypeId: "all",
      expirationDate: "",
      file: "",
      partner: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      filename: Yup.string().required("Este campo no puede estar vacio"),
      fileTypeId: Yup.string().required("Este campo no puede estar vacio"),
      partner: Yup.string().required("Este campo no puede estar vacio"),
      expirationDate: Yup.date().required("Este campo no puede estar vacio"),
    }),
    onSubmit: async (values, { resetForm }) => {
      let currentDate = new Date(values.expirationDate);

      // console.log(currentDate.toISOString());

      // let expDate = `${currentDate.getFullYear()}-${
      //   currentDate.getMonth() + 1 <= 9
      //     ? `0${currentDate.getMonth() + 1}`
      //     : `${currentDate.getMonth() + 1}`
      // }-${
      //   currentDate.getDate() <= 9
      //     ? `0${currentDate.getDate()}`
      //     : `${currentDate.getDate()}`
      // }T${
      //   currentDate.getHours() <= 9
      //     ? `0${currentDate.getHours()}`
      //     : `${currentDate.getHours()}`
      // }:${
      //   currentDate.getMinutes() <= 9
      //     ? `0${currentDate.getMinutes()}`
      //     : `${currentDate.getMinutes()}`
      // }:${
      //   currentDate.getSeconds() <= 9
      //     ? `0${currentDate.getSeconds()}`
      //     : `${currentDate.getSeconds()}`
      // }.${currentDate.getMilliseconds()}Z`;

      // console.log(expDate);
      // console.log(currentDate.toLocaleTimeString({ numeric: true }));

      try {
        let data = {
          filename: `${values.prefix}-${values.filename}.${values.fileExt}`,
          recordId: currentRecord.record_id,
          customerIdentification: currentRecord.identification_number,
          fileTypeId: values.fileTypeId,
          expirationDate: currentDate.toISOString(),
          partner: values.partner,
          modifiedBy: auth.userProfile.email,
          createdBy: auth.userProfile.email,
          file: values.file,
        };

        const response = await uploadRecordFileApi(data);

        if (response.error === true) {
          throw new Error(response.body);
        }

        setReqToggle(!reqToggle);

        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
      resetForm();
    },
  });

  React.useEffect(() => {
    (async () => {
      console.log(window.location.pathname);

      try {
        // const searchedRecords = await getRecordsApi({});
        // console.log("RECORDS", searchedRecords);
        // if (searchedRecords.error === true) {
        //   throw new Error(searchedRecords.body);
        // }
        // setRecords(searchedRecords.body);

        // const [cRecord] = searchedRecords.filter(
        //   (record) => record.record_code === recordCode
        // );

        // console.log("$$$$$$", cRecord);

        const recordFiles = await getRecordFilesApi({
          recordId: currentRecord.record_id,
        });

        const fileTypes = await getFileTypeApi({});

        if (fileTypes.error === true) {
          throw new Error(fileTypes.body);
        }
        setFileTypes(fileTypes.body);

        if (recordFiles.error === true) {
          throw new Error(recordFiles.body);
        }
        setFiles(recordFiles.body);
      } catch (error) {
        // alert(error.message);
        if (error.message.includes("not found")) {
          setFiles([]);
        }
      }
    })();
  }, [reqToggle, recordCode]);

  const selectFileType = (id) => {
    const target = fileTypes.filter((ft) => ft.file_type_id === id)[0];

    console.log(target);

    uploadForm.setFieldValue("fileTypeId", target.file_type_id);
    uploadForm.setFieldValue("prefix", target.prefix);
  };

  return (
    <React.Fragment>
      <TopBar
        label={`Expediente  NO. ${currentRecord?.record_code}`}
        backTo={"/records"}
        // button={{ label: "Nuevo Expediente", onClick: () => console.log("hi") }}
      />
      {currentRecord && (
        <Layout>
          <SummaryCard
            data={currentRecord}
            fileTypes={fileTypes}
            files={files}
            limit={fileLimitByUserType}
            numberOfPartners={currentRecord.number_of_partners}
          />

          <div className="RecordDetail-uploader-container">
            {/* <label htmlFor="file">Selecciona un archivo</label> */}

            <div
              style={{ position: "relative" }}
              className="RecordDetail-uploader-container-item "
            >
              <div className="RecordDetail-uploader-icon">
                <BsFillCloudUploadFill size={60} color="grey" />

                <span style={{ fontSize: 13 }}>Arrastra tus archivos aquí</span>
              </div>
              <input
                type="file"
                onChange={(e) => {
                  console.log(e.target.files[0].type.split("/")[1]);
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
            </div>
            <div className="RecordDetail-uploader-container-item ">
              <span>Nombre del archivo</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{ fontSize: 14, marginLeft: 4, whiteSpace: "nowrap" }}
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
                    {fileTypes.map((ft, index) => (
                      <option key={index} value={ft.file_type_id}>
                        {ft.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <span>Socio</span>
                  <select
                    value={uploadForm.values.partner}
                    onChange={(e) => {
                      uploadForm.setFieldValue("partner", e.target.value);
                    }}
                  >
                    <option value="" disabled selected>
                      Seleccione un socio
                    </option>
                    {Array(parseInt(currentRecord.number_of_partners))
                      .fill(1)
                      .map((opt, index) => (
                        <option key={index} value={`partner_${index + 1}`}>
                          {`Socio ${index + 1}`}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <p className="RecordDetail-form-error">
                {uploadForm.errors.partner}
              </p>
              <span>Fecha de expiración</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="date"
                  placeholder="Nombre del archivo"
                  value={`${uploadForm.values.expirationDate}`}
                  onChange={(e) =>
                    uploadForm.setFieldValue(
                      "expirationDate",
                      `${e.target.value}`
                    )
                  }
                  // disabled
                />
                <p className="RecordDetail-form-error">
                  {uploadForm.errors.expirationDate}
                </p>
              </div>
              <button onClick={uploadForm.handleSubmit}>Subir archivo</button>
            </div>
          </div>
          <SearchBar mainFilter={"name"} searchItems={[]} />
          {Array(parseInt(currentRecord.number_of_partners))
            .fill(1)
            .map((i, index) => (
              <>
                <SectionDivision
                  title={`Socio ${index + 1}`}
                  containerStyle={{ paddingLeft: 30 }}
                />

                <ListWrapper>
                  {files?.filter((f) => f.partner === `partner_${index + 1}`)
                    .length == 0 && (
                    <NoDataFound label={"Aún no se ha cargado nigún archivo"} />
                  )}
                  {files
                    ?.filter((f) => f.partner === `partner_${index + 1}`)
                    ?.map((file, key) => (
                      <FileCard
                        key={key}
                        data={file}
                        handleRemove={() => {
                          let choice = window.confirm(
                            "Seguro que quieres eliminar este elemento?"
                          );

                          console.log(choice);
                        }}
                      />
                    ))}
                </ListWrapper>
              </>
            ))}
        </Layout>
      )}
    </React.Fragment>
  );
}

export { RecordDetailScreen };
