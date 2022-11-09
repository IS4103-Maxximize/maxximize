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
import { InvoiceDialog } from '../../components/finance/invoice-dialog';
import { InvoiceMenu } from '../../components/finance/invoice-menu';
import { InvoiceToolbar } from '../../components/finance/invoice-toolbar';
import { NotificationAlert } from '../../components/notification-alert';
import { SeverityPill } from '../../components/severity-pill';
import { apiHost, invoiceStatusColorMap } from '../../helpers/constants';

export const B2BInvoice = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  // Incoming Invoices
  const [incoming, setIncoming] = useState([]);
  const getIncoming = async () => {
    await fetch(`${apiHost}/invoices/incoming/${organisationId}`)
      .then(res => res.json())
      .then(result => {
        const mapped = result.map(item => {
          return {
            type: 'incoming',
            ...item
          }
        })
        setIncoming(mapped);
      })
      .catch(err => console.log(err));
  }

  // Sent Invoices
  const [sent, setSent] = useState([]);
  const getSent = async () => {
    await fetch(`${apiHost}/invoices/sent/${organisationId}`)
      .then(res => res.json())
      .then(result => {
        const mapped = result.map(item => {
          return {
            type: 'sent',
            ...item
          }
        })
        setSent(mapped);
      })
      .catch(err => console.log(err));
  }

  // Invoice Dialog Helpers
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const handleInvoiceDialogOpen = () => {
    setInvoiceDialogOpen(true);
  }
  const handleInvoiceDialogClose = () => {
    setInvoiceDialogOpen(false);
  }

  // Init
  useEffect(() => {
    getIncoming();
    getSent();
  }, [])

  // Update invoices when close dialog
  useEffect(() => {
    if (!invoiceDialogOpen && selectedRow) {
      if (selectedRow.type === 'incoming') {
        getIncoming();
      }
      if (selectedRow.type === 'sent') {
        getSent();
      }
    }
  }, [invoiceDialogOpen])

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



  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 2,
      valueFormatter: (params) =>
        params.value ? DayJS(params.value).format('DD MMM YYYY hh:mm a') : ''
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 2,
      valueFormatter: (params) => 
        params.value ? `$ ${params.value}` : ''
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
      renderCell: (params) => 
        params.value ? 
          <SeverityPill color={invoiceStatusColorMap[params.value]}>
            {params.value}
          </SeverityPill>
          : ''
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: menuButton
    },
  ];

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Invoices
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
            name={'Invoices'}
          />
          <InvoiceMenu
            key="invoice-menu"
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleInvoiceDialogOpen}
            handleMenuClose={handleMenuClose}
          />
          <InvoiceDialog
            open={invoiceDialogOpen}
            handleClose={handleInvoiceDialogClose}
            invoice={selectedRow}
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            <Grid container spacing={2}>
              {/* Incoming Invoices */}
              <Grid item md={6} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardHeader 
                    title='Incoming Invoices'
                    action={
                      <IconButton 
                        color="primary" 
                        onClick={() => 
                          getIncoming()
                          .then(() => handleAlertOpen('Refreshed Incoming Invoices', 'success'))
                        }
                      >
                        <RefreshIcon />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <DataGrid
                      autoHeight
                      rows={incoming}
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
              {/* Sent Invoices */}
              <Grid item md={6} xs={12}>
                <Card
                  sx={{ height: '100%' }}
                >
                  <CardHeader 
                    title='Sent Invoices'
                    action={
                      <IconButton 
                        color="primary" 
                        onClick={() => 
                          getSent()
                          .then(() => handleAlertOpen('Refreshed Sent Invoices', 'success'))
                        }
                      >
                        <RefreshIcon />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <DataGrid
                      autoHeight
                      rows={sent}
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

B2BInvoice.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default B2BInvoice;
