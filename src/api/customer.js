import { request } from "../utils/network";

async function getCustomersApi({ queryParams }) {
  try {
    const customers = await request({
      path: "/customer",
      customParams: queryParams,
    });

    return customers;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createCustomerApi(data) {
  try {
    const customers = await request({
      path: "/customer",
      method: "POST",
      data: data,
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function updateCustomerApi(data, customerId) {
  try {
    const customers = await request({
      path: `/customer/${customerId}`,
      method: "PUT",
      data: data,
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function removeCustomerApi(customerId) {
  try {
    const customers = await request({
      path: `/customer/${customerId}`,
      method: "DELETE",
      data: {},
    });

    return customers;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getCustomerTypeApi({ queryParams }) {
  try {
    const customerTypes = await request({
      path: "/customer-type",
      customParams: queryParams,
    });

    return customerTypes;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createCustomerTypeApi(data) {
  try {
    const customerTypes = await request({
      path: "/customer-type",
      method: "POST",
      data: data,
    });

    return customerTypes;
  } catch (error) {
    throw new Error(error.message);
  }
}

export {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  removeCustomerApi,
  getCustomerTypeApi,
  createCustomerTypeApi,
};
