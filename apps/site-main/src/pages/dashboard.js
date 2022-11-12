import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Button, Container, FormControl, Grid, InputLabel, Link, MenuItem, Select, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Blur } from '../components/blur';
import { Budget } from '../components/dashboard/budget';
import { Chart } from '../components/dashboard/chart';
import { HorizontalChart } from '../components/dashboard/horizontalChart';
import { LatestOrders } from '../components/dashboard/latest-orders';
import { LatestProducts } from '../components/dashboard/latest-products';
import { Sales } from '../components/dashboard/sales';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { TrafficByDevice } from '../components/dashboard/traffic-by-device';
import { NotificationAlert } from '../components/notification-alert';
import { getSessionUrl } from '../helpers/stripe';
import { apiHost, headers, requestOptionsHelper } from '../helpers/constants';

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

  const today = new Date();


       // Date Helpers
 const [selectedDays, setSelectedDays] = useState('');

 useEffect(() => {
  if (selectedDays) { 
    getGraphData();
  }
}, [selectedDays])

 const onChange = (event) => {
  console.log(event.target)
  setSelectedDays(event.target.value);
};

 // Date Helpers
 const [selectedCount, setSelectedCount] = useState('');

 useEffect(() => {
   if (selectedCount) { 
     getHorizontalGraphData1()
   }
 }, [selectedCount])


 const handleChange = (event) => {
   console.log(event.target)
   setSelectedCount(event.target.value);
 };

 const DropDown = () => {
   return(
     <FormControl fullWidth>
         <InputLabel id="demo-simple-select-label">Date Range</InputLabel>
         <Select
           labelId="demo-simple-select-label"
           id="demo-simple-select"
           value={selectedDays}
           label="time range"
           onChange={onChange}
         >
           <MenuItem value={"7"}>Last 7 days</MenuItem>
           <MenuItem value={"14"}>Last 14 days</MenuItem>
           <MenuItem value={"21"}>Last 21 days</MenuItem>
         </Select>
       </FormControl>
   );
 };

   // const maxNumberOfCounts= organisationId.shellOrganisations;
   const Counter = () => {
    return(
      <TextField 
      fullWidth
      type="number"
      inputProps={{ max: 20, min: 0 }}
      sx={{ width: 100 }}
      label="Counter"
      margin="normal"
      name="Counter"
      onChange={handleChange}
      value={selectedCount}
      />
    );
  };

  //chart data 
  const [graphDataThisYear, setGraphDataThisYear] = useState([]);
  const [graphDataLastYear, setGraphDataLastYear] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);

  const getGraphData = async () => {
    const apiUrl = `${apiHost}/revenue/salesAmount`;
    let body = {
      days: selectedDays,
      currentDate: today,
      organisationId: organisationId
    };
    body = JSON.stringify(body);
    const requestOptions=requestOptionsHelper('POST', body);
    // const sub= selectedDays -1;
   await fetch(apiUrl,requestOptions)
    .then((response) => response.json())
    .then(result => {
      const arrSalesAmountThisYear = []
      const arrSalesAmountLastYear = []
      const arrDateLabels = []
      result.forEach(item => {
        arrSalesAmountThisYear.push(item.salesAmountThisYear)
        arrSalesAmountLastYear.push(item.salesAmountLastYear)
        arrDateLabels.push(item.dateKey)
      })
      const reversedSalesThisYear = arrSalesAmountThisYear.reverse();
      const reversedSalesLastYear = arrSalesAmountLastYear.reverse();
      const reversedDays = arrDateLabels.reverse();
      // let fromDataDate= arrDateLabels[arrDateLabels.length-1];
      // for (var i = 0; i < selectedDays ; i++) {
      //   days.push(fromDataDate);
      //   fromDataDate = Dayjs(fromDataDate).add(1, 'day');
      // }
      setGraphDataThisYear(reversedSalesThisYear);
      setGraphDataLastYear(reversedSalesLastYear);
      setDateLabels(reversedDays);
    })
  };
    //horizontal graph data
    const [graphData1, setGraphData1] = useState([]);
    const [graphLabels1, setGraphLabels1] = useState([]);
    const getHorizontalGraphData1 = async () => {
    const apiUrl = `${apiHost}/revenue/contributors`;
    let body = {
        inDate: today,
        start: null,
        end: null,
        range: false,
        type: "month",
        organisationId: organisationId,
        count:selectedCount
        };
        body = JSON.stringify(body);
        const requestOptions=requestOptionsHelper('POST', body);
    await fetch(apiUrl,requestOptions)
    .then((response) => response.json())
    .then(result => {
      const nameLabels = []
      const contributionLabels = []

      result.forEach(item => {
        nameLabels.push(item.name)
        contributionLabels.push(item.contribution)
      })
      setGraphData1(contributionLabels);
      setGraphLabels1(nameLabels);
    })
  };

          //horizontal graph data
          const [graphData2, setGraphData2] = useState([]);
          const [graphLabels2, setGraphLabels2] = useState([]);
          const getHorizontalGraphData2 = async () => {
          const apiUrl = `${apiHost}/final-goods/topSales/${organisationId}`;
          await fetch(apiUrl)
          .then((response) => response.json())
          .then(result => {
            const nameLabels = []
            const quantityLabels = []
            result.forEach(item => {
              nameLabels.push(item.name)
              quantityLabels.push(item.quantity)
            })
            setGraphData2(quantityLabels);
            setGraphLabels2(nameLabels);
          })
        };



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
            <Chart
            dropDown={<DropDown/>}
            dateLabels={dateLabels}
            graphDataThisYear={graphDataThisYear}
            graphDataLastYear={graphDataLastYear}
            graphTitle= "Total Sales Amount"/>
          </Grid>
          <Grid item lg={6} md={12} xl={9} xs={12}>
        <HorizontalChart 
        graphLabels={graphLabels2}
        graphData={graphData2}
        graphTitle="Top 5 best selling goods this month"
        sx={{ height: '100%' }} />
      </Grid> 
      <Grid item lg={6} md={12} xl={9} xs={12}>
        <HorizontalChart 
            counter={<Counter/>}
            graphLabels={graphLabels1}
            graphData={graphData1}
            graphTitle={`Top ${selectedCount} customers contributing to revenue`}
            sx={{ height: '100%' }}
             />
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
