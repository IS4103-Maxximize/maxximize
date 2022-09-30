import { apiHost, requestOptionsHelper } from "../constants";

const apiUrl = `${apiHost}/purchase-requistions`;

export const fetchPurchaseRequistions = async (orgId) => {
  return await fetch(`${apiUrl}/orgId/${orgId}`).then(res => res.json());
}

export const createSalesInquiryFromPurchaseRequisition = async (createSalesInquiryDto) => {
  const body = JSON.stringify(createSalesInquiryDto);
  const requestOptions = requestOptionsHelper('POST', body);

  return await fetch(apiUrl, requestOptions).then(res => res.json());
}
