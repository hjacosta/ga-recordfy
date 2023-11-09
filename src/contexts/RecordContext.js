import React from "react";
import { getRecordsApi } from "../api/record";
import { getFileTypeApi } from "../api/fileType";

const RecordContext = React.createContext({});

function RecordProvider({ children }) {
  const [records, setRecords] = React.useState([]);
  const [fileTypes, setFileTypes] = React.useState([]);

  const fileLimitByUserType = [
    {
      name: "Normal",
      limit: 5,
    },
    {
      name: "PEP",
      limit: 5,
    },
  ];

  return (
    <RecordContext.Provider
      value={{
        records,
        setRecords,
        fileTypes,
        setFileTypes,
        fileLimitByUserType,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
}

export { RecordContext, RecordProvider };
