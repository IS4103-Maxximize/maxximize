import { apiHost, headers } from "../constants";

const apiUrl = `${apiHost}/production-orders`;

const requestOptionsHelper = (method, body) => {
  return {
    method: method,
    headers: headers,
    body: body,
  }
}

export const fetchProdOrders = async (orgId) => {
  const url = `${apiUrl}/all/${orgId}`;
  return await fetch(url).then((response) => response.json());
}
