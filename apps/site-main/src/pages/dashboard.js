import { Box, Container, Grid } from '@mui/material';
import { Throughput } from '../../components/financeDashboard/throughput';
import { TotalCustomers } from '../../components/financeDashboard/total-customers';
import { Yield } from '../../components/financeDashboard/yield';
import { TotalProfit } from '../../components/financeDashboard/total-profit';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Inventory } from '../../components/financeDashboard/inventory.js';
import { HorizontalChart1 } from '../../components/financeDashboard/horizontal-Chart-1';
import { HorizontalChart2 } from '../../components/financeDashboard/horizontal-Chart-2';
import { FinanceToolbar } from '../../components/financeDashboard/finance-toolbar';
import { BarChart } from '../../components/financeDashboard/barChart';
import { CostBreakdown } from '../../components/financeDashboard/cost-breakdown';

const Dashboard = () => {
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
        <FinanceToolbar />
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit sx={{ height: '100%' }} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
            <Yield sx={{ height: '100%' }} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <Throughput sx={{ height: '100%' }} />
            </Grid> 
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalCustomers sx={{ height: '100%' }}/>
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <BarChart sx={{ height: '100%' }} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
        <CostBreakdown sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={6} md={6} xl={3} xs={12}>
        <HorizontalChart1 sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={6} md={12} xl={9} xs={12}>
        <HorizontalChart2 sx={{ height: '100%' }} />
      </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <Inventory sx={{ height: '100%' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
