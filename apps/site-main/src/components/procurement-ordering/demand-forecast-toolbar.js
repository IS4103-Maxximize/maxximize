import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent, TextField, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { procurementBreadcrumbs } from '../../helpers/constants';

export const DemandForecastToolbar = (props) => {
  const { name, finalGoods, setSelectedFinalGood, setPeriod, handleSubmit } = props;

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
                width: '60%',
              }}
            >
              <Autocomplete
                sx={{ width: 300 }}
                options={finalGoods}
                renderInput={(params) => (
                  <TextField {...params} label="Final Good" />
                )}
                getOptionLabel={(option) =>
                  `${option.name} - ${option.skuCode}`
                }
                onChange={(event, newInputValue) => {
                  setSelectedFinalGood(newInputValue);
                }}
              />
              <TextField
                label="Number of periods"
                onChange={(event) => setPeriod(event.target.value)}
              />
              <Button variant="contained" onClick={handleSubmit}>Forecast</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
