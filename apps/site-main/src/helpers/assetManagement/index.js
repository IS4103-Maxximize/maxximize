import { apiHost, headers } from '../constants';

export const fetchProductionLines = async () => {
    const apiUrl = `${apiHost}/production-line`;
    return await fetch(apiUrl).then((response) => response.json());
  };

/*const createProductionLineMachines = async (productionLineId, machines) => {
    const apiUrl = `${apiHost}/factory-machines`;
  
    const createPromises = machines.map(async (item) => {
      let body = {
        serialNumber: item.serialNumber,
        productionLineId: productionLineId,
      };
      body = JSON.stringify(body);
      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
      };
      return fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .catch((err) => {
          throw new Error(err);
        });
    });
  
    return await Promise.all(createPromises).catch((err) => {
      throw new Error(err);
    });
  };

  const createProductionLineSchedules = async (productionLineId, schedules) => {
    const apiUrl = `${apiHost}/schedules`;
  
    const createPromises = schedules.map(async (item) => {
      let body = {
        start: item.start,
        end: item.end,
        status: item.status,
        productionLineId: productionLineId,
      };
      body = JSON.stringify(body);
      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
      };
      return fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .catch((err) => {
          throw new Error(err);
        });
    });
  
    return await Promise.all(createPromises).catch((err) => {
      throw new Error(err);
    });
  };
*/

export const createProductionLine = async (
    productionLineId,
    values,
  ) => {
    const apiUrl = `${apiHost}/production-line`;
    let body = {
      productionLineId: productionLineId,
      name: values.name,
      description: values.description,
      finalGoodId: values.finalGoodId,
      productionCostPerLot: values.productionCostPerLot,
      changeOverTime: values.changeOverTime
    };
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
  
  export const updateProductionLine = async (values, productionLineId) => {
  
    const apiUrl = `${apiHost}/production-line/${productionLineId}`;
    let body = {
      nextAvailableDateTime: values.nextAvailableDateTime,
      isAvailable: values.isAvailable,
      lastStopped: values.lastStopped
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

  const deleteProductionLine = async (id) => {
    const apiUrl = `${apiHost}/production-line/${id}`;
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

  export const fetchMachines = async () => {
      const apiUrl = `${apiHost}/factory-machine`;
      return await fetch(apiUrl).then((response) => response.json());
    };
    
    const fetchMachine = async (id) => {
      const apiUrl = `${apiHost}/factory-machine/${id}`;
      return await fetch(apiUrl).then((response) => response.json());
    };

    const createProductionLineMachines = async ( productionLines) => {
      const apiUrl = `${apiHost}/factory-machine`;
    
      const createPromises =productionLines.map(async (item) => {
        let body = {
          productionLineId: item.id,
        };
        body = JSON.stringify(body);
        const requestOptions = {
          method: 'POST',
          headers: headers,
          body: body,
        };
        return fetch(apiUrl, requestOptions)
          .then((response) => response.json())
          .catch((err) => {
            throw new Error(err);
          });
      });
    
      return await Promise.all(createPromises).catch((err) => {
        throw new Error(err);
      });
    };

    export const createMachine = async (values, productionLines) => {
      const apiUrl = `${apiHost}/factory-machine`;
      let body = {
        serialNumber: values.serialNumber,
        description: values.description,
        make: values.make,
        model: values.model,
        year: values.year,
        lastServiced: values.lastServiced,
        remarks: values.remarks,
        status: values.isOperating
      };
    
      console.log(body);
      body = JSON.stringify(body);
      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
      };
      const machine = await fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .catch((err) => {
          throw new Error(err);
        });
    
      const createdProductionLines = await createProductionLineMachines(
        machine.id,
        productionLines
      );

      const updatedMachine = await fetchMachine(machine.id);
      console.log(updatedMachine);
      return updatedMachine;
    };

    export const updateProductionLineMachines = async (id,productionLineId) => {
      const apiUrl = `${apiHost}/factory-machine/${id}`;
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

    export const updateMachine = async (id,values,productionLineId) => {
      const apiUrl = `${apiHost}/factory-machine/${id}`;
      let body = {
        serialNumber: values.serialNumber,
        description: values.description,
        make: values.make,
        model: values.model,
        year: values.year,
        lastServiced: values.lastServiced,
        remarks: values.remarks,
        status: values.isOperating,
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
    
    const deleteMachine = async (id) => {
      const apiUrl = `${apiHost}/factory-machine/${id}`;
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

    export const fetchSchedule = async (productionLineId) => {
      console.log(productionLineId);
      const apiUrl = `${apiHost}/schedules/${productionLineId}`;
      const result = await fetch(apiUrl);
    
      const schedules = await result.json();
    
      return schedules;
    };

    export const fetchFinalGood = async (organisationId) => {
      console.log(organisationId);
      const apiUrl = `${apiHost}/final-goods/orgId/${organisationId}`;
      const result = await fetch(apiUrl);
    
      const products = await result.json();
    
      return products;
    };