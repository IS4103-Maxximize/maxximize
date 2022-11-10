import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../../components/financeDashboard/throughput';
import { LatestOrders } from '../../components/financeDashboard/latest-orders';
import { LatestProducts } from '../../components/financeDashboard/latest-products';
import { Sales } from '../../components/financeDashboard/sales';
import { TasksProgress } from '../../components/financeDashboard/tasks-progress';
import { TotalCustomers } from '../../components/financeDashboard/yield';
import { TotalProfit } from '../../components/financeDashboard/total-profit';
import { TrafficByDevice } from '../../components/financeDashboard/traffic-by-device';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Deliveries } from '../../components/dashboards/deliveries';
import { TrackDelivery } from '../../components/dashboards/track-delivery';

const DeliveryDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Homepage | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalCustomers />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TasksProgress />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalProfit sx={{ height: '100%' }} />
            </Grid> */}
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Deliveries user={user}/>
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <TrackDelivery sx={{ height: '100%' }} />
            </Grid>
            {/* <Grid item lg={4} md={6} xl={3} xs={12}>
              <LatestProducts sx={{ height: '100%' }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestOrders />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DeliveryDashboard;
