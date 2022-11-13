import InfoIcon from '@mui/icons-material/Info';
import { Box, Card, Container, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../components/dashboard-layout';
import { InvoiceDialog } from '../components/invoice/invoice-dialog';
import { NotificationAlert } from '../components/notification-alert';
import { SeverityPill } from '../components/severity-pill';
import { Toolbar } from '../components/toolbar';
import { invoiceStatusColorMap } from '../helpers/constants';

export const ReceivedInvoices = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [selectedRow, setSelectedRow] = useState();
  const [receivedInvoices, setReceivedInvoices] = useState([]);

  //Retrieve all sent purchase orders
  const retrieveAllReceivedInvoices = async () => {
    const response = await fetch(
      `http://localhost:3000/api/invoices/incoming/${organisationId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setReceivedInvoices(result);
  };

  useEffect(() => {
    // get Invoices
    setLoading(true);
    retrieveAllReceivedInvoices();
  }, []);

  useEffect(() => {
    // show page after fetching data
    // console.log(rows);
    setLoading(false);
  }, [receivedInvoices]);

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

  // PODialog Helpers
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const handleClickOpen = () => {
    setInvoiceDialogOpen(true);
  };
  const handleClickClose = () => {
    setInvoiceDialogOpen(false);
  };

  // Action button
  const actionButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setSelectedRow(params.row);
          handleClickOpen();
        }}
      >
        <InfoIcon color="primary" />
      </IconButton>
    );
  };

  useEffect(() => {
    if (!invoiceDialogOpen) {
      setLoading(true);
      retrieveAllReceivedInvoices();
    }
  }, [invoiceDialogOpen]);

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
        params.value ? DayJS(params.value).format('DD MMM YYYY hh:mm a') : '',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 2,
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
      renderCell: (params) =>
        params.value ? (
          <SeverityPill color={invoiceStatusColorMap[params.value]}>
            {params.value}
          </SeverityPill>
        ) : (
          ''
        ),
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      renderCell: actionButton,
    },
  ];

  const rows = receivedInvoices;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Invoice
            {user && ` | ${user?.organisation?.name}`}
          </title>
        </Helmet>
      </HelmetProvider>
      <InvoiceDialog
        open={invoiceDialogOpen}
        handleClose={handleClickClose}
        invoice={selectedRow}
        handleAlertOpen={handleAlertOpen}
        retrieveAllInvoices={retrieveAllReceivedInvoices}
      />
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
          <Toolbar name={'Invoice'} handleSearch={handleSearch} />
          <Box
            sx={{
              mt: 3,
            }}
          >
            <Card>
              <DataGrid
                autoHeight
                rows={rows.filter((row) => {
                  return (
                    row.id.toString().includes(search) ||
                    row.poId.toString().includes(search)
                  );
                })}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                components={{
                  Toolbar: GridToolbar,
                }}
              />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

ReceivedInvoices.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ReceivedInvoices;
