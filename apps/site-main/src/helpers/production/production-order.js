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

export const fetchProdOrder = async (id) => {
  const url = `${apiUrl}/${id}`;
  return await fetch(url).then(response => response.json());
}

export const allocateSchedule = async (allocateScheduleDto) => {
  const url = `${apiHost}/schedules/allocate`;
  const body = JSON.stringify(allocateScheduleDto)
  const requestOptions = requestOptionsHelper('POST', body);

  return await fetch(url, requestOptions).then(response => response.json());
}
