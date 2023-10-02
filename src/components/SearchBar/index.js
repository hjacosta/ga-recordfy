import React from "react";
import "./index.css";
import { MdSearch, MdFilterListAlt } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import Popover from "@mui/material/Popover";
import { useFormik } from "formik";

function getInitialValues(arr, mainFilter) {
  let initialValues = {};

  arr.forEach((item) => {
    if (item.type != "text") {
      initialValues[item.name] = item.options[0]?.value;
    } else {
      initialValues[item.name] = "";
    }
  });

  initialValues[mainFilter] = "";

  return initialValues;
}

function SearchBar({
  searchItems,
  setSearchItems,
  mainFilter,
  placeholder,
  setSearchParams,
  searchTimeOut,
  addButton,
  addFormVisible,
  searchButton,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const searchForm = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(searchItems, mainFilter),
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      let data = {};

      Object.entries(values).map((value) => {
        data[value[0]] = value[1];
      });

      console.log(searchForm.initialValues);

      setSearchParams(data);
      // resetForm();
    },
  });

  React.useEffect(() => {
    const delayInput = setTimeout(() => {
      //console.log(searchForm.values);

      searchForm.handleSubmit();
    }, searchTimeOut || 1000);

    return () => clearTimeout(delayInput);
  }, [searchForm.values[mainFilter]]);

  const enableFilter = (fieldName) => {
    const arr = [...searchItems];

    arr.forEach((filter) => {
      if (filter.name === fieldName) {
        filter.active = !filter.active;
      }
    });

    setSearchItems(arr);
  };

  return (
    <div className="search-bar">
      <div className="search-bar-group first-group">
        <label>¿Qué estás buscando?</label>
        <input
          className="search-bar-input"
          type="search"
          value={searchForm.values[mainFilter]}
          onChange={(e) => searchForm.setFieldValue(mainFilter, e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {searchItems
        .filter((item) => item.active === true)
        .filter((item) => item.type == "select")
        .map((item, index) => (
          <div key={index} className="search-bar-group">
            <label>{item.label}</label>
            <select
              className="search-bar-input"
              onChange={(e) =>
                searchForm.setFieldValue(item.name, e.target.value)
              }
              value={searchForm.values[item.name]}
            >
              {item.options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

      {searchItems
        .filter((item) => item.active === true)
        .filter((item) => item.type == "text")
        .map((item, index) => (
          <div key={index} className="search-bar-group">
            <label>{item.label}</label>
            <input
              className="search-bar-input"
              type="search"
              placeholder={`${item.label}`}
              value={searchForm.values[item.name]}
              onChange={(e) =>
                searchForm.setFieldValue(item.name, e.target.value)
              }
            />
          </div>
        ))}

      <div
        className=""
        style={{
          display: "flex",
          paddingTop: 12,
          alignItems: "center",
          marginRight: 12,
          marginLeft: 4,
        }}
      >
        <button
          className="search-bar-input"
          onClick={() => {
            searchForm.handleSubmit();
          }}
        >
          {" "}
          Buscar{" "}
          <MdSearch
            style={{ float: "right", marginTop: 2, marginLeft: 8 }}
            size={15}
          />
        </button>
        <MdFilterListAlt
          title="Mas filtros"
          size={20}
          style={{ marginLeft: 16, cursor: "pointer" }}
          aria-describedby={"filter-pop"}
          variant="contained"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        />
        <Popover
          id={"filter-pop"}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <ul className="search-bar-filter-list">
            {searchItems?.map((filter, index) => (
              <li className="search-bar-filter-list-item" key={index}>
                <span>{filter.label}</span>
                <input
                  type="checkbox"
                  onChange={() => {
                    enableFilter(filter.name);
                  }}
                  checked={filter.active === true ? true : false}
                />
              </li>
            ))}
          </ul>
        </Popover>
      </div>
      <div className="search-bar-group">
        <button
          style={{
            backgroundColor: addFormVisible && "#bd443b",
            color: addFormVisible && "#fff",
          }}
          className="search-bar-input"
          onClick={() => {
            addButton.onClick();
          }}
        >
          {" "}
          {!addFormVisible ? addButton?.label || "Add" : "Cerrar"}{" "}
          {/* {!addFormVisible && (
            <AiOutlinePlus style={{ float: "right", marginTop: 2 }} size={15} />
          )} */}
        </button>
      </div>
    </div>
  );
}

export { SearchBar };
