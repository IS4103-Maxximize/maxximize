import AddBoxIcon from '@mui/icons-material/AddBox';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { procurementBreadcrumbs } from '../../helpers/constants';
import { Search as SearchIcon } from '../../icons/search';

export const DemandForecastToolbar = (props) => {
  const { name, ...rest } = props;

  // Get current pathname
  const location = useLocation();
  const [domain, setDomain] = useState('');
  const [subdomain, setSubDomain] = useState('');
  useEffect(() => {
    const pathname = location.pathname;
    const domain = pathname.substring(1, pathname.lastIndexOf('/'));
    const subdomain = pathname.substring(pathname.lastIndexOf('/') + 1);
    setDomain(domain);
    setSubDomain(subdomain);
  }, [location]);

  return (
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          {name}
        </Typography>
        <Breadcrumbs separator="-">
          {domain === 'procurement' && procurementBreadcrumbs(subdomain)}
        </Breadcrumbs>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                m: -1,
              }}
            ></Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
