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

export { getRecordsApi };
