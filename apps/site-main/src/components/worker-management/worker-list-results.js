import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import MoreVert from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Badge, Box, Card, CardContent, Menu,
  MenuItem, Tooltip
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { NotificationAlert } from '../notification-alert';
import { CreateWorkerDialog } from './create-worker-dialog';
import { UpdateWorkerDialog } from './update-worker-dialog';
import { WorkerConfirmDialog } from './worker-confirm-dialog';

export const WorkerListResults = () => {
  const [workers, setWorkers] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [rowToEdit, setRowToEdit] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const open = Boolean(anchorEl);

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const menuButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setRowToEdit(params.row);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type) => {
    if (type === 'update') {
      if (rowToEdit) {
        setOpenUpdateDialog(true);
      }
    }
    setAnchorEl(null);
  };

  //Load in list of workers, initial
  useEffect(() => {
    retrieveAllWorkers();
  }, []);

  //Retrieve all workers
  const retrieveAllWorkers = async () => {
    const workersList = await fetch(
      `http://localhost:3000/api/organisations/getWorkersByOrganisation/${organisationId}`
    );
    const result = await workersList.json();

    setWorkers(result);
  };

  //Add a new worker entry to the list
  const addWorker = (worker) => {
    try {
      const updatedWorkers = [...workers, worker];

      setWorkers(updatedWorkers);
    } catch {
      console.log('An error occured please try again later');
    }
  };

  const updateWorker = (worker) => {
    console.log(worker);
    const indexOfEditWorker = workers.findIndex(
      (currentWorker) => currentWorker.id === worker.id
    );
    const newWorkers = [...workers];
    newWorkers[indexOfEditWorker] = worker;
    setWorkers(newWorkers);
    handleAlertOpen(`Updated Worker ${worker.id} successfully!`, 'success');
  };

  //Deleting a worker entry, calling update API
  //Also alerts user of ourcome
  const handleDelete = (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    selectedIds.forEach((currentId) => {
      fetch(
        `http://localhost:3000/api/users/deleteUser/${currentId}`,
        requestOptions
      )
        .then(() => {
          handleAlertOpen('Deleted worker(s) successfully!', 'success');
        })
        .catch((error) => {
          handleAlertOpen(error, 'error');
        });
    });

    setWorkers((result) =>
      result.filter((worker) => !selectedIds.has(worker.id))
    );
  };

  //Open create worker dialog
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  //Searching
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

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
    setAlertSeverity('');
  };

  //Confirm Dialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleError = () => {
    setAlertOpen('Update worker error', 'error');
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
      field: 'firstName',
      headerName: 'First Name',
      width: 200,
      flex: 2,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
      flex: 2,
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 250,
      flex: 2,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      type: 'singleSelect',
      flex: 2,
      valueOptions: ['admin', 'manager', 'factoryworker', 'driver'],
    },
    {
      field: 'phoneNumber',
      headerName: 'Contact',
      width: 150,
      flex: 2,
      preProcessEditCellProps: (params) => {
        const hasError =
          params.props.value.length < 8 || isNaN(params.props.value);

        if (hasError) {
          handleAlertOpen(
            'Phone Number is invalid (Cannot be blank or less than 8 digits), not updated. Press Esc to exit editing mode',
            'error'
          );
        }
        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => {
        if (params.row.contact.phoneNumber) {
          return params.row.contact.phoneNumber;
        } else {
          return '';
        }
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      flex: 2,
      preProcessEditCellProps: (params) => {
        const emailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const hasError =
          params.props.value.length < 1 || !emailRegex.test(params.props.value);

        if (hasError) {
          handleAlertOpen(
            'Email is invalid (Cannot be blank, must be in valid format), not updated. Press Esc to exit editing mode',
            'error'
          );
        }

        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => {
        if (params.row.contact.email) {
          return params.row.contact.email;
        } else {
          return '';
        }
      },
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 500,
      flex: 3,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value.length < 1;
        if (hasError) {
          handleAlertOpen(
            'Address is invalid (Cannot be blank), not updated. Press Esc to exit editing mode',
            'error'
          );
        }
        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => {
        if (params.row.contact.address) {
          return params.row.contact.address;
        } else {
          return '';
        }
      },
    },
    {
      field: 'postalCode',
      headerName: 'Postal Code',
      width: 200,
      flex: 2,
      preProcessEditCellProps: (params) => {
        const hasError =
          params.props.value.length !== 6 || isNaN(params.props.value);
        if (hasError) {
          handleAlertOpen(
            'Postal Code is invalid (Must be 6 digits), not updated. Press Esc to exit editing mode',
            'error'
          );
        }
        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => {
        if (params.row.contact.postalCode) {
          return params.row.contact.postalCode;
        } else {
          return '';
        }
      },
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  return (
    <>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <Box>
        <Card>
          <CardContent>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                m: -1,
              }}
            >
              <UpdateWorkerDialog
                selectedRow={rowToEdit}
                openUpdateDialog={openUpdateDialog}
                setOpenUpdateDialog={setOpenUpdateDialog}
                handleAlertOpen={handleAlertOpen}
                updateWorker={updateWorker}
              />

              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleMenuClose('update')}>
                  Update
                </MenuItem>
              </Menu>
              {/* Search Bar */}
              {/* <Stack direction="row" spacing={1}>
                <TextField
                  sx={{ width: 500 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search worker (username)"
                  variant="outlined"
                  type="search"
                  onChange={handleSearch}
                />
              </Stack> */}
              <Box></Box>

              {/* Buttons functionalities */}
              <Box sx={{ m: 1 }} display="flex" flexDirection="row-reverse">
                <Badge badgeContent={selectionModel.length} color="error">
                  <Tooltip title={'Delete Worker Entry (Single/Multiple)'}>
                    <IconButton
                      disabled={selectionModel.length === 0}
                      onClick={handleConfirmDialogOpen}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Badge>

                <WorkerConfirmDialog
                  open={confirmDialogOpen}
                  handleClose={handleConfirmDialogClose}
                  dialogTitle={`Delete worker(s)`}
                  dialogContent={`Confirm deletion of worker(s)?`}
                  dialogAction={() => {
                    const selectedIds = new Set(selectionModel);
                    handleDelete(selectedIds);
                  }}
                />

                <Tooltip
                  title={
                    'Update entry by clicking on the field to be updated. [Esc] to abandon update.'
                  }
                >
                  <IconButton>
                    <HelpIcon color="primary" />
                  </IconButton>
                </Tooltip>

                <Tooltip title={'Create Worker Entry'}>
                  <IconButton onClick={handleOpenDialog}>
                    <PersonAddIcon color="primary" />
                  </IconButton>
                </Tooltip>

                <CreateWorkerDialog
                  openDialog={openDialog}
                  setOpenDialog={setOpenDialog}
                  handleAlertOpen={handleAlertOpen}
                  addWorker={addWorker}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box mt={3}>
        <Card>
          <Box sx={{ minWidth: 1050 }}>
            <DataGrid
              autoHeight
              rows={workers}
              //   {rows.filter((row) => {
              //     if (search === '') {
              //       return row;
              //     } else {
              //       return row.username.toLowerCase().includes(search);
              //     }
              //   })}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              allowSorting={true}
              components={{
                Toolbar: GridToolbar,
              }}
              disableSelectionOnClick
              checkboxSelection={true}
              onSelectionModelChange={(ids) => {
                setSelectionModel(ids);
              }}
              //editMode="row"
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>
        </Card>
      </Box>
    </>
  );
};

//Helper methods
const jsonStructure = (worker) => {
  const updatedWorkerJSON = {
    id: worker.id,
    firstName: worker.firstName,
    lastName: worker.lastName,
    username: worker.username,
    role: worker.role,
    contact: {
      phoneNumber: worker.phoneNumber,
      email: worker.email,
      address: worker.address,
      postalCode: worker.postalCode,
    },
  };

  return updatedWorkerJSON;
};
