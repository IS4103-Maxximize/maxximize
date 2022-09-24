import { Box, Card, Container, IconButton, Typography } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { NotificationAlert } from '../../components/notification-alert';
import { WarehouseToolbar } from '../../components/inventory/warehouse/warehouse-toolbar';
import { ViewBinDialog } from '../../components/inventory/warehouse/view-bin-dialog';
import { CreateWarehouseDialog } from '../../components/inventory/warehouse/create-warehouse-dialog';
import { WarehouseConfirmDialog } from '../../components/inventory/warehouse/warehouse-confirm-dialog';
import { WarehouseActionMenu } from '../../components/inventory/warehouse/warehouse-action-menu';
import { UpdateWarehouseDialog } from '../../components/inventory/warehouse/update-warehouse-dialog';

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of warehouses, initial
  useEffect(() => {
    retrieveAllWarehouses();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all warehouses
  const retrieveAllWarehouses = async () => {
    const response = await fetch(
      `http://localhost:3000/api/warehouses/all/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }

    setWarehouses(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Menu Button
  //   const [anchorEl, setAnchorEl] = useState(null);
  //   const menuOpen = Boolean(anchorEl);
  //   const handleMenuClick = (event) => {
  //     setAnchorEl(event.currentTarget);
  //   };
  //   const handleMenuClose = () => {
  //     setAnchorEl(null);
  //   };

  //   const binMenuButton = (params) => {
  //     return (
  //       <IconButton
  //         // disabled={params.row.bins?.length == 0}
  //         onClick={(event) => {
  //           setSelectedRow(params.row);
  //           handleMenuClick(event);
  //         }}
  //       >
  //         <KitchenIcon />
  //       </IconButton>
  //     );
  //   };

  //Action Menu
  const [anchorElUpdate, setAnchorElUpdate] = useState(null);
  const actionMenuOpen = Boolean(anchorElUpdate);
  const handleActionMenuClick = (event) => {
    setAnchorElUpdate(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setAnchorElUpdate(null);
  };

  const menuButton = (params) => {
    return (
      <IconButton
        // disabled={params.row.bins?.length == 0}
        onClick={(event) => {
          setSelectedRow(params.row);
          handleActionMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  //Update warehouse List
  const updateWarehouse = (warehouse) => {
    const indexOfEditWarehouse = warehouses.findIndex(
      (currentWarehouse) => currentWarehouse.id === warehouse.id
    );
    const newWarehouses = [...warehouses];
    newWarehouses[indexOfEditWarehouse] = warehouse;
    setWarehouses(newWarehouses);
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

  //View Bin dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedBin, setSelectedBin] = useState('');

  const handleOpenViewDialog = () => {
    setOpenViewDialog(true);
  };

  //Update Dialog helpers
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const handleUpdateDialog = () => {
    setOpenUpdateDialog(true);
  };

  //Add a new warehouse entry to the list
  const addWarehouse = (warehouse) => {
    try {
      const updatedWarehouses = [...warehouses, warehouse];

      setWarehouses(updatedWarehouses);
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
  //Deleting a warehouse entry
  //Also alerts user of ourcome
  const handleDelete = async (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
    };

    selectedIds.forEach((currentId) => {
      fetch(`http://localhost:3000/api/warehouses/${currentId}`, requestOptions)
        .then(() => {
          handleAlertOpen(`Successfully deleted warehouse(s)`, 'success');
        })
        .catch((error) => {
          handleAlertOpen(`Failed to delete warehouse(s):${error}`, 'error');
        });
    });

    setWarehouses(
      warehouses.filter((warehouse) => !selectedIds.includes(warehouse.id))
    );
  };

  //Batch line items from the bin
  const [batchLineItems, setBatchLineItems] = useState([]);

  //Load in list of line items
  useEffect(() => {
    setBatchLineItems(selectedBin?.batchLineItems);
  }, [openViewDialog]);

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 3,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      flex: 4,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
      flex: 6,
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
  const rows = warehouses;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Warehouse | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <CreateWarehouseDialog
        open={open}
        setOpen={setOpen}
        addWarehouse={addWarehouse}
        handleAlertOpen={handleAlertOpen}
      />
      <WarehouseConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Delete Warehouse(s)`}
        dialogContent={`Confirm deletion of Warehouse(s)?`}
        dialogAction={() => {
          handleDelete(selectedRows);
        }}
      />
      {/* <WarehouseBinMenu
        bins={selectedRow?.bins}
        setSelectedBin={setSelectedBin}
        setBatchLineItems={setBatchLineItems}
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        handleMenuClose={handleMenuClose}
        handleClickView={handleOpenViewDialog}
      /> */}
      <WarehouseActionMenu
        bins={selectedRow?.bins}
        setSelectedBin={setSelectedBin}
        setBatchLineItems={setBatchLineItems}
        anchorElUpdate={anchorElUpdate}
        actionMenuOpen={actionMenuOpen}
        handleActionMenuClose={handleActionMenuClose}
        handleClickUpdate={handleUpdateDialog}
        handleClickView={handleOpenViewDialog}
      />
      <ViewBinDialog
        bin={selectedBin}
        batchLineItems={batchLineItems}
        openViewDialog={openViewDialog}
        setOpenViewDialog={setOpenViewDialog}
      />
      <UpdateWarehouseDialog
        warehouse={selectedRow}
        updateWarehouse={updateWarehouse}
        openUpdateDialog={openUpdateDialog}
        setOpenUpdateDialog={setOpenUpdateDialog}
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
          <WarehouseToolbar
            disabled={disabled}
            numWarehouse={selectedRows.length}
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
                        row.name.toLowerCase().includes(search) ||
                        row.address.toLowerCase().includes(search)
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

export default Warehouse;
