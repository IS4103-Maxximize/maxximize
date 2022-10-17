import { apiHost, headers } from '../constants';

export const fetchProductionLines = async (orgId) => {
  const apiUrl = `${apiHost}/production-lines/orgId/${orgId}`;
  return await fetch(apiUrl);
};

export const fetchProductionLine = async (id) => {
  const apiUrl = `${apiHost}/production-lines/${id}`;
  return await fetch(apiUrl).then((response) => response.json());
};
  
export const createProductionLine = async (createProductionLineDto) => {
  const apiUrl = `${apiHost}/production-lines`;
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(createProductionLineDto),
  };
  return await fetch(apiUrl, requestOptions).then((response) =>
    response.json()
  );
};
  
export const updateProductionLine = async (productionLineId, updateProductionLineDto) => {
  const apiUrl = `${apiHost}/production-lines/${productionLineId}`;  
  const requestOptions = {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(updateProductionLineDto),
  };
  return await fetch(apiUrl, requestOptions).then((response) =>
    response.json()
  );
};

export const deleteProductionLine = async (id) => {
  const apiUrl = `${apiHost}/production-lines/${id}`;
  const requestOptions = {
    method: 'DELETE',
  };
  fetch(apiUrl, requestOptions);
};
  
export const deleteProductionLines = async (ids) => {
  ids.forEach((id) => {
    deleteProductionLine(id);
  });
};

export const fetchMachines = async (orgId) => {
  const apiUrl = `${apiHost}/factory-machines/orgId/${orgId}`;
  return await fetch(apiUrl).then((response) => response.json());
};
  
export const fetchMachine = async (id) => {
  const apiUrl = `${apiHost}/factory-machines/${id}`;
  return await fetch(apiUrl).then((response) => response.json());
};

export const createMachine = async (values) => {
  const apiUrl = `${apiHost}/factory-machines`;
  const body = JSON.stringify({
    serialNumber: values.serialNumber,
    description: values.description,
    make: values.make,
    model: values.model,
    year: values.year,
    lastServiced: values.lastServiced,
    remarks: values.remarks,
    status: values.isOperating
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

export const updateProductionLineMachines = async (id,productionLineId) => {
  const apiUrl = `${apiHost}/factory-machines/${id}`;
  let body = {
    productionLineId: productionLineId,
  };
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

export const updateMachine = async (id, values) => {
  const apiUrl = `${apiHost}/factory-machines/${id}`;
  let body = {
    serialNumber: values.serialNumber,
    description: values.description,
    make: values.make,
    model: values.model,
    year: values.year,
    lastServiced: values.lastServiced,
    remarks: values.remarks,
    status: values.isOperating,
  };

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
  
export const deleteMachine = async (id) => {
  const apiUrl = `${apiHost}/factory-machines/${id}`;
  const requestOptions = {
    method: 'DELETE',
  };
  fetch(apiUrl, requestOptions);
};

export const deleteMachines = async (ids) => {
  ids.forEach((id) => {
    deleteMachine(id);
  });
};

export const fetchFinalGood = async () => {
  const apiUrl = `${apiHost}/final-goods`;
  const result = await fetch(apiUrl);

  const products = await result.json();

  return products;
};

export const fetchUtilizationRates = async (prodLineId) => {
  const apiUrl = `${apiHost}/production-lines/utilizationRates/${prodLineId}`;
  return await fetch(apiUrl).then(response => response.json());
};
