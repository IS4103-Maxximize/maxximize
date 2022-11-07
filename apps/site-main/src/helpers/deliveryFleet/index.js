import { apiHost, headers } from '../constants';

export const fetchVehicles = async (orgId) => {
    const apiUrl = `${apiHost}/vehicles/orgId/${orgId}`;
    return await fetch(apiUrl);
  };

  export const fetchVehicle = async (id) => {
    const apiUrl = `${apiHost}/vehicles/${id}`;
    return await fetch(apiUrl).then((response) => response.json());
  };

export const createVehicle = async (createVehicleDto) => {
    const apiUrl = `${apiHost}/vehicles`;
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(createVehicleDto),
    };
    return await fetch(apiUrl, requestOptions).then((response) =>
      response.json()
    );
  };
  
  export const updateVehicle = async (vehicleId, updateVehicleDto) => {
    const apiUrl = `${apiHost}/vehicles/${vehicleId}`;  
    const requestOptions = {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(updateVehicleDto),
    };
    return await fetch(apiUrl, requestOptions).then((response) =>
      response.json()
    );
  };

  export const deleteVehicle = async (id) => {
    const apiUrl = `${apiHost}/vehicles/${id}`;
    const requestOptions = {
      method: 'DELETE',
    };
    fetch(apiUrl, requestOptions);
  };
  
  export const deleteVehicles = async (ids) => {
    ids.forEach((id) => {
        deleteVehicle(id);
    });
  };
