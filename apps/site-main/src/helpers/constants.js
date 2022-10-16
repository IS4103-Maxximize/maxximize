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

// License: MIT - https://opensource.org/licenses/MIT
  // Author: Michele Locati <michele@locati.it>
  // Source: https://gist.github.com/mlocati/7210513
  //Edited for darker shade, better constrast
const perc2color = (type, object) => {
  let perc

  // perc = ((object.max - object.current) / object.max) * 100
  if (type === 'bin') {
    perc = ((object.volumetricSpace - object.currentCapacity) / object.volumetricSpace) * 100;
  }
  if (type === 'production-line') {
    //
  }

  let r,
    g,
    b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  let h = r * 0x10000 + g * 0x100 + b * 0x1;
  h = h.toString(16);

  let newString = '';

  for (let i = 0; i < h.length; i++) {
    if (i % 2 != 0) {
      newString += '0';
    } else {
      newString += h.charAt(i);
    }
  }

  return '#' + ('000000' + newString).slice(-6);
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

const productionBreadcrumbs = (subdomain) => [
  <Link
    component={RouterLink}
    underline="hover"
    key="bill-of-material"
    color={subdomain === 'bill-of-material' ? 'primary' : 'inherit'}
    to="/production/bill-of-material"
  >
    Bill Of Material
  </Link>,
  <Link
    component={RouterLink}
    underline="hover"
    key="machine"
    color={subdomain === 'machine' ? 'primary' : 'inherit'}
    to="/production/machine"
  >
    Machines
  </Link>,
  <Link
    component={RouterLink}
    underline="hover"
    key="production-line"
    color={subdomain === 'production-line' ? 'primary' : 'inherit'}
    to="/production/production-line"
  >
    Production Line
  </Link>,
  <Link
    component={RouterLink}
    underline="hover"
    key="production-order"
    color={subdomain === 'production-order' ? 'primary' : 'inherit'}
    to="/production/production-order"
  >
    Production Order
  </Link>,
];

export { 
  apiHost, 
  headers, 
  requestOptionsHelper, 
  procurementBreadcrumbs, 
  productionBreadcrumbs,
  perc2color
};
