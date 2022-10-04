import { apiHost, headers } from '../constants';

export const fetchProducts = async (type, organisationId) => {
  let apiUrl;
  if (type) {
    apiUrl = `${apiHost}/${type}/orgId/${organisationId}`;
  }
  if (!type) {
    apiUrl = `${apiHost}/products/all/${organisationId}`;
  }
  return fetch(apiUrl).then((response) => response.json());
};

export const createProduct = async (type, values, organisationId) => {
  const apiUrl = `${apiHost}/${type}`;
  const body = JSON.stringify({
    name: values.name,
    description: values.description,
    unit: values.unit,
    unitPrice: values.unitPrice,
    expiry: values.expiry,
    organisationId: organisationId,
    lotQuantity: values.lotQuantity,
  });
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body,
  };
  return await fetch(apiUrl, requestOptions).then((response) =>
    response.json()
  );
};

export const updateProduct = async (id, type, values) => {
  const apiUrl = `${apiHost}/${type}/${id}`;
  const body = JSON.stringify({
    name: values.name,
    description: values.description,
    unit: values.unit,
    unitPrice: values.unitPrice,
    expiry: values.expiry,
    lotQuantity: values.lotQuantity,
  });
  const requestOptions = {
    method: 'PATCH',
    headers: headers,
    body: body,
  };
  return await fetch(apiUrl, requestOptions).then((response) =>
    response.json()
  );
};

const deleteProduct = async (type, id) => {
  const apiUrl = `${apiHost}/${type}/${id}`;
  const requestOptions = {
    method: 'DELETE',
  };
  fetch(apiUrl, requestOptions);
};

export const deleteProducts = async (type, ids) => {
  ids.forEach((id) => {
    deleteProduct(type, id);
  });
};
