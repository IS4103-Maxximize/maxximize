import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../../components/dashboard/budget';
import { LatestOrders } from '../../components/dashboard/latest-orders';
import { LatestProducts } from '../../components/dashboard/latest-products';
import { Sales } from '../../components/dashboard/sales';
import { TasksProgress } from '../../components/dashboard/tasks-progress';
import { TotalCustomers } from '../../components/dashboard/total-customers';
import { TotalProfit } from '../../components/dashboard/total-profit';
import { TrafficByDevice } from '../../components/dashboard/traffic-by-device';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Deliveries } from '../../components/dashboards/deliveries';
import { TrackDelivery } from '../../components/dashboards/track-delivery';
import { BatchItemsDay } from '../../components/dashboards/batch-items-day';
import { NotificationAlert } from '../../components/notification-alert';
import { useState } from 'react';

const WorkerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error'); // success || error
  const [alertText, setAlertText] = useState('');
  const handleAlertOpen = (text, severity) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

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
          pt: 4,
          pb: 8,
        }}
      >
        <NotificationAlert
          open={alertOpen}
          severity={alertSeverity}
          text={alertText}
          handleClose={handleAlertClose}
        />
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <BatchItemsDay 
                user={user}
                handleAlertOpen={handleAlertOpen}
              />
            </Grid>
            {/* Placeholders Below */}
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <TrafficByDevice sx={{ height: '100%' }} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
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

export default WorkerDashboard;
