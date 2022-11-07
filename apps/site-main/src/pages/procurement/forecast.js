import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Pagination,
  Typography,
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DemandForecastToolbar } from '../../components/procurement-ordering/demand-forecast-toolbar';
import { PurchaseRequisitionToolbar } from '../../components/procurement-ordering/purchase-requisition-toolbar';

const ProcurementForecast = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Demand Forecast';

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${name} | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <DemandForecastToolbar key="toolbar" name={name} />
          <Box
            sx={{
              mt: 3,
            }}
          >
            <Card
              variant="outlined"
              sx={{
                textAlign: 'center',
              }}
            >
              <CardContent></CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ProcurementForecast;
