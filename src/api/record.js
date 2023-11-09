import { request } from "../utils/network";

async function getRecordsApi(queryParams) {
  try {
    const records = await request({
      path: "/record",
      customParams: queryParams,
    });

    return records;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createRecordApi(data) {
  try {
    const records = await request({
      method: "POST",
      path: "/record",
      data: data,
    });

    return records;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { createRecordApi, getRecordsApi };
