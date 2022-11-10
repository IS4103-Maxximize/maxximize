import DomainAddIcon from '@mui/icons-material/DomainAdd';
import MoreVert from '@mui/icons-material/MoreVert';
import { Box, Card, Container, IconButton, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RelationsDialog } from '../../components/businessRelations/RelationsDialog';
import { ReceivedPurchaseOrderConfirmDialog } from '../../components/fulfilment/received-purchase-orders/received-po-confirm-dialog';
import { ReceivedPurchaseOrderMenu } from '../../components/fulfilment/received-purchase-orders/received-po-menu';
import { ReceivedPurchaseOrderViewDialog } from '../../components/fulfilment/received-purchase-orders/received-po-view-dialog';
import { NotificationAlert } from '../../components/notification-alert';
import { SeverityPill } from '../../components/severity-pill';
import { Toolbar } from '../../components/toolbar';
import { apiHost, purchaseOrderStatusColorMap } from '../../helpers/constants';

const ReceivedPurchaseOrder = () => {
  //TODO remove
  const [receivedPurchaseOrder, setReceivedPurchaseOrder] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // Get List of Retailers
  const [retailers, setRetailers] = useState([]);
  const getShellOrgs = async () => {
    await fetch(`${apiHost}/shell-organisations/orgId/${organisationId}`)
      .then(res => res.json())
      .then(result => result.filter(org => org.type === 'retailer'))
      .then(filtered => setRetailers(filtered))
      .catch(err => console.log(err));
  }

  // Load in list of purchase orders
  // and retailer list
  useEffect(() => {
    getShellOrgs();
    retrieveAllReceivedPurchaseOrders();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all incoming purchase orders
  const retrieveAllReceivedPurchaseOrders = async () => {
    const response = await fetch(
      `http://localhost:3000/api/purchase-orders/received/${organisationId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setReceivedPurchaseOrder(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Menu Button
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuButton = (params) => {
    const retailer = retailers.find(retailer => retailer.uen === params.row.currentOrganisation.uen);
    return (
      <Stack direction="row">
        {!retailer && 
        <IconButton
          color="error"
          onClick={() => {
            setSelectedRow(params.row);
            const po = params.row;
            const fields = {
              name: po.currentOrganisation?.name,
              uen: po.currentOrganisation?.uen,
              address: po.currentOrganisation?.orgContact?.address,
              postalCode: po.currentOrganisation?.orgContact?.postalCode,
              email: po.currentOrganisation?.orgContact?.email,
              phoneNumber: po.currentOrganisation?.orgContact?.phoneNumber,
            }
            setFields(fields)
            setOpenRetailerDialog(true)
          }}
        >
          <Tooltip title='Create Retailer'>
            <DomainAddIcon />
          </Tooltip>
        </IconButton>}
        {retailer && 
        <IconButton
          // disabled={params.row.bins?.length == 0}
          onClick={(event) => {
            setSelectedRow(params.row);
            setFields({
              retailer: retailer
            });
            handleMenuClick(event);
          }}
        >
          <MoreVert />
        </IconButton>}
      </Stack>
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
  const [purchaseOrderDialogOpen, setPurchaseOrderDialogOpen] = useState(false);

  const handleClickView = () => {
    setPurchaseOrderDialogOpen(true);
  };

  const handleClickClose = () => {
    setPurchaseOrderDialogOpen(false);
  };

  const [openRetailerDialog, setOpenRetailerDialog] = useState(false);
  const [fields, setFields] = useState();

  useEffect(() => {
    if (!purchaseOrderDialogOpen || !openRetailerDialog) {
      getShellOrgs();
      retrieveAllReceivedPurchaseOrders();
    }
  }, [purchaseOrderDialogOpen, openRetailerDialog])

  //Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  //Handle Delete
  //Rejecting a purchase order
  //Also alerts user of ourcome
  const handleDelete = async (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
    };

    // selectedIds.forEach((currentId) => {
    //   fetch(`http://localhost:3000/api/warehouses/${currentId}`, requestOptions)
    //     .then(() => {
    //       handleAlertOpen(`Successfully deleted warehouse(s)`, 'success');
    //     })
    //     .catch((error) => {
    //       handleAlertOpen(`Failed to delete warehouse(s):${error}`, 'error');
    //     });
    // });

    // setWarehouses(
    //   warehouses.filter((warehouse) => !selectedIds.includes(warehouse.id))
    // );
  };

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
      field: 'buyer',
      headerName: 'Buyer',
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
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      flex: 2,
      renderCell: (params) =>
        params.value ? (
          <SeverityPill color={purchaseOrderStatusColorMap[params.value]}>
            {params.value}
          </SeverityPill>
        ) : (
          ''
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      flex: 1,
      renderCell: menuButton,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = receivedPurchaseOrder;

  

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Received Purchase Order | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <ReceivedPurchaseOrderConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Reject Purchase Order(s)`}
        dialogContent={`Confirm rejection of purchase order(s)?`}
        dialogAction={() => {
          handleDelete(selectedRows);
        }}
      />
      <ReceivedPurchaseOrderViewDialog
        open={purchaseOrderDialogOpen}
        handleClose={handleClickClose}
        purchaseOrder={selectedRow}
        handleAlertOpen={handleAlertOpen}
        retrieveAllReceivedPurchaseOrders={retrieveAllReceivedPurchaseOrders}
        retailer={fields?.retailer}
      />
      <RelationsDialog
        fields={fields}
        openDialog={openRetailerDialog}
        setOpenDialog={setOpenRetailerDialog}
        addOrganisation={() => null}
        type='retailer'
        orgId={organisationId}
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
            key="received-purchase-order"
            name={'Received Purchase Order'}
            numRows={selectedRows.length}
            deleteDisabled={null}
            handleSearch={handleSearch}
            handleAdd={null}
            handleFormDialogOpen={null}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <ReceivedPurchaseOrderMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleMenuClose={handleMenuClose}
            handleClickView={handleClickView}
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
                        row.currentOrganisation?.name
                          .toLowerCase()
                          .includes(search)
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

export default ReceivedPurchaseOrder;
