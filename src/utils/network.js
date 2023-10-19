import { serverURL } from "../utils/constants";

async function request({ path, method, data, customParams }) {
  let options = {};
  if (!method) method = "GET";
  let token = JSON.parse(sessionStorage.getItem("session"))?.token;

  try {
    switch (method) {
      case "POST":
        options = {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(data),
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

    // console.log("URL", url);
    const res = await fetch(url, options);
    const result = await res.json();

    if (result.error === true) {
      if (result.body.includes("not found") == false) {
        throw new Error(result.body);
      }
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { request };
