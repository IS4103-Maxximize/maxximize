import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box, Card, CardContent, CardHeader,
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
import { deleteBOMs, fetchBOMs } from '../../helpers/production/bom';

export const Finance = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Selected Row IDs
  const [selectedRow, setSelectedRow] = useState();

  const getBOMs = async () => {
    fetchBOMs(organisationId)
      .then((res) => setRows(res))
      .catch((err) =>
        handleAlertOpen('Failed to fetch Bill Of Materials', 'error')
      );
  };

  useEffect(() => {
    // get BOMs
    setLoading(true);
    getBOMs();
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

  // Create Dialog Helpers
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  useEffect(() => {
    console.log(createDialogOpen);
    if (!createDialogOpen) {
      setLoading(true);
      getBOMs();
    }
    if (createDialogOpen) {
      console.log(selectedRow);
    }
  }, [createDialogOpen]);

  // Update Dialog Helpers
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const handleUpdateDialogOpen = () => {
    setUpdateDialogOpen(true);
  };
  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
  };

  useEffect(() => {
    console.log(updateDialogOpen);
    if (!updateDialogOpen) {
      setLoading(true);
      getBOMs();
    }
    if (updateDialogOpen) {
      console.log(selectedRow);
    }
  }, [updateDialogOpen]);

  // ConfirmDialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // CRUD handlerss
  const handleDelete = async (ids) => {
    setSelectedRows([]);
    deleteBOMs(ids)
      .then(() =>
        handleAlertOpen('Successfully deleted Bill Of Material(s)!', 'success')
      )
      .then(() => getBOMs());
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
  const [revenueType, setRevenueType] = useState('month');
  const [fromRevenueDate, setFromRevenueDate] = useState(null);
  const [toRevenueDate, setToRevenueDate] = useState(new Date());

  const handleRevenueType = (event, newType) => {
    if (newType !== null) {
      setRevenueType(newType);
    }
  }

  const resetRevenueDates = () => {
    setFromRevenueDate(null);
    setToRevenueDate(new Date());
  }

  useEffect(() => {
    resetRevenueDates();
  }, [revenueType]) 


  // Costs Helpers
  const [costsType, setCostsType] = useState('month');
  const [fromCostsDate, setFromCostsDate] = useState(null);
  const [toCostsDate, setToCostsDate] = useState(new Date());

  const handleCostsType = (event, newType) => {
    if (newType !== null) {
      setCostsType(newType);
    }
  }

  const resetCostsDates = () => {
    setFromCostsDate(null);
    setToCostsDate(new Date());
  }

  useEffect(() => {
    resetCostsDates();
  }, [costsType])
  

  // Commission Card Helpers
  const [cardsError, setCardsError] = useState();
  const [cards, setCards] = useState([]);
  
  const getCards = async () => {
    const customerId = user.organisation?.membership?.customerId;

    if (customerId) {
      const url = `${apiHost}/memberships/stripe/paymentMethods/customers/${customerId}`;
      await fetch(url)
        .then(res => res.json())
        .then(result => {
          setCards(result)
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
          {/* <BOMCreateDialog
            key="bom-create-dialog"
            open={createDialogOpen}
            handleClose={handleCreateDialogClose}
            string={'Bill Of Material'}
            handleAlertOpen={handleAlertOpen}
          /> */}
          {/* <BOMUpdateDialog
            key="bom-update-dialog"
            open={updateDialogOpen}
            handleClose={handleUpdateDialogClose}
            string={'Bill Of Material'}
            bom={selectedRow}
            handleAlertOpen={handleAlertOpen}
          /> */}
          {/* <ProductMenu
            key="bom-menu"
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleUpdateDialogOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleClickViewEdit}
          /> */}
          {/* <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete Bill Of Material(s)`}
            dialogContent={`Confirm deletion of Bill Of Material(s)?`}
            dialogAction={() => {
              handleDelete(selectedRows);
            }}
          /> */}
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
                <Card>
                  <CardHeader title="Revenue Stuff" />
                </Card>
              </Grid>

              <Grid item lg={6} md={12} xl={6} xs={12}>
                <Card>
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
