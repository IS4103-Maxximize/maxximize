import { React, useState, useEffect } from 'react';
import { Card, Box, Alert, Collapse, Tooltip, Stack, TextField, InputAdornment, SvgIcon, Badge, Menu, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import { RelationsDialog } from './RelationsDialog';
import { Search as SearchIcon } from '../../icons/search';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotificationAlert } from '../notification-alert';
import MoreVert from '@mui/icons-material/MoreVert';
import { UpdateRelationsDialog } from './updateRelationsDialog';
import { BusinessPartnerConfirmDialog } from './BusinessPartnerConfirmDialog';

export const SuppliersList = ({orgId}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([])
  const [selectionModel, setSelectionModel] = useState([]);
  const [search, setSearch] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [rowToEdit, setRowToEdit] = useState('')
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const menuButton = (params) => {
    return (
      <IconButton onClick={(event) => {
        setRowToEdit(params.row);
        handleMenuClick(event);
        }}>
        <MoreVert/>
      </IconButton>
    );
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const handleMenuClose = (type) => {
    if (type === 'update') {
      if (rowToEdit) {
        setOpenUpdateDialog(true)
      }
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    retrieveSuppliers();
  }, []);

  const retrieveSuppliers = async () => {
    const suppliersList = await fetch(
      'http://localhost:3000/api/shell-organisations'
      
    );
    const queries = await suppliersList.json();
    const result = queries.filter( query => query.type === 'supplier');
    setSuppliers(result);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false)
  }
  
  const handleOpenConfirmationDialog = () => {
    setOpenConfirmationDialog(true)
  }

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
  
  const addOrganisation = (supplier) => {
    try {
      const updatedSuppliers = [...suppliers, supplier];
      setSuppliers(updatedSuppliers);
      handleAlertOpen(
        `Created Business Partner ${supplier.id} successfully!`,
        'success'
      );
    } catch {
      console.log('An erorr occured please try again later');
    }
  };

  const updateOrganisation = (supplier) => {
    const indexOfEditOrg = suppliers.findIndex(currentSupplier => currentSupplier.id === supplier.id)
    const newSuppliers = [...suppliers]
    newSuppliers[indexOfEditOrg] = supplier
    setSuppliers(newSuppliers)
    handleAlertOpen(
      `Updated Business Partner Details ${supplier.id} successfully!`,
      'success'
    );
  }

//   Search functionality
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase())
  };

  useEffect(() => {
    const filteredRows = suppliers.filter(supplier => supplier.name.toLowerCase().includes(search))
    setFilteredSuppliers(filteredRows)
  }, [search, suppliers])


  //on row select
  useEffect(() => {
    setDisabled(selectionModel.length === 0)
  }, [selectionModel]);

  const handleDelete = async() => {
    
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };
    for (let i = 0; i < selectionModel.length; i++) {
        const res = await fetch(
            `http://localhost:3000/api/shell-organisations/${selectionModel[i]}`,
            requestOptions
          )
        const result = await res.json()
        console.log(`${selectionModel[i]} was deleted`)
    }

    
    handleAlertOpen(
        `Deleted Business Partner successfully!`,
        'success'
    );


    const remainingSuppliers = suppliers.filter(supplier => !selectionModel.includes(supplier.id))
    setSuppliers(remainingSuppliers)
    setSelectionModel([])
    
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Supplier ID',
      width: 150,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    {
      field: 'uen',
      headerName: 'UEN',
      width: 200,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      editable: true,
      valueGetter: (params) => {
        if (params.row.contact.address) {
            return params.row.contact.address
        } else {
            return ''
        }
      }
    },
    {
      field: 'phoneNumber',
      headerName: 'Contact',
      width: 150,
      editable: true,
      valueGetter: (params) => {
        if (params.row?.contact?.phoneNumber) {
            return params.row.contact.phoneNumber
        } else {
            ''
        }
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: true,
      valueGetter: (params) => {
        if (params.row.contact.email) {
            return params.row.contact.email
        } else {
            return ''
        }
      }
    },
    {
      field: 'postalCode',
      headerName: 'Postal Code',
      width: 200,
      editable: true,
      valueGetter: (params) => {
        if (params.row.contact.postalCode) {
            return params.row.contact.postalCode
        } else {
            return ''
        }
      }
    },
    {
      field: 'actions',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: menuButton
    }

  ];

  return (
    <>
    <NotificationAlert
      open={alertOpen}
      severity={alertSeverity}
      text={alertText}
      handleClose={handleAlertClose}
    />
    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
      <MenuItem onClick={() => handleMenuClose('update')}>Update</MenuItem>
    </Menu>

    <UpdateRelationsDialog
      openUpdateDialog={openUpdateDialog} 
      setOpenUpdateDialog={setOpenUpdateDialog} 
      updateOrganisation={updateOrganisation} 
      type='supplier'
      rowData={rowToEdit}
    />
    <Box 
        sx={{ 
        alignItems: 'center', 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        m: -1, 
        }} 
    > 
        <Stack direction="row" spacing={1}> 
        <TextField 
            sx={{ width: 500, border: 1, borderRadius: 1}}
            InputProps={{ 
            startAdornment: ( 
                <InputAdornment position="start"> 
                <SvgIcon fontSize="small" color="action"> 
                    <SearchIcon /> 
                </SvgIcon> 
                </InputAdornment> 
            ), 
            }} 
            placeholder="Search Supplier" 
            variant="outlined" 
            type="search" 
            onChange={handleSearch} 
        /> 
        </Stack> 

      </Box>
    
      <Box mb={2} 
      sx={{ m: 1 }} 
      display="flex" 
      justifyContent="end">
      
          <Tooltip title={'Add new supplier'}>
            <IconButton onClick={handleOpenDialog}>
              <DomainAddIcon />
            </IconButton>
          </Tooltip>

          <RelationsDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            addOrganisation={addOrganisation}
            type='supplier'
            orgId={orgId}
          />

        <Tooltip title={'Update a supplier by clicking on the menu button at the end of the row'}>
          <IconButton>
            <HelpIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={'Delete Supplier (Single/Multiple)'}>
          <Badge badgeContent={selectionModel.length} color="error">
            <IconButton
            disabled={disabled}
              onClick={handleOpenConfirmationDialog}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Badge>
        </Tooltip>
        <BusinessPartnerConfirmDialog
                  open={openConfirmationDialog}
                  handleClose={handleCloseConfirmationDialog}
                  dialogTitle={`Delete supplier(s)`}
                  dialogContent={`Confirm deletion of supplier(s)?`}
                  dialogAction={() => {
                    const selectedIds = new Set(selectionModel);
                    handleDelete(selectedIds);
                  }}
                />
      </Box>

      <Card>
        <Box sx={{ minWidth: 1050 }}>
          <DataGrid
            autoHeight
            rows={filteredSuppliers}
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
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Card>
    </>
  )};