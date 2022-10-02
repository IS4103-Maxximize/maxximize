import { Box, Card, Container, IconButton, Typography } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { GoodReceiptListToolbar } from '../../components/procurement/receiving/good-receipt-list-toolbar';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { GoodReceiptConfirmDialog } from '../../components/procurement/receiving/good-receipt-confirm-dialog';
import { CreateGoodReceiptDialog } from '../../components/procurement/receiving/create-good-receipt-dialog';
import { NotificationAlert } from '../../components/notification-alert';
import { GoodReceiptMenu } from '../../components/procurement/receiving/good-receipt-menu';
import { ViewGoodReceiptDialog } from '../../components/procurement/receiving/view-good-receipt-dialog';
import DayJS from 'dayjs';
import { Toolbar } from '../../components/toolbar';

const ProcurementGoodReceipt = () => {
  const [goodReceipts, setGoodReceipts] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of goodReceipts, initial
  useEffect(() => {
    retrieveAllGoodReceipts();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all goodReceipts
  const retrieveAllGoodReceipts = async () => {
    const response = await fetch(
      `http://localhost:3000/api/goods-receipts/findAllByOrg/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }

    setGoodReceipts(result);
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
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  //View Good Receipt dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const handleOpenViewDialog = () => {
    setOpenViewDialog(true);
  };

  //Good Receipt line items from the bin
  const [goodReceiptLineItems, setGoodReceiptLineItems] = useState([]);

  //Load in list of line items
  useEffect(() => {
    setGoodReceiptLineItems(selectedRow?.goodsReceiptLineItems);
  }, [openViewDialog]);

  //Add a new good receipt entry to the list
  const addGoodReceipt = (goodReceipt) => {
    try {
      const updatedGoodReceipts = [...goodReceipts, goodReceipt];

      setGoodReceipts(updatedGoodReceipts);
    } catch {
      console.log('An error occured please try again later');
    }
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
  //Deleting a goodReceipt entry, calling update API
  //Also alerts user of ourcome
  const handleDelete = async (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
    };

    selectedIds.forEach((currentId) => {
      fetch(
        `http://localhost:3000/api/goods-receipts/${currentId}`,
        requestOptions
      )
        .then(() => {
          handleAlertOpen(`Successfully deleted good receipt(s)`, 'success');
        })
        .catch((error) => {
          handleAlertOpen(`Failed to delete good receipt(s):${error}`, 'error');
        });
    });

    setGoodReceipts((result) =>
      result.filter((goodReceipt) => !selectedIds.includes(goodReceipt.id))
    );
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
      field: 'purchaseOrderId',
      headerName: 'Purchase Order ID',
      width: 200,
      flex: 2,
      valueGetter: (params) => {
        if (params.row.purchaseOrder.id) {
          return params.row.purchaseOrder.id;
        } else {
          return '';
        }
      },
    },
    {
      field: 'recipientName',
      headerName: 'Recipient Name',
      width: 150,
      flex: 7,
    },
    {
      field: 'createdDateTime',
      headerName: 'Date Received',
      width: 200,
      flex: 4,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: menuButton,
      flex: 1,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = goodReceipts;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Good Receipt | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <CreateGoodReceiptDialog
        open={open}
        setOpen={setOpen}
        addGoodReceipt={addGoodReceipt}
        handleAlertOpen={handleAlertOpen}
      />
      <GoodReceiptConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Delete Good Receipt(s)`}
        dialogContent={`Confirm deletion of Good Receipt(s)?`}
        dialogAction={() => {
          handleDelete(selectedRows);
        }}
      />
      <ViewGoodReceiptDialog
        goodReceipt={selectedRow}
        openViewDialog={openViewDialog}
        setOpenViewDialog={setOpenViewDialog}
        goodReceiptLineItems={goodReceiptLineItems}
      />
      <GoodReceiptMenu
        goodReceipt={selectedRow}
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        setGoodReceiptLineItems={setGoodReceiptLineItems}
        handleMenuClose={handleMenuClose}
        handleClickView={handleOpenViewDialog}
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
            name="Good Receipt"
            numRows={selectedRows.length}
            deleteDisabled={disabled}
            handleSearch={handleSearch}
            handleFormDialogOpen={handleClickOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box>
                <DataGrid
                  autoHeight
                  rows={rows.filter((row) => {
                    if (search === '') {
                      return row;
                    } else {
                      return (
                        row.recipientName.toLowerCase().includes(search) ||
                        row.id.toString().includes(search)
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
                  disableSelectionOnClick //Check if row selection is needed
                  checkboxSelection
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

export default ProcurementGoodReceipt;
