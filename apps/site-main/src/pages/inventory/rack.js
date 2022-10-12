import { Box, Button, Card, Container, Tooltip } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { NotificationAlert } from '../../components/notification-alert';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UpdateWarehouse } from '../../components/inventory/warehouse/update-warehouse';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CreateRackDialog } from '../../components/inventory/rack/create-rack-dialog';
import { RackConfirmDialog } from '../../components/inventory/rack/rack-confirm-dialog';
import { RackToolbar } from '../../components/inventory/rack/rack-toolbar';

const Rack = () => {
  const [racks, setRacks] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Get the warehouse ID that was clicked
  const { state } = useLocation();

  //Load in list of racks, initial
  useEffect(() => {
    // setRacks(state.racks);
    retrieveWarehouse();
  }, []);

  const [warehouse, setWarehouse] = useState('');

  //Retrieve warehouse
  const retrieveWarehouse = async () => {
    if (state != null) {
      const response = await fetch(
        `http://localhost:3000/api/warehouses/${state.warehouseId}`
      );

      let result = [];
      if (response.status == 200 || response.status == 201) {
        result = await response.json();
      }
      setWarehouse(result);
      setRacks(result.racks);
    }
  };

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
  const [selectedRack, setSelectedRack] = useState('');
  const handleUpdateDialog = () => {
    setOpenUpdateDialog(true);
  };

  //Add a new rack entry to the list
  const addRack = (rack) => {
    try {
      const updatedRacks = [...racks, rack];
      setRacks(updatedRacks);
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
  //Deleting a rack entry
  //Also alerts user of ourcome
  const handleDelete = async (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
    };

    selectedIds.forEach((currentId) => {
      fetch(`http://localhost:3000/api/racks/${currentId}`, requestOptions)
        .then(() => {
          handleAlertOpen(`Successfully deleted rack(s)`, 'success');
        })
        .catch((error) => {
          handleAlertOpen(`Failed to delete rack(s):${error}`, 'error');
        });
    });

    setRacks(racks.filter((rack) => !selectedIds.includes(rack.id)));
  };

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
      field: 'description',
      headerName: 'Description',
      width: 200,
      flex: 6,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = racks;

  //Navigate to the bin page
  const navigate = useNavigate();
  const handleRowClick = (rowData) => {
    navigate('bin', { state: { rack: rowData.row } });
  };

  return state == null ? (
    <Navigate to="/inventory/warehouse" />
  ) : (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${warehouse.name} Rack | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <CreateRackDialog
        warehouse={warehouse}
        open={open}
        setOpen={setOpen}
        addRack={addRack}
        handleAlertOpen={handleAlertOpen}
      />
      <RackConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Delete Rack(s)`}
        dialogContent={`Confirm deletion of Rack(s)?`}
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
          <RackToolbar
            disabled={disabled}
            numRack={selectedRows.length}
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
                      return row.description.toLowerCase().includes(search);
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

export default Rack;
