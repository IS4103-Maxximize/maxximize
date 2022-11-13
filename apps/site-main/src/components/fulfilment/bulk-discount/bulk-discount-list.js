import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import {
  Badge,
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { NotificationAlert } from '../../notification-alert';
import { BulkDiscountConfirmDialog } from './bulk-discount-confirm-dialog';
import { CreateBulkDiscountDialog } from './create-bulk-discount-dialog';

export const BulkDiscountList = () => {
  const [bulkDiscounts, setBulkDiscounts] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [rowToEdit, setRowToEdit] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const open = Boolean(anchorEl);

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [selectedRow, setSelectedRow] = useState();

  //Confirm Dialog Helpers
  const [activeConfirmDialogOpen, setActiveConfirmDialogOpen] = useState(false);
  const handleActiveConfirmDialogOpen = () => {
    setActiveConfirmDialogOpen(true);
  };
  const handleActiveConfirmDialogClose = () => {
    setActiveConfirmDialogOpen(false);
  };

  // Action button
  const actionButtons = (params) => {
    return (
      <>
        <IconButton
          onClick={(event) => {
            setSelectedRow(params.row);
            handleActiveConfirmDialogOpen();
          }}
        >
          <TaskAltIcon color="success" />
        </IconButton>
      </>
    );
  };

  //Load in list of bulk discounts, initial
  useEffect(() => {
    retrieveAllBulkDiscounts();
  }, []);

  //Retrieve all bulk discounts
  const retrieveAllBulkDiscounts = async () => {
    const bulkDiscountsList = await fetch(
      `http://localhost:3000/api/bulk-discounts/orgId/${organisationId}`
    );
    const result = await bulkDiscountsList.json();

    setBulkDiscounts(result);
  };

  //Update the status of bulk discount to active, calling update API
  //Also alerts user of ourcome
  const handleDelete = (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    selectedIds.forEach((currentId) => {
      fetch(
        `http://localhost:3000/api/bulk-discounts/${currentId}`,
        requestOptions
      )
        .then(() => {
          handleAlertOpen('Deleted bulk discount(s) successfully!', 'success');
        })
        .catch((error) => {
          handleAlertOpen(error, 'error');
        });
    });

    retrieveAllBulkDiscounts();
  };

  // Activate a bulk discount
  const handleActivation = async (selectedId) => {
    const response = await fetch(
      `http://localhost:3000/api/bulk-discounts/${selectedId}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: true,
        }),
      }
    )
      .then(() => {
        handleAlertOpen('Updated bulk discount successfully!', 'success');
      })
      .catch((error) => {
        handleAlertOpen(error, 'error');
      });

    retrieveAllBulkDiscounts();
  };

  // Dialog helpers
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
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

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Created',
      width: 200,
      flex: 3,
      valueFormatter: (params) =>
        params.value ? DayJS(params.value).format('DD MMM YYYY hh:mm a') : '',
    },
    {
      field: 'bulkType',
      headerName: 'Bulk Type',
      width: 200,
      flex: 3,
      valueFormatter: (params) => {
        const valueFormatted =
          params.value[0].toUpperCase() + params.value.slice(1);
        return `${valueFormatted}`;
      },
    },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 150,
      flex: 1,
      renderCell: (params) => {
        return params.row.isActive ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        console.log(params.row);
        return params.row.isActive ? <></> : actionButtons(params);
      },
    },
  ];

  const rows = bulkDiscounts;

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
              {/* Search Bar */}
              <Stack direction="row" spacing={1} width="40%">
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
                  placeholder="Search Bulk Discount by ID"
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

                <BulkDiscountConfirmDialog
                  open={confirmDialogOpen}
                  handleClose={handleConfirmDialogClose}
                  dialogTitle={`Delete bulk discount(s)`}
                  dialogContent={`Confirm deletion of bulk discount(s)?`}
                  dialogAction={() => {
                    const selectedIds = new Set(selectionModel);
                    handleDelete(selectedIds);
                  }}
                />

                <BulkDiscountConfirmDialog
                  open={activeConfirmDialogOpen}
                  handleClose={handleActiveConfirmDialogClose}
                  dialogTitle={`Activate bulk discount`}
                  dialogContent={`Confirm activation of bulk discount?`}
                  dialogAction={() => {
                    handleActivation(selectedRow.id);
                  }}
                />

                <Tooltip title={'Create Bulk Discount'}>
                  <IconButton onClick={handleDialogOpen}>
                    <AddCircleIcon color="primary" />
                  </IconButton>
                </Tooltip>

                <CreateBulkDiscountDialog
                  openDialog={dialogOpen}
                  handleClose={handleDialogClose}
                  handleAlertOpen={handleAlertOpen}
                  retrieveAllBulkDiscounts={retrieveAllBulkDiscounts}
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
                  return row.id.toString().includes(search);
                }
              })}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              allowSorting={true}
              components={{
                Toolbar: GridToolbar,
              }}
              isRowSelectable={(params) => !params.row.isActive}
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
