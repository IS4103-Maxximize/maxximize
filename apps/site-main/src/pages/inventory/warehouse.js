import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { NotificationAlert } from '../../components/notification-alert';
import { WarehouseToolbar } from '../../components/inventory/warehouse/warehouse-toolbar';
import { CreateWarehouseDialog } from '../../components/inventory/warehouse/create-warehouse-dialog';
import { WarehouseConfirmDialog } from '../../components/inventory/warehouse/warehouse-confirm-dialog';
import { useNavigate } from 'react-router-dom';
import DayJS from 'dayjs';

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of warehouses, initial
  useEffect(() => {
    retrieveAllWarehouses();
    retrieveStagingBatchLineItems();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all warehouses
  const retrieveAllWarehouses = async () => {
    const response = await fetch(
      `http://localhost:3000/api/warehouses/all/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
      console.log(result);
    }

    setWarehouses(result);
  };

  // Unallocated batch line items
  const [stagingBatchLineItems, setStagingBatchLineItems] = useState([]);

  const retrieveStagingBatchLineItems = async () => {
    const response = await fetch(
      `http://localhost:3000/api/batch-line-items/findAllByOrgId/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
      console.log(result);
      result = result.filter((lineItems) => !lineItems.code);
      console.log(result);
    }

    setStagingBatchLineItems(result);
  };

  // Selecting the unallocated line items for allocation
  const [selectedUnallocatedRows, setSelectedUnallocatedRows] = useState([]);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (selectedUnallocatedRows.length > 0) checkBinAvailability();
    if (selectedUnallocatedRows.length === 0) setAvailable(false);
  }, [selectedUnallocatedRows]);

  // Check bin volumetric space against line items
  const checkBinAvailability = async () => {
    const idsOfUnallocated = selectedUnallocatedRows.join(',');

    const response = await fetch(
      `http://localhost:3000/api/batch-line-items/checkBinCapacityAgainstLineItems?batchLineItemsIds=${idsOfUnallocated}?organisationId=${organisationId}`
    );
    if (response.status == 200 || response.status == 201) {
      const result = await response.json();
      setAvailable(result);

      if (!result) {
        handleAlertOpen('Not enough space in bin to auto allocate', 'error');
      }
    }
  };

  // Perform auto allocation, only if the bin is available
  const autoAllocateLineItems = async () => {
    console.log(selectedUnallocatedRows);

    const response = await fetch(
      'http://localhost:3000/api/batch-line-items/autoAllocate',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchLineItemIds: selectedUnallocatedRows,
          organisationId: organisationId,
        }),
      }
    );

    if (response.status == 200 || response.status == 201) {
      retrieveStagingBatchLineItems();
      handleAlertOpen('Successfully allocated batch line item(s)');
    }
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Action Menu
  const [anchorElUpdate, setAnchorElUpdate] = useState(null);
  const actionMenuOpen = Boolean(anchorElUpdate);
  const handleActionMenuClick = (event) => {
    setAnchorElUpdate(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setAnchorElUpdate(null);
  };

  const menuButton = (params) => {
    return (
      <IconButton
        // disabled={params.row.bins?.length == 0}
        onClick={(event) => {
          setSelectedRow(params.row);
          handleActionMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  //Alert Notification
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
    setAlertSeverity('success');
  };

  // Dialog helpers
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  //Add a new warehouse entry to the list
  const addWarehouse = (warehouse) => {
    try {
      const updatedWarehouses = [...warehouses, warehouse];

      setWarehouses(updatedWarehouses);
    } catch {
      console.log('An error occured please try again later');
    }
  };

  //Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  //Handle Delete
  //Deleting a warehouse entry
  //Also alerts user of ourcome
  const handleDelete = async (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
    };

    selectedIds.forEach((currentId) => {
      fetch(`http://localhost:3000/api/warehouses/${currentId}`, requestOptions)
        .then(() => {
          handleAlertOpen(`Successfully deleted warehouse(s)`, 'success');
        })
        .catch((error) => {
          handleAlertOpen(`Failed to delete warehouse(s):${error}`, 'error');
        });
    });

    setWarehouses(
      warehouses.filter((warehouse) => !selectedIds.includes(warehouse.id))
    );
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
      width: 200,
      flex: 4,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
      flex: 6,
    },
  ];

  const unallocatedColumns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 3,
      width: 300,
      valueGetter: (params) => {
        if (params.row.product?.name) {
          return params.row.product?.name;
        } else {
          return '';
        }
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      width: 120,
      editable: false,
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      flex: 2,
      width: 120,
      editable: false,
      valueFormatter: (params) => DayJS(params?.value).format('DD MMM YYYY'),
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = warehouses;
  const unallocatedRows = stagingBatchLineItems;

  //Navigate to the bin page
  const navigate = useNavigate();
  const handleRowClick = (rowData) => {
    navigate('rack', {
      state: { warehouseId: rowData.id },
    });
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Warehouse | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <CreateWarehouseDialog
        open={open}
        setOpen={setOpen}
        addWarehouse={addWarehouse}
        handleAlertOpen={handleAlertOpen}
      />
      <WarehouseConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Delete Warehouse(s)`}
        dialogContent={`Confirm deletion of Warehouse(s)?`}
        dialogAction={() => {
          handleDelete(selectedRows);
        }}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <WarehouseToolbar
            disabled={disabled}
            numWarehouse={selectedRows.length}
            handleClickOpen={handleClickOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
            handleSearch={handleSearch}
          />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box sx={{ minWidth: 1050 }}>
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
                  checkboxSelection
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                  isRowSelectable={(params) => {
                    return params.row.racks?.length === 0;
                  }}
                  onRowClick={(rowData) => handleRowClick(rowData)}
                />
              </Box>
            </Card>

            <Box mt={5} display="flex" justifyContent="space-between">
              <Typography variant="h5">
                Unallocated Batch Line Items (Staging)
              </Typography>
              <Button
                variant="contained"
                onClick={autoAllocateLineItems}
                disabled={!available}
              >
                Allocate
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Card>
                <Box sx={{ minWidth: 1050 }}>
                  <DataGrid
                    autoHeight
                    minHeight="500"
                    rows={unallocatedRows.filter((row) => {
                      if (search === '') {
                        return row;
                      } else {
                        return row.product.name.toLowerCase().includes(search);
                      }
                    })}
                    columns={unallocatedColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    allowSorting={true}
                    components={{
                      Toolbar: GridToolbar,
                    }}
                    checkboxSelection
                    onSelectionModelChange={(ids) => {
                      setSelectedUnallocatedRows(ids);
                    }}
                    disableSelectionOnClick
                  />
                </Box>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Warehouse;
