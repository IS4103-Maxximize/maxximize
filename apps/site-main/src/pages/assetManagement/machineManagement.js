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
import { Helmet } from 'react-helmet';
import { DashboardLayout } from '../../components/dashboard-layout';
import { NotificationAlert } from '../../components/notification-alert';
import { ConfirmDialog } from '../../components/assetManagement/confirm-dialog';
import { MachineDialog } from '../../components/assetManagement/machine-dialog';
import { Toolbar } from '../../components/assetManagement/toolbar';
import { MachineMenu } from '../../components/assetManagement/machine-menu';
import {
  deleteMachines,
  fetchMachines,
} from '../../helpers/assetManagement';

const MachineManagement = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

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

  const [action, setAction] = useState();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

    // FormDialog Helpers
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const handleFormDialogOpen = () => {
      setFormDialogOpen(true);
    };
    const handleFormDialogClose = () => {
      setFormDialogOpen(false);
    };


  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
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
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();
  const [search, setSearch] = useState('');

  const getMachines = async () => {
    fetchMachines(organisationId)
      .then((result) => setRows(result))
      .catch((err) =>
        handleAlertOpen(`Failed to fetch any Machines`, 'error')
      );
  };

  const addMachine = (machine) => {
    const updatedMachines = [...rows, machine];
    setRows(updatedMachines);
    handleAlertOpen(
      `Added Machine ${machine.id} successfully!`,
      'success'
    );
  };

  const updateRow = async (newRow) => {
    const updatedRow = { ...newRow };

    const inquiry = await newRow.json();
    console.log(inquiry);

    getMachines();
    handleAlertOpen(
      `Updated Machine ${inquiry.id} successfully!`,
      'success'
    );
    return updatedRow;
  };

  useEffect(() => {
    getMachines();
  }, [rows]);

  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

    // Add Button
    const handleAddClick = () => {
      setAction('POST');
      setSelectedRow(null);
    }
    // Delete Button
    const deleteDisabled = Boolean(selectedRows.length === 0);

  const handleDelete = async (ids) => {
    deleteMachines(ids)
      .then(() => {
        handleAlertOpen(`Successfully deleted Machine(s)`, 'success');
      })
      .then(() => getMachines());
  };

  let columns = [
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'serialNumber',
      headerName: 'Serial Number',
      width: 300,
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 300,
      },
    {
        field: 'make',
        headerName: 'Make',
        width: 300,
      },
    {
        field: 'model',
        headerName: 'Model',
        width: 300,
      },
    {
        field: 'year',
        headerName: 'Year',
        width: 300,
      },
    {
        field: 'lastServiced',
        headerName: 'Last Serviced',
        width: 300,
      },
    {
      field: 'isOperating',
      headerName: 'Status',
      width: 300,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 300,
    },
    {
      field: 'productionLineId',
      headerName: 'Production Line Id',
      width: 300,
    },

    {
      field: 'actions',
      headerName: 'actions',
      width: 100,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Machine Management Module
          {user && ` | ${user?.organisation?.name}`}
        </title>
      </Helmet>
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
          <Toolbar
            deleteDisabled={deleteDisabled}
            handleSearch={handleSearch}
            handleAdd={handleAddClick}
            handleFormDialogOpen={handleFormDialogOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <MachineMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleClickOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleClickViewEdit}
         />
          <MachineDialog
            action={action}
            open={handleFormDialogOpen}
            string={'ProductionLine'}
            inquiry={selectedRow}
            addMachine={addMachine}
            updateMachine={updateRow}
            handleClose={handleFormDialogClose}
            handleAlertOpen={handleAlertOpen}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete Machine(s)`}
            dialogContent={`Confirm deletion of Machine(s)?`}
            dialogAction={() => {
              handleDelete(selectedRows);
            }}
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
                experimentalFeatures={{ newEditingApi: true }}
              />
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No Machine Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

MachineManagement.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MachineManagement;
