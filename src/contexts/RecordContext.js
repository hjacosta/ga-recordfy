import React from "react";

const RecordContext = React.createContext({});

function RecordProvider({ children }) {
  const [records, setRecords] = React.useState([]);

  return (
    <RecordContext.Provider
      value={{
        records,
        setRecords,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
}

export { RecordContext, RecordProvider };
