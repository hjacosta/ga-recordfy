import { request } from "../utils/network";

async function getRecordFilesApi(queryParams) {
  try {
    const records = await request({
      path: "/record-file",
      customParams: queryParams,
    });

    return records;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function uploadRecordFileApi(data) {
  console.log(data);
  const formData = new FormData();

  formData.append("name", data.filename);
  formData.append("recordId", data.recordId);
  formData.append("expirationDate", data.expirationDate);
  formData.append("beneficiaryId", data.beneficiaryId);
  formData.append("fileTypeId", data.fileTypeId);
  formData.append("lastModifiedBy", data.lastModifiedBy);
  formData.append("createdBy", data.createdBy);
  formData.append("identification", data.customerIdentification);
  formData.append("file", data.file);

  try {
    const recordFile = await request({
      path: "/record-file/upload",
      method: "POST",
      data: formData,
      isFormData: true,
    });

    return recordFile;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function removeRecordFileApi(queryParams) {
  try {
    const deleted = await request({
      method: "DELETE",
      path: "/record-file",
      customParams: queryParams,
    });

    return deleted;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { getRecordFilesApi, uploadRecordFileApi, removeRecordFileApi };
