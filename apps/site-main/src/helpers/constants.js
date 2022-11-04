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
    perc = ((100 - object.utilization) / 100) * 100
  }
  if (type === 'masterlist') { 
    perc = (object.remaining / object.total) * 100;
  }
  // Expand for more use cases

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
  key="delivery-request-management"
  color={subdomain === 'delivery-request-management' ? 'primary' : 'inherit'}
  to="/production/delivery-request-management"
>
  Machines
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
  key="production-request"
  color={subdomain === 'production-request' ? 'primary' : 'inherit'}
  to="/production/production-request"
  >
    Production Request
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

const fulfilmentBreadcrumbs = (subdomain) => [
  <Link
	component={RouterLink}
	underline="hover"
	key="received-sales-inquiry"
	color={subdomain === 'received-sales-inquiry' ? 'primary' : 'inherit'}
	to="/fulfilment/received-sales-inquiry"
  >
	Received Sales Inquiry
  </Link>,
  <Link
	component={RouterLink}
	underline="hover"
	key="sent-quotation"
	color={subdomain === 'sent-quotation' ? 'primary' : 'inherit'}
	to="/fulfilment/sent-quotation"
  >
	Sent Quotation
  </Link>,
  <Link
	component={RouterLink}
	underline="hover"
	key="received-purchase-order"
	color={subdomain === 'received-purchase-order' ? 'primary' : 'inherit'}
	to="/fulfilment/received-purchase-order"
  >
	Received Purchase Order
  </Link>,
  <Link
  component={RouterLink}
  underline="hover"
  key="delivery-request"
  color={subdomain === 'delivery-request' ? 'primary' : 'inherit'}
  to="/fulfilment/delivery-request"
  >
    Delivery Request
  </Link>,
];

const productTypeColorMap = {
  'rawmaterial': 'primary',
  'finalgood': 'secondary',
};
const productTypeStringMap = {
  'rawmaterial': 'Raw Material',
  'finalgood': 'Final Good',
}

const purchaseRequisitionStatusColorMap = {
  'pending': 'draft',
  'processing': 'warning',
  'fulfilled': 'success'
}

const salesInquiryStatusColorMap = {
  // DRAFT = 'draft',
  // SENT = 'sent',
  // COMPLETED = "completed",
  // REPLIED = "replied",
  // REJECTED = "rejected",
  // EXPIRED = 'expired'
  'draft': 'draft',
  'sent': 'warning',
  'completed': 'success',
  'replied': 'primary',
  'rejected': 'error',
  'expired': 'expired'
}
const purchaseOrderStatusColorMap = {
  'pending': 'draft',
  'partiallyfulfilled': 'expired',
  'fulfilled': 'primary',
  'rejected': 'error',
  'accepted': 'success',
  'delivery': 'warning',
  'production': 'expired'
}

const prodOrderStatusColorMap = {
  // CREATED = 'created',
	// AWAITINGPROCUREMENT="awaitingprocurement",
  // READYTORELEASE = 'readytorelease',
  // RELEASED = 'released',
  // ONGOING = 'ongoing',
  // COMPLETED = 'completed',
  // ALLOCATED = 'allocated'
  'created': 'draft',
  'awaitingprocurement': 'expired',
  'readytorelease': 'error',
  'released': 'primary',
  'ongoing': 'warning',
  'completed': 'success',
  'allocated': 'secondary'
}

const prodOrderStatusStringMap = {
  // CREATED = 'created',
	// AWAITINGPROCUREMENT="awaitingprocurement",
  // READYTORELEASE = 'readytorelease',
  // RELEASED = 'released',
  // ONGOING = 'ongoing',
  // COMPLETED = 'completed',
  // ALLOCATED = 'allocated'
  'created': 'Created',
  'awaitingprocurement': 'Awaiting Procurement',
  'readytorelease': 'Ready To Release',
  'released': 'Released',
  'ongoing': 'Ongoing',
  'completed': 'Completed',
  'allocated': 'Allocated'
}

const prodOrderScheduleStatusColorMap = {
  // PLANNED = 'planned',
  // ONGOING = 'ongoing',
  // COMPLETED = 'completed',
  // ALLOCATED= 'allocated',
  'planned': 'draft',
  'ongoing': 'warning',
  'completed': 'primary',
  'allocated': 'secondary'
}

const deliveryRequestStatusStringMap = {
  // READYTODELIVER = "readytodeliver",
  // READYTODELIVERPARTIAL = "readytodeliverpartial",
  // OUTFORDELIVERY = 'outfordelivery',
  // COMPLETED = 'completed',

  'readytodeliver': 'Ready To Deliver',
  'readytodeliverpartial': 'Ready To Deliver Partial',
  'outfordelivery': 'Out For Delivery',
  'completed': 'Completed'
}
  
const deliveryRequestStatusColorMap = {
  // READYTODELIVER = "readytodeliver",
  // READYTODELIVERPARTIAL = "readytodeliverpartial",
  // OUTFORDELIVERY = 'outfordelivery',
  // COMPLETED = 'completed',

  'readytodeliver': 'primary',
  'readytodeliverpartial': 'draft',
  'outfordelivery': 'warning',
  'completed': 'success'
}


export { 
  apiHost, 
  headers, 
  requestOptionsHelper, 
  procurementBreadcrumbs, 
  productionBreadcrumbs,
  fulfilmentBreadcrumbs,
  perc2color,
  productTypeColorMap,
  productTypeStringMap,
  purchaseRequisitionStatusColorMap,
  salesInquiryStatusColorMap,
  purchaseOrderStatusColorMap,
  prodOrderStatusColorMap,
  prodOrderStatusStringMap,
  prodOrderScheduleStatusColorMap,
  deliveryRequestStatusStringMap,
  deliveryRequestStatusColorMap
};
