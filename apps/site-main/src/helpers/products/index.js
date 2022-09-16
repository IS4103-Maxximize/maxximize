import { apiHost, headers } from '../constants';

export const fetchProducts = async (type, organisationId) => {
  console.log(organisationId);
  const apiUrl = `${apiHost}/${type}/orgId/${organisationId}`;
  const result = await fetch(apiUrl);

  const products = await result.json();

  return products;
};

export const createProduct = async (type, values, organisationId) => {
  const apiUrl = `${apiHost}/${type}`;
  let body = {
    name: values.name,
    description: values.description,
    unit: values.unit,
    unitPrice: values.unitPrice,
    expiry: values.expiry,
    organisationId: organisationId,
  };

  if (type === 'final-goods') {
    body = {
      ...body,
      lotQuantity: values.lotQuantity,
    };
  }

  body = JSON.stringify(body);

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
  let body = {
    name: values.name,
    description: values.description,
    unit: values.unit,
    unitPrice: values.unitPrice,
    expiry: values.expiry,
  };

  if (type === 'final-goods') {
    body = {
      ...body,
      lotQuantity: values.lotQuantity,
    };
  }

  body = JSON.stringify(body);

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
