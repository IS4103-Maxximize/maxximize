import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ListIcon from '@mui/icons-material/List';
import {
  Box, Button, Card, CardContent, CardHeader,
  Container, Divider, Grid,
  IconButton,
  Skeleton,
  Stack,
  Step, StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import amex from '../../assets/images/finance/American_Express-Logo.wine.svg';
import mastercard from '../../assets/images/finance/mc_symbol.svg';
import visa from '../../assets/images/finance/Visa_Inc.-Logo.wine.svg';
import { DashboardLayout } from '../../components/dashboard-layout';
import { CostDialog } from '../../components/finance/cost-dialog';
import { FilterCard } from '../../components/finance/filter-card';
import { FinanceToolbar } from '../../components/finance/finance-toolbar';
import { RevenueDialog } from '../../components/finance/revenue-dialog';
import { NotificationAlert } from '../../components/notification-alert';
import { apiHost, requestOptionsHelper } from '../../helpers/constants';

export const Finance = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

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

  // Revenue Filter Helpers
  const [revenueRange, setRevenueRange] = useState(false);
  const [revenueType, setRevenueType] = useState('month');
  const [inRevenueDate, setInRevenueDate] = useState(new Date());
  const [fromRevenueDate, setFromRevenueDate] = useState(DayJS(new Date()).subtract(1, 'year'));
  const [toRevenueDate, setToRevenueDate] = useState(new Date());

  const toggleRevenueRange = () => {
    setRevenueRange(!revenueRange);
  }

  const handleRevenueType = (event, newType) => {
    if (newType !== null) {
      setRevenueType(newType);
    }
  }

  const resetRevenueDates = () => {
    setInRevenueDate(new Date());
    setFromRevenueDate(DayJS(new Date()).subtract(1, 'year'));
    setToRevenueDate(new Date());
  }

  useEffect(() => {
    resetRevenueDates();
  }, [revenueRange, revenueType]) 

  // Revenues Datagrid Helpers
  const [revenues, setRevenues] = useState([]);
  const [selectedRevenue, setSelectedRevenue] = useState();

  const getRevenues = async () => {
    const url = `${apiHost}/revenue`;
    const body = JSON.stringify({
      inDate: !revenueRange ? inRevenueDate : null, // null if range
      start: revenueRange ? fromRevenueDate : null, // null if single
      end: revenueRange ? toRevenueDate : null, // null if single
      range: revenueRange, // true false
      type: revenueType, // month OR year
      organisationId: organisationId
    })
    const requestOptions = requestOptionsHelper('POST', body);

    await fetch(url, requestOptions).then(res => res.json())
      .then(result => {
        const mapped = result.map((item, index) => { return {id: index, ...item} })
        setRevenues(mapped)
      })
  }

  const revenueColumns = [
    {
      field: 'dateKey',
      headerName: 'Time',
      flex: 2,
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      flex: 2,
      valueFormatter: (params) => `$ ${params.value}`
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setSelectedRevenue(params.row);
            handleRevenueDialogOpen();
          }}
        >
          <ListIcon />
        </IconButton>
      )
    },
  ]

  // Revenues Dialog Helpers
  const [revenueDialogOpen, setRevenueDialogOpen] = useState(false);
  const handleRevenueDialogOpen = () => {
    setRevenueDialogOpen(true);
  }
  const handleRevenueDialogClose = () => {
    setRevenueDialogOpen(false);
  }

  useEffect(() => {
    if (!revenueDialogOpen) {
      setSelectedRevenue(null);   
    }
  }, [revenueDialogOpen])

  // Costs Filter Helpers
  const [costsRange, setCostsRange] = useState(false);
  const [costsType, setCostsType] = useState('month');
  const [inCostsDate, setInCostsDate] = useState(new Date());
  const [fromCostsDate, setFromCostsDate] = useState(DayJS(new Date()).subtract(1, 'year'));
  const [toCostsDate, setToCostsDate] = useState(new Date());

  const toggleCostsRange = () => {
    setCostsRange(!costsRange);
  }

  const handleCostsType = (event, newType) => {
    if (newType !== null) {
      setCostsType(newType);
    }
  }

  const resetCostsDates = () => {
    setInCostsDate(new Date());
    setFromCostsDate(DayJS(new Date()).subtract(1, 'year'));
    setToCostsDate(new Date());
  }

  useEffect(() => {
    resetCostsDates();
  }, [costsRange, costsType])

  // Costs Datagrid Helpers
  const [costs, setCosts] = useState([]);
  const [selectedCost, setSelectedCost] = useState();

  const getCosts = async () => {
    const url = `${apiHost}/cost`;
    const body = JSON.stringify({
      inDate: !costsRange ? inCostsDate : null, // null if range
      start: costsRange ? fromCostsDate : null, // null if single
      end: costsRange ? toCostsDate : null, // null if single
      range: costsRange, // true false
      type: costsType, // month OR year
      organisationId: organisationId
    })
    const requestOptions = requestOptionsHelper('POST', body);

    await fetch(url, requestOptions).then(res => res.json())
      .then(result => {
        const mapped = result.map((item, index) => { return {id: index, ...item} })
        setCosts(mapped)
      })
  }

  const costsColumns = [
    {
      field: 'dateKey',
      headerName: 'Time',
      flex: 2,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      flex: 2,
      valueFormatter: (params) => `$ ${params.value}`
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setSelectedCost(params.row);
            handleCostDialogOpen();
          }}
        >
          <ListIcon />
        </IconButton>
      )
    },
  ]

  // Costs Dialog Helpers
  const [costDialogOpen, setCostDialogOpen] = useState(false);
  const handleCostDialogOpen = () => {
    setCostDialogOpen(true);
  }
  const handleCostDialogClose = () => {
    setCostDialogOpen(false);
  }

  useEffect(() => {
    if (!costDialogOpen) {
      setSelectedCost(null);   
    }
  }, [costDialogOpen])


  // Commission Card Helpers
  const [cardsError, setCardsError] = useState();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [defaultId, setDefaultId] = useState();
  
  const getCards = async () => {
    const customerId = user.organisation?.membership?.customerId;
    const updatedMembership = await fetch(`${apiHost}/memberships/orgId/${organisationId}`).then(res => res.json());
    const commisionPaymentId = updatedMembership.commisionPayment;

    if (customerId) {
      const url = `${apiHost}/memberships/stripe/paymentMethods/customers/${customerId}`;
      await fetch(url)
        .then(res => res.json())
        .then(result => {
          const mapped = result.map((item, index) => 
            item.id === commisionPaymentId ? { default: true, ...item }
            : { default: false, ...item }
          )
          mapped.sort((a, b) => Number(b.default) - Number(a.default));

          setDefaultId(mapped[0]?.id);
          setCards(mapped)
          setSelectedCard(null)
          setCardsError(null);
        })
        .catch(err => setCardsError('Unable to fetch payment methods from Stripe'))
    } else {
      setCardsError('Unable to fetch payment methods from Stripe')
    }
  }

  const updateDefaultPayment = async () => {
    const url = `${apiHost}/memberships/${user.organisation.membership.id}`;
    const body = JSON.stringify({
      commisionPayment: selectedCard
    })
    const requestOptions = requestOptionsHelper('PATCH', body);

    await fetch(url, requestOptions).then(res => res.json())
      .then(result => {
        getCards();
        handleAlertOpen('Successfully updated Default Payment method for Maxximize payments!', 'success');
      })
      .catch(err => handleAlertOpen('Failed to update Default Payment method', 'error'));
  }

  useEffect(() => {
    getCards();
  }, [])

  const brandSrcMap = {
    visa: visa,
    mastercard: mastercard,
    amex: amex,
  }

  const cardColumns = [
    {
      field: 'card',
      headerName: 'Card',
      flex: 3,
      renderCell: (params) => {
        return params.row ? 
        (
          <>
            <img
              alt="card brand"
              src={brandSrcMap[params.row.card.brand]}
              width={50}
              height={50}
            />
            {`•••• ${params.row.card.last4}`}
          </>
        ) : ''
      }
    },
    {
      field: 'expiry',
      headerName: 'Expiry',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? 
          `${params.row.card.exp_month} / ${params.row.card.exp_year%100}` 
          : ''
      }
    },
    {
      field: 'default',
      headerName: 'Default',
      flex: 1,
      renderCell: (params) => params.row.id === defaultId ?
        <CheckBoxIcon color='success' /> : ''
    },
  ]

  // Monthly Financials Helpers
  const [revenueBrackets, setRevenueBrackets] = useState([]);
  const getRevenueBrackets = async () => {
    const url = `${apiHost}/revenue-brackets`;
    return await fetch(url).then(res => res.json())
  }

  const [commission, setCommission] = useState();
  const getCommission = async () => {
    const url = `${apiHost}/revenue/commision/${new Date()}/${organisationId}`;
    return await fetch(url).then(res => res.json())
  }

  const [monthRevenue, setMonthRevenue] = useState();
  const getMonthRevenue = async () => {
    const url = `${apiHost}/revenue`
    const body = JSON.stringify({
      inDate: new Date(),
      start: null,
      end: null,
      range: false,
      type: 'month',
      organisationId: organisationId
    })
    const requestOptions = requestOptionsHelper('POST', body);
    return await fetch(url, requestOptions).then(res => res.json())
  }

  const [activeStep, setActiveStep] = useState();

  const getMonthlyFinancialData = async () => {
    await Promise.all([getRevenueBrackets(), getCommission(), getMonthRevenue()])
      .then((values) => {
        const [revenueBrackets, commission, revenues]  = values;
        console.log(values);
        setRevenueBrackets(revenueBrackets);
        setCommission(commission);
        const monthRevenue = revenues.length > 0 ? revenues[0] : { revenue: 0 }
        setMonthRevenue(monthRevenue);
        const bracket = revenueBrackets.find(bracket => {
          return bracket.start <= monthRevenue.revenue && (bracket.end ? bracket.end > monthRevenue.revenue : true);
        })
        setActiveStep(bracket ? bracket.id - 1 : -1);
      })
  }

  useEffect(() => {
    getMonthlyFinancialData();
  }, [])

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Finance
            {user && ` | ${user?.organisation?.name}`}
          </title>
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
          <NotificationAlert
            key="notification-alert"
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <FinanceToolbar
            key="toolbar"
            name={'Finance Management'}
          />
          <RevenueDialog
            open={revenueDialogOpen}
            handleClose={handleRevenueDialogClose}
            revenue={selectedRevenue}
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          />
          <CostDialog
            open={costDialogOpen}
            handleClose={handleCostDialogClose}
            cost={selectedCost}
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item md={7} xs={12}>
                <Card
                  sx={{ height: '100%'}}
                >
                  <CardHeader 
                    title="Monthly Financials"
                    sx={{ m: - 1 }}
                  />
                  <Divider />
                  <CardContent>
                  {activeStep !== undefined ? 
                  <Stepper activeStep={activeStep}>
                    {revenueBrackets.map((bracket, index) => (
                      <Step key={index}>
                        <StepLabel sx={{ textAlign: "center"}}>
                          <Typography>{`${bracket.commisionRate} %`}</Typography>
                          <Typography>{`≥ $${bracket.start}`}</Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper> : <Skeleton />}
                  {(revenueBrackets && commission !== undefined) &&
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        flexWrap: 'wrap',
                        mt: 4,
                        mb: -1,
                      }}
                    >
                      <Stack alignItems="center">
                        <Typography variant="h5">Commission</Typography>
                        <Typography variant="h5">
                          {commission !== undefined ? `$ ${commission}` : <Skeleton width={50} height={50}/>}
                        </Typography>
                      </Stack>
                      <Stack alignItems="center">
                        <Typography variant="h5">Revenue</Typography>
                        <Typography variant="h5">
                          {monthRevenue !== undefined ? `$ ${monthRevenue?.revenue}` : <Skeleton width={50} height={50}/>}
                        </Typography>
                      </Stack>
                    </Box>}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={5} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardHeader 
                    title="Commission Payment Method" 
                    sx={{ m: - 1 }}
                    action={
                    <Button
                      variant="contained"
                      disabled={!selectedCard || selectedCard === defaultId}
                      updateDefaultPayment
                      onClick={updateDefaultPayment}
                    >
                      Set Default
                    </Button>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <Box 
                      sx={{ 
                        mx: -2,
                        my: -3,
                        textAlign: 'center'
                      }}
                    >
                      {cards.length > 0 && 
                      <DataGrid
                        autoHeight
                        columns={cardColumns}
                        rows={cards}
                        pageSize={3}
                        rowsPerPageOptions={[3]}
                        hideFooterSelectedRowCount={true}
                        onSelectionModelChange={(selectionModel) => setSelectedCard(...selectionModel)}
                        isRowSelectable={(params) => params.row?.id !== defaultId}
                      />}
                      {(cards.length === 0 && !cardsError) && <Skeleton width={600} height={200} />}
                      {cardsError && <Typography sx={{ mt: 1 }}>{cardsError}</Typography>}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item md={6} xs={12}>
                <FilterCard 
                  title='Revenue Filter'
                  range={revenueRange}
                  toggleRange={toggleRevenueRange}
                  inDate={inRevenueDate}
                  setIn={setInRevenueDate}
                  from={fromRevenueDate}
                  to={toRevenueDate}
                  setFrom={setFromRevenueDate}
                  setTo={setToRevenueDate}
                  type={revenueType}
                  handleType={handleRevenueType}
                  reset={resetRevenueDates}
                  handleSearch={getRevenues}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <FilterCard 
                  title='Costs Filter'
                  range={costsRange}
                  toggleRange={toggleCostsRange}
                  inDate={inCostsDate}
                  setIn={setInCostsDate}
                  from={fromCostsDate}
                  to={toCostsDate}
                  setFrom={setFromCostsDate}
                  setTo={setToCostsDate}
                  type={costsType}
                  handleType={handleCostsType}
                  reset={resetCostsDates}
                  handleSearch={getCosts}
                />
              </Grid>

              <Grid item lg={6} md={12} xl={6} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box>
                      <Typography variant="h6">Revenue Data</Typography>
                      <DataGrid
                        autoHeight
                        rows={revenues}
                        columns={revenueColumns}
                        pageSize={6}
                        rowsPerPageOptions={[6]}
                        disableSelectionOnClick
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item lg={6} md={12} xl={6} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box>
                      <Typography variant="h6">Costs Data</Typography>
                      <DataGrid
                        autoHeight
                        rows={costs}
                        columns={costsColumns}
                        pageSize={6}
                        rowsPerPageOptions={[6]}
                        disableSelectionOnClick
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Finance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Finance;
