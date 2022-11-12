import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import MoreVert from '@mui/icons-material/MoreVert';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import EditIcon from '@mui/icons-material/Edit';
import { Search as SearchIcon } from '../../icons/search';
import {
  Badge,
  Box,
  Card,
  CardContent,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { NotificationAlert } from '../notification-alert';
import { CreateOutletDialog } from './create-outlet-dialog';
import { UpdateOutletDialog } from './update-outlet-dialog';
import { OutletConfirmDialog } from './outlet-confirm-dialog';

export const OutletsList = () => {
  const [outlets, setOutlets] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [rowToEdit, setRowToEdit] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const open = Boolean(anchorEl);

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [selectedRow, setSelectedRow] = useState();

  // Action button
  const actionButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setSelectedRow(params.row);
          setOpenUpdateDialog(true);
        }}
      >
        <EditIcon color="primary" />
      </IconButton>
    );
  };

  //Load in list of outlets, initial
  useEffect(() => {
    retrieveAllOutlets();
  }, []);

  //Retrieve all outlets
  const retrieveAllOutlets = async () => {
    const outletsList = await fetch(
      `http://localhost:3000/api/outlets/orgId/${organisationId}`
    );
    const result = await outletsList.json();

    setOutlets(result);
  };

  //Deleting an outlet entry, calling update API
  //Also alerts user of ourcome
  const handleDelete = (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    selectedIds.forEach((currentId) => {
      fetch(`http://localhost:3000/api/outlets/${currentId}`, requestOptions)
        .then(() => {
          handleAlertOpen('Deleted outlet(s) successfully!', 'success');
        })
        .catch((error) => {
          handleAlertOpen(error, 'error');
        });
    });

    setOutlets((result) =>
      result.filter((outlet) => !selectedIds.has(outlet.id))
    );
  };

  //Open create outlet dialog
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  //Searching
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  // Notification Alert helpers
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
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 3,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 150,
      flex: 4,
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: actionButton,
    },
  ];

  const rows = outlets;

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
              <UpdateOutletDialog
                selectedRow={selectedRow}
                openUpdateDialog={openUpdateDialog}
                setOpenUpdateDialog={setOpenUpdateDialog}
                handleAlertOpen={handleAlertOpen}
                updateOutlet={retrieveAllOutlets}
              />

              {/* Search Bar */}
              <Stack direction="row" spacing={1} width="60%">
                <TextField
                  sx={{ width: '100%' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search addresses (by name/address)"
                  variant="outlined"
                  type="search"
                  size="small"
                  onChange={handleSearch}
                />
              </Stack>

              {/* Buttons functionalities */}
              <Box sx={{ m: 1 }} display="flex" flexDirection="row-reverse">
                <Tooltip title={'Delete Address Entry (Single/Multiple)'}>
                  <span>
                    <IconButton
                      disabled={selectionModel.length === 0}
                      onClick={handleConfirmDialogOpen}
                      color="error"
                    >
                      <Badge badgeContent={selectionModel.length} color="error">
                        <DeleteIcon />
                      </Badge>
                    </IconButton>
                  </span>
                </Tooltip>

                <OutletConfirmDialog
                  open={confirmDialogOpen}
                  handleClose={handleConfirmDialogClose}
                  dialogTitle={`Delete address record(s)`}
                  dialogContent={`Confirm deletion of addresss record(s)?`}
                  dialogAction={() => {
                    const selectedIds = new Set(selectionModel);
                    handleDelete(selectedIds);
                  }}
                />

                <Tooltip title={'Create Address Record'}>
                  <IconButton onClick={handleOpenDialog}>
                    <AddBusinessIcon color="primary" />
                  </IconButton>
                </Tooltip>

                <CreateOutletDialog
                  openDialog={openDialog}
                  setOpenDialog={setOpenDialog}
                  handleAlertOpen={handleAlertOpen}
                  addOutlet={retrieveAllOutlets}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box mt={3}>
        <Card>
          <Box>
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
