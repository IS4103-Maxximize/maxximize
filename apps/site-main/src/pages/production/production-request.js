import { Box, Card, Container, IconButton } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { NotificationAlert } from '../../components/notification-alert';
import CancelIcon from '@mui/icons-material/Cancel';
import DayJS from 'dayjs';
import { Toolbar } from '../../components/toolbar';
import { ProductionOrderCreateDialog } from '../../components/production-order/production-order-create-dialog';
import { ProdOFromProdReqCreateDialog } from '../../components/production-request/prodO-from-prodReq-create-dialog';

const ProductionRequest = () => {
  const [receivedProductionRequest, setReceivedProductionRequest] = useState(
    []
  );
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of sales inquiries, initial
  useEffect(() => {
    retrieveAllReceivedProductionRequest();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all incoming sales inquiries
  const retrieveAllReceivedProductionRequest = async () => {
    const response = await fetch(
      `http://localhost:3000/api/production-requests/all/${organisationId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setReceivedProductionRequest(result);
    console.log(result);
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
        {params.row.status === 'pending' ? (
          <IconButton
            onClick={(event) => {
              setSelectedRow(params.row);
              handleCreateOpen();
            }}
          >
            <SendIcon color="primary" />
          </IconButton>
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
  //   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  //   const handleConfirmDialogOpen = () => {
  //     setConfirmDialogOpen(true);
  //   };
  //   const handleConfirmDialogClose = () => {
  //     setConfirmDialogOpen(false);
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
      width: 70,
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.purchaseOrder?.id : '';
      },
    },
    {
      field: 'createdDateTime',
      headerName: 'Prod Req Created On',
      width: 70,
      flex: 3,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'deliveryDate',
      headerName: 'Needed By',
      width: 70,
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.purchaseOrder?.deliveryDate : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'finalGoodName',
      headerName: 'Final Good',
      width: 200,
      flex: 4,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.name : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 200,
      flex: 2,
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
      width: 200,
      flex: 1.5,
      renderCell: actionButtons,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = receivedProductionRequest;

  const name = 'Production Request';

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Production Request | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <ProdOFromProdReqCreateDialog
        key="prod-order-create-dialog"
        open={productionOrderDialogOpen}
        handleClose={handleCreateDialogClose}
        productionRequest={selectedRow}
        handleAlertOpen={handleAlertOpen}
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
                      return (
                        row.id.toString().includes(search) ||
                        row.purchaseOrder.id.toString().includes(search) ||
                        row.finalGood.name.toLowerCase().includes(search)
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

export default ProductionRequest;
