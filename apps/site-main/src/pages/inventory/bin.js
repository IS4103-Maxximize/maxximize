import { Box, Card, Container, IconButton, Typography } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { NotificationAlert } from '../../components/notification-alert';
import { BinToolbar } from '../../components/inventory/bin/bin-toolbar';
import { CreateBinDialog } from '../../components/inventory/bin/create-bin-dialog';
import { BinActionMenu } from '../../components/inventory/bin/bin-action-menu';
import { UpdateBinDialog } from '../../components/inventory/bin/update-bin-dialog';
import { BinConfirmDialog } from '../../components/inventory/bin/bin-confirm-dialog';

const Bin = () => {
  const [bins, setBins] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of bins, initial
  useEffect(() => {
    retrieveAllBins();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all bins
  const retrieveAllBins = async () => {
    const response = await fetch(
      `http://localhost:3000/api/bins/findAllByOrgId/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }

    setBins(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

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

  //Update bin List
  const updateBin = (bin) => {
    const indexOfEditBin = bins.findIndex(
      (currentBin) => currentBin.id === bin.id
    );
    const newBins = [...bins];
    newBins[indexOfEditBin] = bin;
    setBins(newBins);
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

  //Add a new bin entry to the list
  const addBin = (bin) => {
    try {
      const updatedBins = [...bins, bin];

      setBins(updatedBins);
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
  //Deleting a bin entry
  //Also alerts user of ourcome
  const handleDelete = async (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
    };

    selectedIds.forEach((currentId) => {
      fetch(`http://localhost:3000/api/bins/${currentId}`, requestOptions)
        .then(() => {
          handleAlertOpen(`Successfully deleted bin(s)`, 'success');
        })
        .catch((error) => {
          handleAlertOpen(`Failed to delete bin(s):${error}`, 'error');
        });
    });

    setBins(bins.filter((bin) => !selectedIds.includes(bin.id)));
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
      field: 'warehouseId',
      headerName: 'Warehouse ID',
      width: 70,
      flex: 2,
      valueGetter: (params) => {
        if (params.row.warehouse.id) {
          return params.row.warehouse.id;
        } else {
          return '';
        }
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 6,
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 100,
      flex: 2,
    },
    {
      field: 'currentCapacity',
      headerName: 'Current Capacity',
      width: 100,
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
  const rows = bins;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Bin | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <CreateBinDialog
        open={open}
        setOpen={setOpen}
        addBin={addBin}
        handleAlertOpen={handleAlertOpen}
      />
      <BinConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Delete Bin(s)`}
        dialogContent={`Confirm deletion of Bin(s)?`}
        dialogAction={() => {
          handleDelete(selectedRows);
        }}
      />
      <BinActionMenu
        anchorElUpdate={anchorElUpdate}
        actionMenuOpen={actionMenuOpen}
        handleActionMenuClose={handleActionMenuClose}
        handleClickUpdate={handleUpdateDialog}
      />
      <UpdateBinDialog
        bin={selectedRow}
        updateBin={updateBin}
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
          <BinToolbar
            disabled={disabled}
            numBin={selectedRows.length}
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
                        row.warehouse.id.toString().includes(search)
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

export default Bin;
