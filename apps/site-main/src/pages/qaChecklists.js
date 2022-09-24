import MoreVert from "@mui/icons-material/MoreVert"
import { Card, IconButton, Menu, MenuItem } from "@mui/material"
import { useEffect, useState } from "react"
import AddTaskIcon from '@mui/icons-material/AddTask';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from "@mui/system";
import dayjs from 'dayjs'
import GenericToolbar from "../components/generic-toolbar";
import { NotificationAlert } from "../components/notification-alert";
import { ConfirmationDialog } from "../components/quality-assurance/confirmationDialog";
import { CreateDialogChecklist } from "../components/quality-assurance/CreateDialogChecklist";
import { UpdateDialogChecklist } from "../components/quality-assurance/UpdateDialogChecklist";

function qaChecklists() {
  const [checklists, setChecklists] = useState([])
  const [allRules, setAllRules] = useState([])
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [rowToEdit, setRowToEdit] = useState()
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl) 


  useEffect(() => {
    const organisationId = JSON.parse(localStorage.getItem('user')).organisation.id
    const retrieveChecklists = async(id) => {
      const response = await fetch(`http://localhost:3000/api/qa-checklists/orgId/${id}`)
      if (response.status === 200 || response.status === 201) {
        const result = await response.json()
        setChecklists(result)
      }
    }
    const retrieveRules = async(id) => {
      const response = await fetch(`http://localhost:3000/api/qa-rules/orgId/${id}`)
      if (response.status === 200 || response.status === 201) {
        const result = await response.json()
        setAllRules(result)
      }
    }
    retrieveChecklists(organisationId)
    retrieveRules(organisationId)
  }, [setChecklists])

  // Menu Helpers -----------------------------------
  const menuButton = (params) => {
    return (
      <IconButton onClick={(event) => {
        setRowToEdit(params.row);
        handleMenuClick(event);
        }}>
        <MoreVert/>
      </IconButton>
    )
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type) => {
    setOpenUpdateDialog(true)
    setAnchorEl(null);
  };

  // ------------------------------------------
  const columns = [
    {
      field: 'id',
      headerName: 'id',
      flex: 0
    },
    {
      field: 'name',
      headerName: 'name',
      flex: 2
    },
    {
      field: 'productType',
      headerName: 'productType',
      flex: 2,
      valueFormatter: params => {
        return params.value === 'rawmaterial' ? 'Raw Material': 'Final Good'
      }
    },
    {
      field: 'created',
      headerName: 'created',
      flex: 1,
      valueFormatter: params => {
        return dayjs(params.value).format('DD/MM/YY')
      }
    },
    {
      field: 'actions',
      headerName: 'actions',
      flex: 1,
      sortable: false,
      renderCell: menuButton
    }
  ]

  const columnsForRules = [
    {
      field: 'id',
      headerName: 'id',
      flex: 0
    },
    {
      field: 'title',
      headerName: 'title',
      flex: 2
    },
    {
      field: 'description',
      headerName: 'description',
      flex: 2
    },
  ]

   // Tool bar helpers ------------------------------------

  useEffect(() => {
    setDisabled(selectedRows.length === 0)
  }, [selectedRows])

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true)
  }

  const handleOnClickDelete = () => {
    setOpenConfirmationDialog(true)
  }

  const tools = [
    {
      toolTipTitle: 'Add new checklist',
      handleClickMethod: 'handleOpenCreateDialog',
      button: () => {
        return (
          <AddTaskIcon />
        )
      }
    },
    {
      toolTipTitle: "Click on line Item's menu button to update",
      button: () => {
        return (
          <HelpIcon />
        )
      }
    },
    {
      toolTipTitle: "delete checklist(s)",
      button: () => {
        return (
          <DeleteIcon />
        )
      },
      handleClickMethod: 'handleOnClickDelete',
      badge: {
        color: 'error'
      }
    }
  ]

  // ---------------------------------------------------------

  // Delete helpers -------------------------------------
  const handleDelete = async() => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };
    for (let i = 0; i < selectedRows.length; i++) {
        const res = await fetch(
            `http://localhost:3000/api/qa-checklists/${selectedRows[i]}`,
            requestOptions
          )
        const result = await res.json()
        console.log(`${selectedRows[i]} was deleted`)
    }

    
    handleAlertOpen(
        `Deleted Checklists successfully!`,
        'success'
    );


    const remainingChecklists = checklists.filter(checklist => !selectedRows.includes(checklist.id))
    setChecklists(remainingChecklists)
    setSelectedRows([])
  }

  // Create Dialog helpers ------------------------------------
  const addChecklist = (newChecklist) => {
    const newChecklists = [...checklists, newChecklist]
    setChecklists(newChecklists)
    handleAlertOpen(
      `Created checklist ${newChecklist.id} successfully!`,
      'success'
    );
  }
  // ----------------------------------------------------------

  // Update Dialog helpers ------------------------------------
  const updateChecklists = (newChecklist) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === newChecklist.id) {
        return newChecklist
      } else {
        return checklist
      }
    })
    setChecklists(updatedChecklists)
    handleAlertOpen(
      `Updated checklist ${newChecklist.id} successfully!`,
      'success'
    );
  }
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
      <Box sx={{pt: 4, pb: 4}} component="main">
        {/* toolbar for create and delete */}
        <GenericToolbar 
        tools={tools} 
        disabled={disabled} 
        title='QA Checklists'
        selectedRows={selectedRows}
        handleOpenCreateDialog={handleOpenCreateDialog}
        handleOnClickDelete={handleOnClickDelete}>
        </GenericToolbar>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>View/Update</MenuItem>
        </Menu>

        {/* update Dialog */}
        {openUpdateDialog ? <UpdateDialogChecklist 
        openUpdateDialog={openUpdateDialog}
        setOpenUpdateDialog={setOpenUpdateDialog}
        updateChecklists={updateChecklists}
        columnsForRules={columnsForRules}
        rules={allRules}
        rowToEdit={rowToEdit}/> : <></> }
        

        {/* create Dialog */}
        {openCreateDialog ? <CreateDialogChecklist
        openCreateDialog={openCreateDialog}
        setOpenCreateDialog={setOpenCreateDialog}
        addChecklist={addChecklist}
        columnsForRules={columnsForRules}
        rules={allRules}/> : <></> }
       

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
         dialogAction={handleDelete}/>

        {/* Data grid */}
        <Card>
          <Box sx={{ minWidth: 1050 }}>
            <DataGrid
              autoHeight
              rows={checklists}
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
      
    </>
  )
}

export default qaChecklists