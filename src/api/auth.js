import { serverURL } from "../utils/constants";

async function signupApi(data) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  try {
    const res = await fetch(`${serverURL}/auth/signup`, options);
    const result = res.json();

    if (result.error) {
      throw new Error(result.body);
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function loginApi({ username, password }) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  try {
    const res = await fetch(`${serverURL}/auth/signin`, options);

    const result = await res.json();
    console.log(result);
    if (result.error) {
      throw new Error(result.body);
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { signupApi, loginApi };
