import { apiHost, headers } from "./constants";

const apiUrl = `${apiHost}/bill-of-materials`;

const requestOptionsHelper = (method, body) => {
  return {
    method: method,
    headers: headers,
    body: body,
  }
}

export const fetchBOMs = async (orgId) => {
  const url = `${apiUrl}/all/${orgId}`;
  return await fetch(url).then((response) => response.json());
}

export const createBOM = async (finalGoodId, bomLineItems) => {
  const bomLineItemDtos = [...bomLineItems];

  const body = JSON.stringify({
    finalGoodId: finalGoodId,
    bomLineItemDtos: bomLineItemDtos,
  })

  const requestOptions = requestOptionsHelper('POST', body);

  return await fetch(apiUrl, requestOptions).then((response) => response.json());
}

const deleteBOM = async (id) => {
  fetch(`${apiUrl}/${id}`, {method: 'DELETE'});
}

export const deleteBOMs = async (ids) => {
  ids.forEach((id) => {
    deleteBOM(id);
  });
}

export const updateBomLineItem = async (id, lineItem) => {
  const url = `${apiHost}/bom-line-items/${id}`;

  const body = JSON.stringify({
    quantity: lineItem.quantity,
  });
  const requestOptions = requestOptionsHelper('PATCH', body);

  return await fetch(url, requestOptions).then((response) => response.json());
}
