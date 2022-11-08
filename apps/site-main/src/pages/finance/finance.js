import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box, Button, Card, CardContent, CardHeader,
  Container, Divider, Grid,
  IconButton,
  Skeleton,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import amex from '../../assets/images/finance/American_Express-Logo.wine.svg';
import mastercard from '../../assets/images/finance/mc_symbol.svg';
import visa from '../../assets/images/finance/Visa_Inc.-Logo.wine.svg';
import { DashboardLayout } from '../../components/dashboard-layout';
import { FilterCard } from '../../components/finance/filter-card';
import { FinanceToolbar } from '../../components/finance/finance-toolbar';
import { NotificationAlert } from '../../components/notification-alert';
import { apiHost } from '../../helpers/constants';

export const Finance = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Selected Row IDs
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    // show page after fetching data
    // console.log(rows);
    setLoading(false);
  }, [rows]);

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

  // Toolbar Helpers
  // Searchbar
  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };
  // Add Button
  const handleAddClick = () => {
    // setAction('POST');
    setSelectedRow(null);
  };
  // Delete Button
  const deleteDisabled = Boolean(selectedRows.length === 0);

  // Menu Helpers
  const [action, setAction] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClickViewEdit = () => {
    setAction('PATCH');
  };

  const menuButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          console.log(params.row);
          setSelectedRow(params.row);
          // setSelectedRows([params.row]);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'BOM ID',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Final Good',
      flex: 2,
      valueGetter: (params) => {
        return params.row
          ? `${params.row.finalGood.name} [${params.row.finalGood.skuCode}]`
          : '';
      },
    },
    {
      field: 'lotQuantity',
      headerName: 'Lot Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.lotQuantity : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.unit : '';
      },
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      renderCell: menuButton,
    },
  ];

  // Revenue Helpers
  const [revenueRange, setRevenueRange] = useState(false);
  const [revenueType, setRevenueType] = useState('month');
  const [inRevenueDate, setInRevenueDate] = useState(new Date());
  const [fromRevenueDate, setFromRevenueDate] = useState(null);
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
    setFromRevenueDate(null);
    setToRevenueDate(new Date());
  }

  useEffect(() => {
    resetRevenueDates();
  }, [revenueRange, revenueType]) 


  // Costs Helpers
  const [costsRange, setCostsRange] = useState(false);
  const [costsType, setCostsType] = useState('month');
  const [inCostsDate, setInCostsDate] = useState(new Date());
  const [fromCostsDate, setFromCostsDate] = useState(null);
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
    setFromCostsDate(null);
    setToCostsDate(new Date());
  }

  useEffect(() => {
    resetCostsDates();
  }, [costsRange, costsType])
  

  // Commission Card Helpers
  const [cardsError, setCardsError] = useState();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  
  const getCards = async () => {
    const customerId = user.organisation?.membership?.customerId;

    if (customerId) {
      const url = `${apiHost}/memberships/stripe/paymentMethods/customers/${customerId}`;
      await fetch(url)
        .then(res => res.json())
        .then(result => {
          setCards(result)
          setSelectedCard(null)
          setCardsError(null);
        })
        .catch(err => setCardsError('Unable to fetch payment methods from Stripe'))
    } else {
      setCardsError('Unable to fetch payment methods from Stripe')
    }
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
      // renderCell: (params) => ()
    },
  ]

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
                    title="Commission for the Month"
                    sx={{ m: - 1 }}
                  />
                  <Divider />
                  <CardContent>
                    COMMISSION GRAPH
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
                      disabled={!selectedCard}
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
                />
              </Grid>

              <Grid item lg={6} md={12} xl={6} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardHeader title="Revenue Stuff" />
                </Card>
              </Grid>

              <Grid item lg={6} md={12} xl={6} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardHeader title="Costs Stuff" />
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
