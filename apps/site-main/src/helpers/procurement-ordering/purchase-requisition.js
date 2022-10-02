import { apiHost, requestOptionsHelper } from "../constants";

const apiUrl = `${apiHost}/purchase-requisitions`;

export const fetchPurchaseRequistions = async (orgId) => {
  return await fetch(`${apiUrl}/orgId/${orgId}`).then(res => res.json());
}

const createPurchaseRequisition = async (purchaseRequisitionDto) => {
  const body = JSON.stringify(purchaseRequisitionDto);
  const requestOptions = requestOptionsHelper('POST', body);

  return await fetch(apiUrl, requestOptions).then(res => res.json());
}

export const createPurchaseRequisitions = async (purchaseRequisitionsDtos) => {
  purchaseRequisitionsDtos.forEach(async (dto) => {
    await createPurchaseRequisition(dto);
  });
}

export const createSalesInquiryFromPurchaseRequisition = async (createSalesInquiryDto) => {
  const body = JSON.stringify(createSalesInquiryDto);
  const requestOptions = requestOptionsHelper('POST', body);

  return await fetch(`${apiHost}/sales-inquiry`, requestOptions).then(res => res.json());
}
