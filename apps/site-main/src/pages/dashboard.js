import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Button, Container, Grid, Link, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Blur } from '../components/blur';
import { Budget } from '../components/dashboard/budget';
import { LatestOrders } from '../components/dashboard/latest-orders';
import { LatestProducts } from '../components/dashboard/latest-products';
import { Sales } from '../components/dashboard/sales';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { TrafficByDevice } from '../components/dashboard/traffic-by-device';
import { NotificationAlert } from '../components/notification-alert';
import { getSessionUrl } from '../helpers/stripe';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [active, setActive] = useState(true);
  const [sessionUrl, setSessionUrl] = useState();
  useEffect(() => {
    getSessionUrl(user, setSessionUrl);
    setActive(user.organisation?.membership?.status === 'active');
  }, [])

  // Alert Helpers
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

  const workerDashboardPerms = [
    'factoryworker',
    'superadmin',
  ]


  const DefaultDashboardItems = () => (
    <>
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
      <Grid item lg={8} md={12} xl={9} xs={12}>
        <Sales />
      </Grid>
      <Grid item lg={4} md={6} xl={3} xs={12}>
        <TrafficByDevice sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={4} md={6} xl={3} xs={12}>
        <LatestProducts sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={8} md={12} xl={9} xs={12}>
        <LatestOrders />
      </Grid>
    </>
  );

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
          py: 4
        }}
      >
        <Blur open={!active}>
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="h6"
              pb={2}
            >
                Visit the Customer Portal to Resume or Start your Subscription
            </Typography>
            {sessionUrl ? 
              <Button
                LinkComponent={Link}
                variant="contained" 
                endIcon={<ManageAccountsIcon />}
                href={sessionUrl}
              >
                Customer Portal
              </Button>
              : <Skeleton sx={{ bgcolor: "grey.700" }} variant="rectangular" width={500} height={50}/>
            }
          </Box>
        </Blur>
        <NotificationAlert
          open={alertOpen}
          severity={alertSeverity}
          text={alertText}
          handleClose={handleAlertClose}
        />
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <DefaultDashboardItems />
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
