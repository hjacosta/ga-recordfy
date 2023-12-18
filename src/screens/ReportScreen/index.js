import React from "react";
import Layout from "../../components/Layout";
import { TopBar } from "../../components/TopBar";
import { SearchBar } from "../../components/SearchBar";
import { CustomDatatable } from "../../components/CustomDatatable";

function ReportScreen() {
  let conlumns = [
    {
      name: "",
    },
  ];

  return (
    <>
      <TopBar label="Reportes" />
      <Layout>
        <SearchBar
          mainLabel={"Búsqueda por nombre"}
          mainFilter={"firstName"}
          searchItems={[]}
          setSearchItems={() => {}}
          setSearchParams={""}
        />
        <CustomDatatable data={[]} />
      </Layout>
    </>
  );
}

export { ReportScreen };
