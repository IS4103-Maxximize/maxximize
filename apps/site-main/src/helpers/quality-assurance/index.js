import { apiHost } from "../constants";

export const fetchBatchTracking = async (batchNumber) => {
  const url = `${apiHost}/batches/batchTracking/${batchNumber}`;
  return await fetch(url).then(response => response.json());
};
