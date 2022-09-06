import { Box, Container, Grid } from '@mui/material';
import { Budget } from 'apps/site-manufacturer/src/components/dashboard/budget';
import { LatestOrders } from 'apps/site-manufacturer/src/components/dashboard/latest-orders';
import { LatestProducts } from 'apps/site-manufacturer/src/components/dashboard/latest-products';
import { Sales } from 'apps/site-manufacturer/src/components/dashboard/sales';
import { TasksProgress } from 'apps/site-manufacturer/src/components/dashboard/tasks-progress';
import { TotalCustomers } from 'apps/site-manufacturer/src/components/dashboard/total-customers';
import { TotalProfit } from 'apps/site-manufacturer/src/components/dashboard/total-profit';
import { TrafficByDevice } from 'apps/site-manufacturer/src/components/dashboard/traffic-by-device';
import Head from 'next/head';
import { DashboardLayout } from '../../../../../components/dashboard-layout'



const Dashboard = () => {
  return (
    <>
      <Head>
        <title>
          Dashboard
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget />
            </Grid>
            <Grid
              item
              xl={3}
              lg={3}
              sm={6}
              xs={12}
            >
              <TotalCustomers />
            </Grid>
            <Grid
              item
              xl={3}
              lg={3}
              sm={6}
              xs={12}
            >
              <TasksProgress />
            </Grid>
            <Grid
              item
              xl={3}
              lg={3}
              sm={6}
              xs={12}
            >
              <TotalProfit sx={{ height: '100%' }} />
            </Grid>
            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <Sales />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <TrafficByDevice sx={{ height: '100%' }} />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <LatestProducts sx={{ height: '100%' }} />
            </Grid>
            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <LatestOrders />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Dashboard.getLayout = (page) => (  
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
