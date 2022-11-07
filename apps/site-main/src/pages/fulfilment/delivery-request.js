import { Box, Card, Container, IconButton } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { NotificationAlert } from '../../components/notification-alert';
import CancelIcon from '@mui/icons-material/Cancel';
import DayJS from 'dayjs';
import { Toolbar } from '../../components/toolbar';
import { deliveryRequestStatusColorMap } from '../../helpers/constants';
import { SeverityPill } from '../../components/severity-pill';

const DeliveryRequest = () => {
  const [deliveryRequest, setDeliveryRequest] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of sales inquiries, initial
  useEffect(() => {
    retrieveAllDeliveryRequest();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all incoming sales inquiries
  const retrieveAllDeliveryRequest = async () => {
    const response = await fetch(
      `http://localhost:3000/api/sales-inquiry/received/${organisationId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setDeliveryRequest(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  // Action buttons
  const actionButtons = (params) => {
    return (
      <>
        {params.row.status === 'sent' ? (
          <>
            <IconButton
              onClick={(event) => {
                setSelectedRow(params.row);
                handleConfirmDialogOpen();
              }}
            >
              <CancelIcon color="error" />
            </IconButton>
            <IconButton
              onClick={(event) => {
                setSelectedRow(params.row);
                handleCreateOpen();
              }}
            >
              <SendIcon color="primary" />
            </IconButton>
          </>
        ) : (
          <></>
        )}
      </>
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
  const [productionOrderDialogOpen, setProductionOrderDialogOpen] =
    useState(false);

  const handleCreateOpen = () => {
    setProductionOrderDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setProductionOrderDialogOpen(false);
  };

  //Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

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
      field: 'created',
      headerName: 'Date Received',
      width: 70,
      flex: 3,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'expiringOn',
      headerName: 'Expiring On',
      width: 70,
      flex: 3,
      valueGetter: (params) =>
        `${new Date(
          new Date(params.row.created).getTime() + params.row.expiryDuration
        )}`,
      valueFormatter: (params) =>
        DayJS(params.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'inquirer',
      headerName: 'Inquirer',
      width: 200,
      flex: 4,
      //TODO
      valueGetter: (params) => {
        return params.row ? params.row.currentOrganisation?.name : '';
      },
    },
    {
      field: 'totalPrice',
      headerName: 'Total Price',
      width: 200,
      flex: 2,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      flex: 2,
      // To test, currently unable to test without integrating the full POHandling branch
      renderCell: (params) =>
        params.value ? (
          <SeverityPill color={deliveryRequestStatusColorMap[params.value]}>
            {params.value}
          </SeverityPill>
        ) : (
          ''
        ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      flex: 1.5,
      renderCell: actionButtons,
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
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box sx={{ minWidth: 1050 }}>
                <DataGrid
                  autoHeight
                  rows={rows.filter((row) => {
                    if (search === '') {
                      return row;
                    } else {
                      return row.id.toString().includes(search);
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
