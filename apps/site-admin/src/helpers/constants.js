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
  let perc;

  // perc = ((object.max - object.current) / object.max) * 100
  if (type === 'bin') {
    perc =
      ((object.volumetricSpace - object.currentCapacity) /
        object.volumetricSpace) *
      100;
  }
  if (type === 'production-line') {
    perc = ((100 - object.utilization) / 100) * 100;
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

const clientBreadcrumbs = (subdomain) => [
  <Link
    component={RouterLink}
    underline="hover"
    key="application"
    color={subdomain === 'application' ? 'primary' : 'inherit'}
    to="/client/application"
  >
    Application
  </Link>,
  <Link
    component={RouterLink}
    underline="hover"
    key="organisation-management"
    color={subdomain === 'organisation-management' ? 'primary' : 'inherit'}
    to="/client/organisation-management"
  >
    Organisation Management
  </Link>,
];

export {
  apiHost,
  headers,
  requestOptionsHelper,
  clientBreadcrumbs,
  perc2color,
};
