import { Box, Button, Card, Container, Tooltip } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { NotificationAlert } from '../../components/notification-alert';
import { BinToolbar } from '../../components/inventory/bin/bin-toolbar';
import { CreateBinDialog } from '../../components/inventory/bin/create-bin-dialog';
import { BinConfirmDialog } from '../../components/inventory/bin/bin-confirm-dialog';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { UpdateRack } from '../../components/inventory/rack/update-rack';
import { perc2color } from '../../helpers/constants';

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
    retrieveRack();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Get the rack that was clicked
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
      console.log(state);
      result = result.filter((bin) => bin.rack.id == state.rack.id);
    }
    setBins(result);
  };

  const [rack, setRack] = useState('');

  //Retrieve rack
  const retrieveRack = async () => {
    if (state != null) {
      const response = await fetch(
        `http://localhost:3000/api/racks/${state.rack.id}`
      );

      let result = [];
      if (response.status == 200 || response.status == 201) {
        result = await response.json();
      }
      setRack(result);
    }
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Icon for capacity status
  const capacityStatus = (params) => {
    return (
      <Tooltip
        title={`${params.row.currentCapacity} / ${params.row.volumetricSpace}`}
      >
        <KitchenIcon sx={{ color: perc2color('bin', params.row) }} />
      </Tooltip>
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

  //Update rack
  const updateRack = (rack) => {
    setRack(rack);
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
      field: 'volumetricSpace',
      headerName: 'Total Volumetric Space',
      width: 100,
      flex: 3,
    },
    {
      field: 'currentCapacity',
      headerName: 'Occupied',
      width: 100,
      flex: 2,
    },
    {
      field: 'remainingCapacity',
      headerName: 'Remaining Volumetric Space',
      width: 100,
      flex: 3,
      valueGetter: (params) =>
        params.row.volumetricSpace - params.row.currentCapacity,
    },
    {
      field: 'actions',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      renderCell: capacityStatus,
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
    <Navigate to="/inventory/warehouse" />
  ) : (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${rack.name} Bin | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <CreateBinDialog
        rack={rack}
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
          <UpdateRack
            rack={rack}
            updateRack={updateRack}
            handleAlertOpen={handleAlertOpen}
          />
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

export default Bin;
