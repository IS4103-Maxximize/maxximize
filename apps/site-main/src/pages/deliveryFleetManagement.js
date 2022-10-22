import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { ConfirmDialog } from '../components/deliveryFleet/confirm-dialog';
// import { DeliveryRequestViewDialog } from '../../components/deliveryFleet/delivery-request-view-dialog';
import { VehicleUpdateDialog } from '../components/deliveryFleet/vehicle-update-dialog';
import { VehicleCreateDialog } from '../components/deliveryFleet/vehicle-create-dialog';
import { VehicleManagementMenu } from '../components/deliveryFleet/vehicle-management-menu';
import { Toolbar } from '../components/deliveryFleet/toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { NotificationAlert } from '../components/notification-alert';
import {
  deleteVehicle, fetchVehicles
} from '../helpers/deliveryFleet';
import DayJS from 'dayjs';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DeliveryRequestViewDialog } from '../components/deliveryFleet/delivery-request-view-dialog';

const DeliveryFleetManagement = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

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

  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  // DataGrid Row and Toolbar helpers
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteDisabled, setDeleteDisabled] = useState();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const [action, setAction] = useState();
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleAdd = () => {
    setAction('POST');
    setSelectedRow(null);
  };
  const handleFormDialogOpen = () => {
    setFormDialogOpen(true);
  };
  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
  };

  const [updateFormDialogOpen, setUpdateFormDialogOpen] = useState(false);
  const handleUpdateFormDialogOpen = () => {
    setUpdateFormDialogOpen(true);
  }
  const handleUpdateFormDialogClose = () => {
    setUpdateFormDialogOpen(false);
  }

    const [deliveryRequestDialogOpen, setDeliveryRequestDialogOpen] = useState(false);
    const handleDeliveryRequestDialogOpen = () => {
         setDeliveryRequestDialogOpen(true);
    };
    const handleDeliveryRequestDialogClose = () => {
      setDeliveryRequestDialogOpen(false);
    };


  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClickViewEdit = () => {
    setAction('PATCH');
  };

  const menuButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setSelectedRow(params.row);
          console.log(params.row);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  const [rows, setRows] = useState([]);

  const getVehicles= async () => {
    const response = await fetchVehicles(user.organisation.id)

	if (response.status === 200 || response.status === 201) {
		const result = await response.json();
		console.log(result)
		setRows(result);
	} else {
		setRows([])
	}         
  };

  const addVehicle = (vehicle) => {
    const updatedVehicle = [...rows, vehicle];
    console.log(updatedVehicle);
    setRows(updatedVehicle);
    console.log(vehicle);
    handleAlertOpen(
      `Added Vehicle ${vehicle.id} successfully!`,
      'success'
    );
  };

  const handleRowUpdate = async (newRow) => {

    await getVehicles();
    handleAlertOpen(
      `Updated Vehicle ${newRow.id} successfully!`,
      'success'
    );
  };

  const handleDelete = (id) => {
    deleteVehicle(id)
      .then(() => {
        handleAlertOpen(`Successfully deleted Vehicle`, 'success');
      })
      .then(() => getVehicles());
  };

  useEffect(() => {
    getVehicles();
  }, []);

  useEffect(() => {
    setDeleteDisabled(!selectedRowId)
  }, [selectedRowId])

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'make',
      headerName: 'Make',
      flex: 1,
    },
    {
      field: 'model',
      headerName: 'Model',
      flex: 1,
    },
    {
      field: 'year',
      headerName: 'Year',
      flex: 1,
    },
    {
      field: 'lastServiced',
      headerName: 'Last Serviced',
      flex: 2,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    
    {
      field: 'currentStatus',
      headerName: 'Current Status',
      flex: 1,
    },
    {
      field: 'licensePlate',
      headerName: 'License Plate',
      flex: 1,
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
    },
    {
      field: 'loadCapacity',
      headerName: 'Load Capacity',
      flex: 1,
    },

    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Delivery Fleet Management Module
            {user && ` | ${user?.organisation?.name}`}
          </title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <NotificationAlert
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <VehicleManagementMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleUpdateFormDialogOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleClickViewEdit}
            handleClickViewDeliveryRequest={handleDeliveryRequestDialogOpen}
          />

          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete Vehicle`}
            dialogContent={`Confirm deletion of Vehicle?`}
            dialogAction={() => {
            handleDelete(selectedRowId);
            }}
          />

          <DeliveryRequestViewDialog
            open={deliveryRequestDialogOpen}
            selectedVehicle={selectedRow}
            handleClose={handleDeliveryRequestDialogClose}
          /> 

          <VehicleCreateDialog
            open={formDialogOpen}
            handleClose={handleFormDialogClose}
            addVehicle={addVehicle}
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          />
          
          <VehicleUpdateDialog
            open={updateFormDialogOpen}
            handleClose={handleUpdateFormDialogClose}
            vehicle={selectedRow}
			      handleRowUpdate={handleRowUpdate}
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          />

          <Toolbar
            name="Delivery Fleet"
            deleteDisabled={deleteDisabled}
            handleSearch={handleSearch}
            handleAdd={handleAdd}
            handleFormDialogOpen={handleFormDialogOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            {rows.length > 0 ? (
              <DataGrid
                autoHeight
                rows={rows.filter((row) => {
                  if (search === '') {
                    return row;
                  } else {
                    return (
                      row.make.toLowerCase().includes(search) ||row.model.toLowerCase().includes(search) ||
                      row.description.toLowerCase().includes(search)
                    );
                  }
                })}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                isRowSelectable={(params) =>
                  params.row.currentStatus === 'available' 
                }
                components={{
                  Toolbar: GridToolbar,
                }}
                onSelectionModelChange={(ids) => {
                  setSelectedRowId(ids[0]);
                }}
              />
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No Vehicles Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

DeliveryFleetManagement.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DeliveryFleetManagement;
