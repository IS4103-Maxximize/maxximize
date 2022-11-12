import MoreVert from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../../components/dashboard-layout';
import { InvoiceToolbar } from '../../components/finance/invoice-toolbar';
import { NotificationAlert } from '../../components/notification-alert';
import { SeverityPill } from '../../components/severity-pill';
import { apiHost } from '../../helpers/constants';

export const MaxximizePayments = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const customerId = user.organisation?.membership?.customerId;

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  // Incoming Invoices
  const [subscriptions, setSubscriptions] = useState([]);
  const [others, setOthers] = useState([]);

  const getPayments = async () => {
    await fetch(`${apiHost}/memberships/stripe/invoices/customers/${customerId}`)
      .then(res => res.json())
      .then(result => {
        const subscriptions = []
        const others = []

        result.forEach(item => {
          const reason = item.billingReason
          if (reason === 'Subscription') {
            subscriptions.push(item);
          }
          if (reason === 'Others') {
            others.push(item);
          }
        })

        setSubscriptions(subscriptions);
        setOthers(others);
      })
      .catch(err => console.log(err));
  }

  // Init
  useEffect(() => {
    getPayments();
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

  const menuButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          // console.log(params.row);
          setSelectedRow(params.row);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  const paymentColorMap = {
    'Subscription': 'primary',
    'Others': 'secondary'
  }

  const paymentMap = {
    'Subscription': 'subscription',
    'Others': 'commission'
  }

  // DataGrid Columns
  const columns = [
    {
      field: 'billingReason',
      headerName: 'Type',
      flex: 2,
      renderCell: (params) => 
        params.value ? 
          <SeverityPill color={paymentColorMap[params.value]}>
            {paymentMap[params.value]}
          </SeverityPill>
          : ''
    },
    {
      field: 'created',
      headerName: 'Date',
      flex: 2,
      valueFormatter: (params) =>
        params.value ? DayJS(params.value).format('DD MMM YYYY hh:mm a') : ''
    },
    {
      field: 'total',
      headerName: 'Amount',
      flex: 2,
      valueFormatter: (params) => 
        params.value ? `$ ${params.value}` : ''
    },
  ];

  const RefreshPayments = () => (
    <IconButton
      color="primary"
      onClick={() => {
        getPayments()
          .then(() => handleAlertOpen('Successfully refreshed payments!', 'success'))
      }}
    >
      <RefreshIcon />
    </IconButton>
  )

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Maxximize Payments
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
          <InvoiceToolbar
            key="toolbar"
            name={'Maxximize Payments'}
            action={<RefreshPayments />}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            <Grid container spacing={2}>
              {/* Subscriptions */}
              <Grid item md={6} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardHeader 
                    title='Subscriptions'
                  />
                  <Divider />
                  <CardContent>
                    <DataGrid
                      autoHeight
                      rows={subscriptions}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                      disableSelectionOnClick
                      components={{
                        Toolbar: GridToolbar,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              {/* Commissions */}
              <Grid item md={6} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardHeader 
                    title='Commissions'
                  />
                  <Divider />
                  <CardContent>
                    <DataGrid
                      autoHeight
                      rows={others}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                      disableSelectionOnClick
                      components={{
                        Toolbar: GridToolbar,
                      }}
                    />
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

MaxximizePayments.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MaxximizePayments;
