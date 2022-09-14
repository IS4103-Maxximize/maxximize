import { apiHost, headers } from "../constants"
// Sales Inquiry
// Get all, create, update, delete

// SI Line Items
// Create, update, delete

// Suppliers
// Get All
export const fetchSuppliers = async () => {
  const apiUrl = `${apiHost}/shell-organisations`;
  return await fetch(apiUrl)
    .then(response => response.json())
    .then(result => result.filter((el) => el.type === 'supplier'));
}