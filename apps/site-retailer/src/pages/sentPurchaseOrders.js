import InfoIcon from '@mui/icons-material/Info';
import { Box, Card, Container, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../components/dashboard-layout';
import { NotificationAlert } from '../components/notification-alert';
import { PODialog } from '../components/purchaseOrder/purchase-order-dialog';
import { SeverityPill } from '../components/severity-pill';
import { Toolbar } from '../components/toolbar';
import { purchaseOrderStatusColorMap } from '../helpers/constants';
// import { purchaseOrders } from "../../__mocks__/purchase-orders";

export const SentPurchaseOrders = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [selectedRow, setSelectedRow] = useState();
  const [sentPurchaseOrders, setSentPurchaseOrder] = useState([]);

  //Retrieve all sent purchase orders
  const retrieveAllSentPurchaseOrders = async () => {
    const response = await fetch(
      `http://localhost:3000/api/purchase-orders/sent/${organisationId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setSentPurchaseOrder(result);
  };

  useEffect(() => {
    // get Purchase Orders
    setLoading(true);
    retrieveAllSentPurchaseOrders();
  }, []);

  useEffect(() => {
    // show page after fetching data
    // console.log(rows);
    setLoading(false);
  }, [sentPurchaseOrders]);

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
  const [poDialogOpen, setPODialogOpen] = useState(false);
  const handleClickOpen = () => {
    setPODialogOpen(true);
  };
  const handleClickClose = () => {
    setPODialogOpen(false);
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
    if (!poDialogOpen) {
      setLoading(true);
      retrieveAllSentPurchaseOrders();
    }
  }, [poDialogOpen]);

  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'PO ID',
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Date Created',
      flex: 1,
      valueGetter: (params) => {
        return format(parseISO(params.row.created), 'dd MMM yyyy');
      },
    },
    {
      field: 'deliveryDate',
      headerName: 'Delivery Date',
      flex: 1,
      valueGetter: (params) => {
        return format(parseISO(params.row.deliveryDate), 'dd MMM yyyy');
      },
    },
    {
      field: 'deliveryAddress',
      headerName: 'Delivery Address',
      flex: 3,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.5,
      renderCell: (params) => {
        // Extract out the supplier side purchase order statuses
        // If there is follow up line items, the default status is partially fulfilled
        if (
          (params.value === 'production' ||
            params.value === 'productioncompleted') &&
          params.row.followUpLineItems.length !== 0
        ) {
          return params.value ? (
            <SeverityPill
              color={purchaseOrderStatusColorMap['partiallyfulfilled']}
            >
              {'partiallyfulfilled'}
            </SeverityPill>
          ) : (
            ''
          );
          // If there isnt any follow up line items, this is the first time. Default accepted
        } else if (
          params.value === 'production' ||
          params.value === 'productioncompleted'
        ) {
          return params.value ? (
            <SeverityPill color={purchaseOrderStatusColorMap['accepted']}>
              {'accepted'}
            </SeverityPill>
          ) : (
            ''
          );
          // Else the other statuses can be mirrored
        } else {
          return params.value ? (
            <SeverityPill color={purchaseOrderStatusColorMap[params.value]}>
              {params.value}
            </SeverityPill>
          ) : (
            ''
          );
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      renderCell: actionButton,
    },
  ];

  const rows = sentPurchaseOrders;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Purchase Orders
            {user && ` | ${user?.organisation?.name}`}
          </title>
        </Helmet>
      </HelmetProvider>
      <PODialog
        open={poDialogOpen}
        handleClose={handleClickClose}
        purchaseOrder={selectedRow}
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
          <Toolbar name={'Purchase Order'} handleSearch={handleSearch} />
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
                    row.deliveryAddress.toLowerCase().includes(search)
                  );
                })}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                components={{
                  Toolbar: GridToolbar,
                }}
                experimentalFeatures={{ newEditingApi: true }}
                isRowSelectable={(params) => {
                  return (
                    params.row.status === 'pending' ||
                    params.row.status === 'cancelled'
                  );
                }}
              />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

SentPurchaseOrders.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default SentPurchaseOrders;
