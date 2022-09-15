import { apiHost, headers } from "../constants"
// Sales Inquiry
// Get all, create, update, delete
export const fetchSalesInquiries = async () => {
  const apiUrl = `${apiHost}/sales-inquiry`;
  return await fetch(apiUrl)
    .then(response => response.json());
}

// Quotation
// Get all, create, update, delete
export const fetchQuotations = async () => {
  const apiUrl = `${apiHost}/quotations`;
  return await fetch(apiUrl)
    .then(response => response.json());
}

// Suppliers
// Get All
export const fetchSuppliers = async () => {
  const apiUrl = `${apiHost}/shell-organisations`;
  return await fetch(apiUrl)
    .then(response => response.json())
    .then(result => result.filter((el) => el.type === 'supplier'));
}