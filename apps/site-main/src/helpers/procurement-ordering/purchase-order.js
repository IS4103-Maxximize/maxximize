// API Calls for Purchase Orders

import { apiHost, headers } from "../constants";

const apiUrl = `${apiHost}/purchase-orders`;

const requestOptions = (method, body) => {
  return {
    method: method,
    headers: headers,
    body: body,
  }
}