import { request } from "../utils/network";

async function getFileTypeApi({ queryParams }) {
  try {
    const fileType = await request({
      path: "/file-type",
      customParams: queryParams,
    });

    return fileType;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createFileTypeApi(data) {
  try {
    const customers = await request({
      path: "/file-type",
      method: "POST",
      data: data,
    });

    return customers;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateFileTypeApi(data, fileTypeId) {
  try {
    const fileType = await request({
      path: `/file-type/${fileTypeId}`,
      method: "PUT",
      data: data,
    });

    return fileType;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getCustomerFileType({ queryParams }) {
  try {
    const fileType = await request({
      path: "/file-type",
      customParams: queryParams,
    });

    return fileType;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createCustomerFileType(data) {
  try {
    const customers = await request({
      path: "/file-type",
      method: "POST",
      data: data,
    });

    return customers;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { getFileTypeApi, createFileTypeApi, updateFileTypeApi };
