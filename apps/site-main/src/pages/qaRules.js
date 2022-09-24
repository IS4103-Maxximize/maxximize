import { Box, Card, Menu, MenuItem, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpIcon from '@mui/icons-material/Help';
import { useEffect, useState } from 'react';
import GenericToolbar from '../components/generic-toolbar';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVert from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs'
import { CreateDialog } from '../components/quality-assurance/CreateDialog';
import { NotificationAlert } from '../components/notification-alert';
import { ConfirmationDialog } from '../components/quality-assurance/confirmationDialog';
import { UpdateDialog } from '../components/quality-assurance/UpdateDialog';


function qaRules() {
  const [rules, setRules] = useState([])
  const [ruleCategories, setRuleCategories] = useState([])
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [rowToEdit, setRowToEdit] = useState()
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl);
  useEffect(() => {
    const organisationId = JSON.parse(localStorage.getItem('user')).organisation.id
    const retrieveRulesByOrg = async(id) => {
      const response = await fetch(`http://localhost:3000/api/qa-rules/orgId/${id}`)
      if (response.status === 200 || response.status === 201) {
        const result = await response.json()
        setRules(result)
      }
    }
    const retrieveCategories = async() => {
      const response = await fetch(`http://localhost:3000/api/qa-rules/ruleCategories`)
      const result = await response.json()
      setRuleCategories(result)
    }
    retrieveCategories()
    retrieveRulesByOrg(organisationId)
  }, [])

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
      field: 'title',
      headerName: 'title',
      flex: 2
    },
    {
      field: 'description',
      headerName: 'description',
      flex: 2
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
      field: 'category',
      headerName: 'category',
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'actions',
      flex: 1,
      sortable: false,
      renderCell: menuButton
    }

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
      toolTipTitle: 'Add new QA rule',
      handleClickMethod: 'handleOpenCreateDialog',
      button: () => {
        return (
          <AddCircleOutlineIcon />
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
      toolTipTitle: "delete rule(s)",
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
            `http://localhost:3000/api/qa-rules/${selectedRows[i]}`,
            requestOptions
          )
        const result = await res.json()
        console.log(`${selectedRows[i]} was deleted`)
    }

    
    handleAlertOpen(
        `Deleted Rules successfully!`,
        'success'
    );


    const remainingRules = rules.filter(rule => !selectedRows.includes(rule.id))
    setRules(remainingRules)
    setSelectedRows([])
  }

  // Create Dialog helpers ------------------------------------
  const addRules = (newRule) => {
    const newRules = [...rules, newRule]
    setRules(newRules)
    handleAlertOpen(
      `Created rules ${newRule.id} successfully!`,
      'success'
    );
  }
  // ----------------------------------------------------------

  // Update Dialog helpers ------------------------------------
  const updateRules = (newRule) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === newRule.id) {
        return newRule
      } else {
        return rule
      }
    })
    setRules(updatedRules)
    handleAlertOpen(
      `Updated rule ${newRule.id} successfully!`,
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
        title='QA Rules'
        selectedRows={selectedRows}
        handleOpenCreateDialog={handleOpenCreateDialog}
        handleOnClickDelete={handleOnClickDelete}>
        </GenericToolbar>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>View/Update</MenuItem>
        </Menu>

        {/* update Dialog */}
        {openUpdateDialog ? <UpdateDialog 
        openUpdateDialog={openUpdateDialog}
        setOpenUpdateDialog={setOpenUpdateDialog}
        updateRules={updateRules}
        ruleCategoryOptions={ruleCategories}
        rowToEdit={rowToEdit}/> : <></>}
        

        {/* create Dialog */}
        <CreateDialog 
        openCreateDialog={openCreateDialog} 
        setOpenCreateDialog={setOpenCreateDialog}
        addRules={addRules}
        ruleCategoryOptions={ruleCategories}/>

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
         dialogTitle={`Delete Rule(s) ?`}
         dialogContent={`Confirm deletion of rule(s)?`}
         dialogAction={handleDelete}/>

        {/* Data grid */}
        <Card>
          <Box sx={{ minWidth: 1050 }}>
            <DataGrid
              autoHeight
              rows={rules}
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

export default qaRules