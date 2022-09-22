// API Calls for Purchase Orders
import { apiHost, headers } from "../constants";

const apiUrl = `${apiHost}/purchase-orders`;

const requestOptionsHelper = (method, body) => {
  return {
    method: method,
    headers: headers,
    body: body,
  }
}


export const fetchWarehouses = async (orgId) => {
  const url = `${apiHost}/warehouses/all/${orgId}`;
  return await fetch(url).then((response) => response.json());
}

export const fetchPurchaseOrders = async (orgId) => {
  return await fetch(`${apiUrl}/all/${orgId}`).then((response) => response.json());
}

export const createPurchaseOrder = async (values, lineItems) => {
  // console.log(values)
  // console.log(lineItems)

  const {
    deliveryAddress,
    totalPrice,
    deliveryDate,
    currentOrganisationId,
    quotationId,
    userContactId,
    ...rest
  } = values

  const poLineItemDtos = [...lineItems];

  const body = JSON.stringify({
    deliveryAddress: deliveryAddress,
    totalPrice: totalPrice,
    deliveryDate: deliveryDate,
    currentOrganisationId: currentOrganisationId,
    quotationId: quotationId,
    userContactId: userContactId,
    poLineItemDtos: poLineItemDtos,
  });

  const requestOptions = requestOptionsHelper('POST', body);

  return await fetch(apiUrl, requestOptions).then((response) => response.json());
}

const deletePurchaseOrder = async (id) => {
  fetch(`${apiUrl}/${id}`, {method: 'DELETE'});
}

export const deletePurchaseOrders = async (ids) => {
  ids.forEach((id) => {
    deletePurchaseOrder(id);
  });
}
