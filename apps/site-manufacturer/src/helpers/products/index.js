import { apiHost, headers } from "../constants"

export const fetchProducts = async (type) => {
  const apiUrl = `${apiHost}/${type}`;
  return await fetch(apiUrl).then(response => response.json());
}

export const createProduct = async (type, values) => {
  const apiUrl = `${apiHost}/${type}`;
  const body = JSON.stringify({
    name: values.name,
    description: values.description,
    unit: values.unit,
    unitPrice: values.unitPrice,
    expiry: values.expiry,
  });
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body,
  };

  return await fetch(apiUrl, requestOptions).then(response => response.json());
}

export const updateProduct = async (id, type, values) => { 
  const apiUrl = `${apiHost}/${type}/${id}`;
  const body = JSON.stringify({
    description: values.description,
    unitPrice: values.unitPrice,
    expiry: values.expiry,
  });
  const requestOptions = {
    method: 'PATCH',
    headers: headers,
    body: body,
  };
  return await fetch(apiUrl, requestOptions).then(response => response.json());
}

const deleteProduct = async (type, id) => {
  const apiUrl = `${apiHost}/${type}/${id}`;
  const requestOptions = {
    method: 'DELETE',
  };
  fetch(apiUrl, requestOptions)
}

export const deleteProducts = async (type, ids) => {
  ids.forEach((id) => {
    deleteProduct(type, id);
  });
}
