import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../../components/dashboard-layout';
import { NotificationAlert } from '../../components/notification-alert';
import { ProductionLineDialog } from '../../components/assetManagement/production-line-dialog';
import { ProductionLineManagementMenu } from '../../components/assetManagement/production-line-management-menu';
import { Toolbar } from '../../components/assetManagement/toolbar';
import { MachineViewDialog } from '../../components/assetManagement/machine-view-dialog';
import { ScheduleViewDialog } from '../../components/assetManagement/schedule-view-dialog';
import { ConfirmDialog } from '../../components/assetManagement/confirm-dialog';
import {
  deleteProductionLine,
  fetchProductionLines,
} from '../../helpers/assetManagement';

export const ProductionLineManagement = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

  const [loading, setLoading] = useState(true); // loading upon entering page

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Selected Row IDs
  const [selectedRow, setSelectedRow] = useState();

  const getProductionLines = async () => {
    fetchProductionLines(organisationId)
      .then((result) => setRows(result))
      .catch((err) =>
        handleAlertOpen(`Failed to fetch any Production Lines`, 'error')
      );
  };

  useEffect(() => {
    setLoading(true);
    getProductionLines();
  }, []);

  useEffect(() => {
    // show page after fetching data
    // console.log(rows);
    setLoading(false);
  }, [rows]);


  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState();
  const [alertSeverity, setAlertSeverity] = useState('error');
  const handleAlertOpen = (text, severity) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

   // Add Button
   const handleAdd= () => {
    // setAction('POST');
    setSelectedRow(null);
  };

  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleFormDialogOpen = () => {
    setFormDialogOpen(true);
  };
  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
  };


  // Delete Button
  const deleteDisabled = Boolean(selectedRows.length === 0 ||selectedRows.length > 1 );
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Menu Helpers
  const [action, setAction] = useState();
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
  
  // Machine Dialog Helpers
  const [machineDialogOpen, setMachineDialogOpen] = useState(false);
  const handleMachineDialogOpen = () => {
    console.log(selectedRow);
    setMachineDialogOpen(true);
  };
  const handleMachineDialogClose = () => {
    setMachineDialogOpen(false);
  };

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const handleScheduleDialogOpen = () => {
    console.log(selectedRow);
    setScheduleDialogOpen(true);
  };
  const handleScheduleDialogClose = () => {
    setScheduleDialogOpen(false);
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

  const addProductionLine = (productionLine) => {
    const updatedProductionLine = [...rows, productionLine];
    console.log(updatedProductionLine);
    setRows(updatedProductionLine);
    console.log(productionLine);
    handleAlertOpen(
      `Added Production Line ${productionLine.id} successfully!`,
      'success'
    );
   };

  const handleRowUpdate = async (newRow) => {
  const updatedRow = { ...newRow };

  const inquiry = await newRow.json();
  console.log(inquiry);

    getProductionLines();
      handleAlertOpen(
    `Updated Production Line ${inquiry.id} successfully!`,
    'success'
    );
      return updatedRow;
    };

  const handleDelete  = async (id) => {
    const response = await fetch('http://localhost:3000/api/production-lines', {
      method: 'DELETE',
    });
      if (response.status === 200 || response.status === 201) {
        setSelectedRow([]);
        deleteProductionLine(id)
        .then(() => {
          handleAlertOpen(`Successfully deleted Production Line`, 'success');
        })
        .then(() => getProductionLines())
      } else {
        handleAlertOpen(`Failed to delete Production Line with ongoing or planned schedule`, 'error');
      }
    };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
    },
    {
      field: 'isAvailable',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'finalGood',
      headerName: 'Final Good',
      flex: 2,
      valueGetter: (params) => {
        if (params.row.finalGood.name) {
          return params.row.finalGood.name;
        } else {
          return '';
        }
      },
    },
    {
      field: 'productionCostPerLot',
      headerName: 'PCPL',
      flex: 1,
    },
    {
      field: 'gracePeriod',
      headerName: 'Grace period',
      flex: 2,
    },
    {
      field: 'outputPerHour',
      headerName: 'Output Per Hour',
      flex: 2,
    },
    {
      field: 'startTime',
      headerName: 'Start',
      flex: 1,
    },
    {
      field: 'endTime',
      headerName: 'End',
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
            Production Line Management Module
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
          <ProductionLineManagementMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleFormDialogOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleClickViewEdit}
            handleClickViewMachine={handleMachineDialogOpen}
            handleClickViewSchedule={handleScheduleDialogOpen}
          />
          <MachineViewDialog
            open={machineDialogOpen}
            selectedProductionLine={selectedRow}
            handleClose={handleMachineDialogClose}
          />
          <ScheduleViewDialog
            open={scheduleDialogOpen}
            selectedProductionLine={selectedRow}
            handleClose={handleScheduleDialogClose}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete Production Line`}
            dialogContent={`Confirm deletion of Production Line?`}
            dialogAction={() => {
              handleDelete(selectedRow);
            }}
          />
          <ProductionLineDialog
            action={action}
            open={formDialogOpen}
            productionLine={selectedRow}
            addProductionLine={addProductionLine}
            updateProductionLine={handleRowUpdate}
            handleClose={handleFormDialogClose}
            selectedRow={selectedRow}
            handleAlertOpen={handleAlertOpen}
          />
          

          <Toolbar
            name="Production Line"
            deleteDisabled={deleteDisabled}
            handleSearch={handleSearch}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
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
                      row.name.toLowerCase().includes(search) ||
                      row.description.toLowerCase().includes(search)
                    );
                  }
                })}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                components={{
                  Toolbar: GridToolbar,
                }}
                onSelectionModelChange={(ids) => {
                  setSelectedRows(ids);
                }}
                disableSelectionOnClick
              />
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No Production Line Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

ProductionLineManagement.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ProductionLineManagement;
