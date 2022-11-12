import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MoneyIcon from '@mui/icons-material/Money';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { Box, Button, Container, Grid, Link, Skeleton, Stack, Typography } from '@mui/material';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Blur } from '../components/blur';
import { DoughnutChart } from '../components/charts/doughnut-chart';
import { Budget } from '../components/dashboard/budget';
import { LatestOrders } from '../components/dashboard/latest-orders';
import { LatestProducts } from '../components/dashboard/latest-products';
import { Sales } from '../components/dashboard/sales';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { TrafficByDevice } from '../components/dashboard/traffic-by-device';
import { GenericBigCard } from '../components/dashboards/generic-big-card';
import { GenericCard } from '../components/dashboards/generic-card';
import { InventoryCard } from '../components/dashboards/inventory-card';
import { NotificationAlert } from '../components/notification-alert';
import { apiHost, requestOptionsHelper } from '../helpers/constants';
import { getSessionUrl } from '../helpers/stripe';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation?.id;

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

  const getTrend = (change) => {
    if (change === 0) {
      return 'same';
    }
    if (change > 0) {
      return 'up';
    }
    if (change < 0) {
      return 'down';
    }
    return null;
  }

  // Profits Card Helpers
  const [profits, setProfits] = useState([]);
  const [profitChange, setProfitChange] = useState();

  const getProfits = async () => {
    const today = new Date();
    const url = `${apiHost}/profit`;
    const body = JSON.stringify({
      "inDate": null,
      "start": DayJS(today).subtract(1, 'month'),
      "end": today,
      "range": true,
      "type": "month",
      "organisationId": organisationId
    });

    const requestOptions = requestOptionsHelper('POST', body);

    await fetch(url, requestOptions).then(res => res.json())
      .then(result => {
        setProfits(result)
        setProfitChange(result[1].profit - result[0].profit);
      });
  }

  // New Customers Card Helpers
  const [newCustomers, setNewCustomers] = useState();
  const getNewCustomers = async () => {
    const url = `${apiHost}/shell-organisations/newCustomers/${organisationId}`;
    await fetch(url).then(res => res.json())
      .then(result => setNewCustomers(result));
  }

  // Production Throughput and Yield Helpers
  const [production, setProduction] = useState(); // [yield, throughput]
  const getProduction = async () => {
    const baseUrl = `${apiHost}/schedules`;
    const yieldUrl = `${baseUrl}/yield/${organisationId}`;
    const throughputUrl = `${baseUrl}/throughput/${organisationId}`;

    const getYield = fetch(yieldUrl).then(res => res.json());
    const getThroughput = fetch(throughputUrl).then(res => res.json());

    await Promise.all([getYield, getThroughput])
      .then(values => setProduction(values));
  }


  // Monthly Cost Breakdown Card + Doughnut
  const [costBreakdown, setCostBreakdown] = useState();
  const [costData, setCostData] = useState();
  const [costLabels, setCostLabels] = useState();

  const getCostBreakdown = async () => {
    const url = `${apiHost}/cost/breakdown`;
    const body = JSON.stringify({
      inDate: new Date(),
      start: null,
      end: null,
      range: false,
      type: 'month',
      organisationId: organisationId
    });
    const requestOptions = requestOptionsHelper('POST', body);
    await fetch(url, requestOptions).then(res => res.json())
      .then(result => {
        setCostBreakdown(result);

        const data = [];
        const labels = [];

        result.forEach((item, index) => {
          data.push(item.costAmount);
          labels.push(item.name);
        });

        setCostData(data);
        setCostLabels(labels);
      });
  }

  const costBreakdownHeaderProps = {
    title: "Monthly Cost Breakdown"
  }

  const CostBreakdownCardContent = (props) => 
    costBreakdown ? (
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <DoughnutChart
            data={costData}
            labels={costLabels}
          />
        </Box>
      ) : null;

  useEffect(() => {
    Promise.all([
      getProfits(),
      getNewCustomers(),
      getProduction(),
      getCostBreakdown(),
    ])
    .then(values => {
      // console.log(values);
    })
    .catch(err => {
      console.log(err);
      handleAlertOpen('Failed to fetch data', 'error')
    });
  }, [])

  const TestDashboardItems = () => (
    <>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <GenericCard
          key="new-customers"
          title={'New Customers'}
          icon={<GroupsIcon />}
          value={newCustomers ? `${newCustomers.count}` : null}
          change={newCustomers ? `${(newCustomers.pct_change).toFixed(2)}%` : null}
          trend={getTrend(newCustomers?.pct_change)}
          sinceLast={'month'}
          avatarColor={'primary.main'}
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <GenericCard
          key="profit"
          title={'Profit'}
          icon={<MoneyIcon />}
          value={profits.length > 1 ? `$${profits[1].profit}` : null}
          change={profits.length > 1 ? `${(profitChange/100).toFixed(2)}%` : null}
          trend={getTrend(profitChange)}
          sinceLast={'month'}
          avatarColor={'secondary.main'}
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <GenericCard
          key="production-throughput"
          title={'Production Throughput'}
          icon={<PrecisionManufacturingIcon />}
          value={production ? `${(production[0]).toFixed(2)}` : null}
          change={production ? 'Amount of Final Goods / hr' : null}
          avatarColor={'warning.main'}
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <GenericCard
          key="production-yield"
          sx={{ height: '100% ' }}
          title={'Production Yield'}
          icon={<PrecisionManufacturingIcon />}
          value={production ? `${(production[1]).toFixed(1)}%` : null}
          avatarColor={'warning.main'}
        />
      </Grid>
      <Grid item lg={8} md={12} xl={9} xs={12}>
        <InventoryCard 
          sx={{ height: '100%' }}
          handleAlertOpen={handleAlertOpen}
        />
      </Grid>
      <Grid item lg={4} md={6} xl={3} xs={12}>
        <GenericBigCard
          headerProps={costBreakdownHeaderProps}
          content={<CostBreakdownCardContent />}
        />
      </Grid>
    </>
  )

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
            <TestDashboardItems />
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
