import { Box, Card, Container, IconButton } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { NotificationAlert } from '../../components/notification-alert';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVert from '@mui/icons-material/MoreVert';
import DayJS from 'dayjs';
import { Toolbar } from '../../components/toolbar';
import { DeliveryRequestMenu } from '../../components/fulfilment/delivery-request/delivery-request-menu';
import { DeliveryRequestDialog } from '../../components/fulfilment/delivery-request/delivery-request-dialog';

const DeliveryRequest = () => {
  const [deliveryRequest, setDeliveryRequest] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of sales inquiries, initial
  useEffect(() => {
    retrieveAllDeliveryRequests();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all incoming sales inquiries
  const retrieveAllDeliveryRequests = async () => {
    const response = await fetch(
      `http://localhost:3000/api/delivery-requests/findAllByOrganisationId/${organisationId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
      console.log(result);
    }
    setDeliveryRequest(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  // Menu Helpers
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
          setSelectedRow(params.row);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  //Alert Notification
  // NotificationAlert helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState();
  const [alertSeverity, setAlertSeverity] = useState('success');
  const handleAlertOpen = (text, severity) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertText(null);
    setAlertSeverity('success');
  };

  // Dialog helpers
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleFormDialogOpen = () => {
    setFormDialogOpen(true);
  };
  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
  };

  //Delete Confirm dialog
  //   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  //   const handleConfirmDialogOpen = () => {
  //     setConfirmDialogOpen(true);
  //   };
  //   const handleConfirmDialogClose = () => {
  //     setConfirmDialogOpen(false);
  //   };

  //Handle Delete
  //Rejecting a sales inquiry
  //Also alerts user of ourcome
  //   const handleReject = async (selectedRow) => {
  //     const requestOptions = {
  //       method: 'PATCH',
  //     };

  //     console.log(selectedRow);

  //     const response = await fetch(
  //       `http://localhost:3000/api/sales-inquiry/${selectedRow.id}`,
  //       {
  //         method: 'PATCH',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           status: 'rejected',
  //         }),
  //       }
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       const result = await response.json();

  //       handleAlertOpen(`Rejected Sales Inquiry ${result.id}`);
  //       retrieveAllReceivedProductionRequest();
  //     } else {
  //       const result = await response.json();
  //       handleAlertOpen(
  //         `Error rejecting Sales Inquiry ${result.id}. ${result.message}`,
  //         'error'
  //       );
  //     }
  //   };

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,
    },
    {
      field: 'purchaseOrderId',
      headerName: 'PO ID',
      width: 200,
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.purchaseOrder?.id : '';
      },
    },
    {
      field: 'dateCreated',
      headerName: 'Date Created',
      width: 70,
      flex: 3,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'driver',
      headerName: 'Driver',
      width: 70,
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.user?.username : '';
      },
    },
    {
      field: 'vehicle',
      headerName: 'Vehicle',
      width: 200,
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.vehicle.licensePlate : '';
      },
    },
    {
      field: 'addressFrom',
      headerName: 'Deliver From',
      width: 70,
      flex: 3,
    },
    {
      field: 'addressTo',
      headerName: 'Deliver To',
      width: 70,
      flex: 3,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      flex: 2,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      flex: 1,
      renderCell: menuButton,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = deliveryRequest;

  const name = 'Delivery Request';

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Received Sales Inquiry | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
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
          <Toolbar
            key="toolbar"
            name={name}
            numRows={selectedRows.length}
            deleteDisabled={null}
            handleSearch={handleSearch}
            handleAdd={null}
            handleFormDialogOpen={null}
            handleConfirmDialogOpen={null}
          />
          <DeliveryRequestMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleMenuClose={handleMenuClose}
            handleFormDialogOpen={handleFormDialogOpen}
          />
          <DeliveryRequestDialog
            open={formDialogOpen}
            handleClose={handleFormDialogClose}
            deliveryRequest={selectedRow}
          />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box sx={{ minWidth: 1050 }}>
                <DataGrid
                  autoHeight
                  rows={rows.filter((row) => {
                    if (search === '') {
                      return row;
                    } else {
                      return (
                        row.id.toString().includes(search) ||
                        row.purchaseOrder.id.toString().includes(search) ||
                        row.user.username.toLowerCase().includes(search) ||
                        row.vehicle.licensePlate
                          .toLowerCase()
                          .includes(search) ||
                        row.addressTo.toLowerCase().includes(search) ||
                        row.addressFrom.toLowerCase().includes(search)
                      );
                    }
                  })}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  allowSorting={true}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  disableSelectionOnClick
                  //   checkboxSelection
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DeliveryRequest;
