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

export { getFileTypeApi, createFileTypeApi };
