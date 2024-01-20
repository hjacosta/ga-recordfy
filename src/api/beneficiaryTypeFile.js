import { request } from "../utils/network";

async function getBeneficiaryTypeFileApi({ queryParams }) {
  try {
    const beneficiaryTypeFile = await request({
      path: "/beneficiary-type-file",
      customParams: queryParams,
    });

    return beneficiaryTypeFile;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createBeneficiaryTypeFileApi(data) {
  try {
    const customers = await request({
      path: "/beneficiary-type-file",
      method: "POST",
      data: data,
    });

    return customers;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { getBeneficiaryTypeFileApi, createBeneficiaryTypeFileApi };
