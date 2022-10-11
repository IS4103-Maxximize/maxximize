import { Box, Button, Card, Container, Tooltip } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { NotificationAlert } from '../../components/notification-alert';
import { BinToolbar } from '../../components/inventory/bin/bin-toolbar';
import { CreateBinDialog } from '../../components/inventory/bin/create-bin-dialog';
import { BinConfirmDialog } from '../../components/inventory/bin/bin-confirm-dialog';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UpdateWarehouse } from '../../components/inventory/warehouse/update-warehouse';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const MasterlistLineItems = () => {
  const [bins, setBins] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of bins, initial
  useEffect(() => {
    retrieveAllBins();
  }, []);

  //Get the warehouse ID that was clicked
  const { state } = useLocation();

  //Retrieve all bins
  const retrieveAllBins = async () => {
    const response = await fetch(
      `http://localhost:3000/api/bins/findAllByOrgId/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    if (state != null) {
      result = result.filter((bin) => bin.warehouse.id == state.warehouseId);
    }
    setBins(result);
  };

  const [warehouse, setWarehouse] = useState('');

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
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

  //Update Dialog helpers
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedBin, setSelectedBin] = useState('');
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
  }, [openUpdateDialog]);

  //Update warehouse
  const updateWarehouse = (warehouse) => {
    setWarehouse(warehouse);
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
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 6,
    },
    {
      field: 'capacity',
      headerName: 'Total Capacity',
      width: 100,
      flex: 2,
    },
    {
      field: 'currentCapacity',
      headerName: 'Occupied',
      width: 100,
      flex: 2,
    },
    {
      field: 'remainingCapacity',
      headerName: 'Remaining Capacity',
      width: 100,
      flex: 2,
      valueGetter: (params) => params.row.capacity - params.row.currentCapacity,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = bins;

  //Navigate to the bin page
  const navigate = useNavigate();
  const handleRowClick = (rowData) => {
    navigate('details', { state: { bin: rowData.row } });
  };

  return state == null ? (
    <Navigate to="/inventory/masterlist" />
  ) : (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${warehouse.name} Bin | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <CreateBinDialog
        warehouse={warehouse}
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          size="small"
          startIcon={<ArrowBackIosNewIcon />}
          sx={{ marginLeft: 2 }}
        >
          Back
        </Button>
        <Container maxWidth={false}>
          <UpdateWarehouse
            warehouse={warehouse}
            updateWarehouse={updateWarehouse}
            handleAlertOpen={handleAlertOpen}
          />
          <BinToolbar
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
                      return row.name.toLowerCase().includes(search);
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
                  onRowClick={(rowData) => handleRowClick(rowData)}
                />
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MasterlistLineItems;
