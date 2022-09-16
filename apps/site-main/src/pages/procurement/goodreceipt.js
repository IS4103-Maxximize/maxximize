import { Box, Card, Container, IconButton, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { GoodReceiptListToolbar } from '../../components/procurement/receiving/good-receipt-list-toolbar';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { GoodReceiptConfirmDialog } from '../../components/procurement/receiving/good-receipt-confirm-dialog';
import { CreateGoodReceiptDialog } from '../../components/procurement/receiving/create-good-receipt-dialog';
import { NotificationAlert } from '../../components/notification-alert';
import { GoodReceiptMenu } from '../../components/procurement/receiving/good-receipt-menu';
import { ViewGoodReceiptDialog } from '../../components/procurement/receiving/view-good-receipt-dialog';

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

  //Retrieve all goodReceipts [TODO	]
  const retrieveAllGoodReceipts = async () => {
    // const goodReceiptsList = await fetch(
    //   `http://localhost:3000/api/goods-receipts`
    // );
    // const result = await goodReceiptsList.json();
    // setGoodReceipts(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
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
  const handleClose = () => {
    setOpen(false);
  };

  //View Good Receipt dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const handleOpenViewDialog = () => {
    setOpenViewDialog(true);
  };

  //Add a new good receipt entry to the list
  const addGoodReceipt = (goodReceipt) => {
    try {
      const updatedGoodReceipts = [...goodReceipts, goodReceipt];

      setGoodReceipts(updatedGoodReceipts);
    } catch {
      console.log('An erorr occured please try again later');
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
      //   fetch(
      //     `http://localhost:3000/api/users/deleteUser/${currentId}`,
      //     requestOptions
      //   )
      //     .then(() => {
      //        handleAlertOpen(`Successfully deleted good receipt(s)`, 'success');
      //})
      //     .catch((error) => {
      //       handleAlertOpen(`Failed to delete good receipt(s):${error}`, 'error');
      //     });
    });

    setGoodReceipts((result) =>
      result.filter((goodReceipt) => !selectedIds.has(goodReceipt.id))
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
    },
    {
      field: 'recipientName',
      headerName: 'Recipient Name',
      width: 150,
      flex: 6,
    },
    {
      field: 'dateReceived',
      headerName: 'DateReceived',
      width: 200,
      flex: 2,
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
      <Helmet>
        <title>{`Good Receipt | ${user?.organisation?.name}`}</title>
      </Helmet>
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
        openViewDialog={openViewDialog}
        setOpenViewDialog={setOpenViewDialog}
      />
      <GoodReceiptMenu
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        handleClickOpen={handleClickOpen}
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
        {/* <Container maxWidth={false}>
          <GoodReceiptListToolbar
            disabled={disabled}
            numGoodReceipts={selectedRows.length}
            handleClickOpen={handleClickOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
            handleSearch={handleSearch}
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
                        row.recipientName.toLowerCase().includes(search) ||
                        row.purchaseOrderId.toString().includes(search)
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
        </Container> */}
      </Box>
    </>
  );
};

export default ProcurementGoodReceipt;
