import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { removeRecordFileApi } from "../../api/recordFile";
import { ConfirmModal } from "../../components/ConfirmModal";

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
    recordYear: 0,
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
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

  const getVisibleYears = () => {
    let currentYear = parseInt(new Date().getFullYear());
    let rangeLimit = currentYear - 10;

    let years = [];

    while (currentYear > rangeLimit) {
      if (currentYear >= 2023) {
        years.push(currentYear);
      }
      currentYear -= 1;
    }
    return years;
  };

  const [searchItems, setSearchItems] = React.useState([
    {
      label: "Año",
      name: "recordYear",
      type: "select",
      active: true,
      options: [
        {
          label: "Todos",
          value: 0,
        },
        ...getVisibleYears().map((year) => ({
          label: year,
          value: year,
        })),
      ],
    },
    // {
    //   label: "Teléfono",
    //   name: "phoneNumber",
    //   type: "text",
    //   active: false,
    // },
  ]);

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
      {getVisibleYears()
        .filter((item) =>
          searchParams.recordYear == 0
            ? item == item
            : item == searchParams.recordYear
        )
        .map((year, index) => (
          <Accordion className="CustomAcordion-section">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="CustomAcordion-section-title ">
                {year}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                            rf.created_at?.split("T")[0]?.split("-")[0] == year
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
            </AccordionDetails>
          </Accordion>
        ))}
      {/* {currentRecord?.beneficiaries.map((beneficiary, index) => {
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
      })} */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        confirmFunction={handleDelete}
        modalType={"DELETE"}
        deleteParams={itemToDelete}
      />
    </div>
  );
}

export default RecordHistoryScreen;
