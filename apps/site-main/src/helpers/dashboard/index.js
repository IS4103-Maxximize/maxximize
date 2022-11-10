
import { apiHost } from '../constants';

export const fetchRevenues = async (orgId) => {
    const apiUrl = `${apiHost}/revenues/orgId/${orgId}`;
    return await fetch(apiUrl).then((response) => response.json());
  };

export const fetchCosts = async (orgId) => {
    const apiUrl = `${apiHost}/costs/orgId/${orgId}`;
    return await fetch(apiUrl).then((response) => response.json());
  };

export const fetchSales = async (orgId) => {
    const apiUrl = `${apiHost}/sales/orgId/${orgId}`;
    return await fetch(apiUrl).then((response) => response.json());
  };

export const fetchProfits = async (orgId) => {
    const apiUrl = `${apiHost}/profits/orgId/${orgId}`;
    return await fetch(apiUrl).then((response) => response.json());
  };


//costs breakdown api calls

export const fetchCostBreakdown = async (orgId, type) => {
  const apiUrl = `${apiHost}/${type}/${orgId}`;
  return await fetch(apiUrl).then((response) => response.json()
  );
};
