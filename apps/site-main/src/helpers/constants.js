import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const apiPort = 3000;
const apiHost = `http://localhost:${apiPort}/api`;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const requestOptionsHelper = (method, body) => {
  return {
    method: method,
    headers: headers,
    body: body,
  };
};

const procurementBreadcrumbs = (subdomain) => [
  <Link
    component={RouterLink}
    underline="hover"
    key="purchase-requisition"
    color={subdomain === 'purchase-requisition' ? 'primary' : 'inherit'}
    to="/procurement/purchase-requisition"
  >
    Purchase Requisition
  </Link>,
  <Link
    component={RouterLink}
    underline="hover"
    key="sales-inquiry"
    color={subdomain === 'sales-inquiry' ? 'primary' : 'inherit'}
    to="/procurement/sales-inquiry"
  >
    Sales Inquiry
  </Link>,
  <Link
    component={RouterLink}
    underline="hover"
    key="quotation"
    color={subdomain === 'quotation' ? 'primary' : 'inherit'}
    to="/procurement/quotation"
  >
    Quotation
  </Link>,
  <Link
    component={RouterLink}
    underline="hover"
    key="purchase-order"
    color={subdomain === 'purchase-order' ? 'primary' : 'inherit'}
    to="/procurement/purchase-order"
  >
    Purchase Order
  </Link>,
  <Link
    component={RouterLink}
    underline="hover"
    key="goods-receipt"
    color={subdomain === 'goods-receipt' ? 'primary' : 'inherit'}
    to="/procurement/goods-receipt"
  >
    Goods Receipt
  </Link>,
];

export { apiHost, headers, requestOptionsHelper, procurementBreadcrumbs };
