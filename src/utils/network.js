import { serverURL } from "../utils/constants";

async function request({ path, method, data, customParams, isFormData }) {
  let options = {};
  if (!method) method = "GET";
  let token = JSON.parse(sessionStorage.getItem("session"))?.token;

  let headers = {};
  if (!isFormData) {
    headers = {
      "Content-Type": "application/json",
    };
  }

  try {
    switch (method) {
      case "POST":
        options = {
          method,
          headers: {
            ...headers,
            Authorization: `${token}`,
          },
          body: !isFormData ? JSON.stringify(data) : data,
        };

        break;
      case "PUT":
        options = {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(data),
        };
        break;
      case "DELETE":
        options = {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(data),
        };
        break;
      default:
        options = {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        break;
    }

    let entry;
    let queryParams = "";
    let key, value;

    if (customParams) {
      for (entry of Object.entries(customParams)) {
        key = entry[0];
        value = entry[1];
        queryParams += `${key}=${value}&`;
      }
    }

    let url = `${serverURL}${path}?${queryParams}`;

    const res = await fetch(url, options);
    const result = await res.json();

    if (result.error === true) {
      throw new Error(result.body);
    }

    return result;
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export { request };
