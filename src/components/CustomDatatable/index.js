import React from "react";
import DataTable from "react-data-table-component";
import { BallTriangle } from "react-loader-spinner";

function CustomDatatable({ columns, data, isLoading }) {
  const styles = {
    boxShadow: "0 0 10px grey",
    color: "blue",
  };
  const dataTableStyles = {
    table: {
      style: {
        // marginTop: 10,
        backgroundColor: "whitesmoke",
      },
    },
    header: {
      style: {
        backgroundColor: "whitesmoke",
      },
    },
    responsiveWrapper: {
      style: {
        borderRadius: 20,
      },
    },
    rows: {
      style: {
        color: "#73738e",
        fontSize: 13,

        // margin: "5px 0",
      },
    },
    headRow: {
      style: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // backgroundColor: "var(--main-bg-color)",
        color: "#364454",

        // fontSize: 14,
        // borderRadius: 20,
        fontSize: 13,
        fontWeight: "bold",
      },
    },

    pagination: {
      style: {
        marginTop: 15,
        borderRadius: 20,
        // boxShadow: "0px 0px 10px var(--container-shadow-color)",
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      className={styles}
      customStyles={dataTableStyles}
      progressPending={isLoading}
      noDataComponent={<p>No se encotraron registros</p>}
      progressComponent={
        <BallTriangle
          height={50}
          width={50}
          radius={5}
          color="var(--text-blue)"
          ariaLabel="ball-triangle-loading"
          wrapperClass={{}}
          wrapperStyle=""
          visible={true}
        />
      }
      pagination
    />
  );
}

export { CustomDatatable };
