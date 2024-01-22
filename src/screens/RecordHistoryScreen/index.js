import React from "react";
import { RecordContext } from "../../contexts/RecordContext";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { getRecordsApi } from "../../api/record";
import { getFileTypeApi } from "../../api/fileType";
import { SectionDivision } from "../../components/SectionDivision";
import getLabelName from "../../utils/appLabels";
import { ListWrapper } from "../../components/ListWrapper";
import { NoDataFound } from "../../components/NoDataFound";
import FileCard from "../../components/FileCard";
import { SearchBar } from "../../components/SearchBar";

function RecordHistoryScreen() {
  const [files, setFiles] = React.useState([]);
  const [loadedFile, setLoadedFile] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const { records, setRecords, fileTypes, setFileTypes, fileLimitByUserType } =
    React.useContext(RecordContext);

  const [currentRecord, setCurrentRecord] = React.useState();
  const [itemToDelete, setItemToDelete] = React.useState({});
  const [searchParams, setSearchParams] = React.useState({
    recordYear: parseInt(new Date().getFullYear()) - 1,
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      console.log(
        window.location.pathname?.substring(
          window.location.pathname.lastIndexOf("/") + 1
        )
      );

      try {
        let recordId = window.location.pathname?.slice(
          window.location.pathname.lastIndexOf("/") - 36,
          window.location.pathname.lastIndexOf("/")
        );
        setIsLoading(true);
        const retrievedRecords = await getRecordsApi({
          recordId,
        });

        setCurrentRecord(retrievedRecords.body[0]);
        setIsLoading(false);
        const recordFiles = [];

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
  }, [searchParams, reqToggle, useParams().id]);

  const [searchItems, setSearchItems] = React.useState([
    {
      label: "Año",
      name: "recordYear",
      type: "select",
      active: true,
      options: [
        {
          label: "2023",
          value: "2023",
        },
      ],
    },
    // {
    //   label: "Teléfono",
    //   name: "phoneNumber",
    //   type: "text",
    //   active: false,
    // },
  ]);

  return (
    <div onClick={() => navigate(window.location.pathname)}>
      <TopBar
        backTo={`/records/${useParams().id}`}
        label={`Historico Expendiente ${currentRecord?.record_code}`}
      />
      <SearchBar
        mainFilter={"name"}
        searchItems={searchItems}
        setSearchItems={setSearchItems}
        setSearchParams={setSearchParams}
      />
      {currentRecord?.beneficiaries.map((beneficiary, index) => {
        return (
          <>
            <SectionDivision
              title={`${beneficiary.name}  ---  ${getLabelName(
                beneficiary.beneficiary_type
              )} `}
              containerStyle={{}}
            />

            <ListWrapper>
              {beneficiary.record_files
                ?.filter(
                  (rf) =>
                    rf.created_at?.split("T")[0]?.split("-")[0] ==
                    searchParams.recordYear
                )
                .map((file, key) => (
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
                ))}
            </ListWrapper>
          </>
        );
      })}
    </div>
  );
}

export default RecordHistoryScreen;
