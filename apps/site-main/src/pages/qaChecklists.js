import MoreVert from '@mui/icons-material/MoreVert';
import { Card, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import AddTaskIcon from '@mui/icons-material/AddTask';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import GenericToolbar from '../components/generic-toolbar';
import { NotificationAlert } from '../components/notification-alert';
import { ConfirmationDialog } from '../components/quality-assurance/confirmationDialog';
import { CreateDialogChecklist } from '../components/quality-assurance/CreateDialogChecklist';
import { UpdateDialogChecklist } from '../components/quality-assurance/UpdateDialogChecklist';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SeverityPill } from '../components/severity-pill';

const QAChecklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [allRules, setAllRules] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  useEffect(() => {
    const organisationId = JSON.parse(localStorage.getItem('user')).organisation
      .id;
    const retrieveChecklists = async (id) => {
      const response = await fetch(
        `http://localhost:3000/api/qa-checklists/orgId/${id}`
      );
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        setChecklists(result);
      }
    };
    const retrieveRules = async (id) => {
      const response = await fetch(
        `http://localhost:3000/api/qa-rules/orgId/${id}`
      );
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        setAllRules(result);
      }
    };
    retrieveChecklists(organisationId);
    retrieveRules(organisationId);
  }, [setChecklists]);

  // Menu Helpers -----------------------------------
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
    setOpenUpdateDialog(true);
    setAnchorEl(null);
  };

  // Search function -----------------------------------
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  const rows = checklists;

  // ------------------------------------------
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 5,
    },
    {
      field: 'productType',
      headerName: 'Product Type',
      flex: 3,
      renderCell: (params) => {
        const value = params.value === 'rawmaterial' ? 'Raw Material' : 'Final Good';
        const color = params.value === 'rawmaterial' ? 'primary' : 'secondary';
        return (<SeverityPill color={color}>{value}</SeverityPill>)
      }
    },
    {
      field: 'created',
      headerName: 'Date Created',
      flex: 3,
      valueFormatter: (params) => {
        return dayjs(params.value).format('DD MMM YYYY hh:mm a');
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  const columnsForRules = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
    },
  ];

  // Tool bar helpers ------------------------------------

  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleOnClickDelete = () => {
    setOpenConfirmationDialog(true);
  };

  const tools = [
    {
      toolTipTitle: 'Add New Checklist',
      handleClickMethod: 'handleOpenCreateDialog',
      button: () => {
        return <AddTaskIcon color="primary" />;
      },
    },
    {
      toolTipTitle: "Click on Line Item's menu button to update",
      button: () => {
        return <HelpIcon />;
      },
    },
    {
      toolTipTitle: 'Delete Checklist(s)',
      button: () => {
        return <DeleteIcon />;
      },
      handleClickMethod: 'handleOnClickDelete',
      badge: {
        color: 'error',
      },
    },
  ];

  // ---------------------------------------------------------

  // Delete helpers -------------------------------------
  const handleDelete = async () => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };
    for (let i = 0; i < selectedRows.length; i++) {
      const res = await fetch(
        `http://localhost:3000/api/qa-checklists/${selectedRows[i]}`,
        requestOptions
      );
      const result = await res.json();
      console.log(`${selectedRows[i]} was deleted`);
    }

    handleAlertOpen(`Deleted Checklists successfully!`, 'success');

    const remainingChecklists = checklists.filter(
      (checklist) => !selectedRows.includes(checklist.id)
    );
    setChecklists(remainingChecklists);
    setSelectedRows([]);
  };

  // Create Dialog helpers ------------------------------------
  const addChecklist = (newChecklist) => {
    const newChecklists = [...checklists, newChecklist];
    setChecklists(newChecklists);
    handleAlertOpen(
      `Created checklist ${newChecklist.id} successfully!`,
      'success'
    );
  };
  // ----------------------------------------------------------

  // Update Dialog helpers ------------------------------------
  const updateChecklists = (newChecklist) => {
    const updatedChecklists = checklists.map((checklist) => {
      if (checklist.id === newChecklist.id) {
        return newChecklist;
      } else {
        return checklist;
      }
    });
    setChecklists(updatedChecklists);
    handleAlertOpen(
      `Updated checklist ${newChecklist.id} successfully!`,
      'success'
    );
  };
  // ----------------------------------------------------------
  // Notification alert helers --------------------------------

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
  };
  // ----------------------------------------------------------

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`QA Checklist | ${user?.organisation?.name}`}</title>
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
          {/* toolbar for create and delete */}
          <GenericToolbar
            tools={tools}
            disabled={disabled}
            title="QA Checklists"
            selectedRows={selectedRows}
            handleSearch={handleSearch}
            handleOpenCreateDialog={handleOpenCreateDialog}
            handleOnClickDelete={handleOnClickDelete}
          ></GenericToolbar>

          {/* Menu */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>View/Update</MenuItem>
          </Menu>

          {/* update Dialog */}
          {openUpdateDialog ? (
            <UpdateDialogChecklist
              openUpdateDialog={openUpdateDialog}
              setOpenUpdateDialog={setOpenUpdateDialog}
              updateChecklists={updateChecklists}
              columnsForRules={columnsForRules}
              rules={allRules}
              rowToEdit={rowToEdit}
            />
          ) : (
            <></>
          )}

          {/* create Dialog */}
          {openCreateDialog ? (
            <CreateDialogChecklist
              openCreateDialog={openCreateDialog}
              setOpenCreateDialog={setOpenCreateDialog}
              addChecklist={addChecklist}
              columnsForRules={columnsForRules}
              rules={allRules}
            />
          ) : (
            <></>
          )}

          {/* Notification Alert */}
          <NotificationAlert
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />

          {/* ConfirmationDialog */}
          <ConfirmationDialog
            open={openConfirmationDialog}
            handleClose={() => setOpenConfirmationDialog(false)}
            dialogTitle={`Delete Checklist(s) ?`}
            dialogContent={`Confirm deletion of checklist(s)?`}
            dialogAction={handleDelete}
          />

          {/* Data grid */}
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
                  checkboxSelection={true}
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

export default QAChecklists;
