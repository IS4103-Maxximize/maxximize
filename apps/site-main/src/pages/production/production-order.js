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
import { ConfirmDialog } from '../../components/product/confirm-dialog';
import { ProductMenu } from '../../components/product/product-menu';
import { ProductionOrderCreateDialog } from '../../components/production-order/production-order-create-dialog';
import { Toolbar } from '../../components/toolbar';

export const ProductionOrder = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Production Order';

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Selected Row IDs
  const [selectedRow, setSelectedRow] = useState();

  const getProductionOrders = async () => {
    // fetchProdOrders(organisationId)
    //   .then(res => setRows(res))
    //   .catch(err => handleAlertOpen('Failed to fetch Production Orders', 'error'))
  };

  useEffect(() => {
    // get Prod Orders
    setLoading(true);
    getProductionOrders();
  }, []);

  useEffect(() => {
    // show page after fetching data
    // console.log(rows);
    setLoading(false);
  }, [rows]);

  // Alert Helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error'); // success || error
  const [alertText, setAlertText] = useState('');
  const handleAlertOpen = (text, severity) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Toolbar Helpers
  // Searchbar
  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };
  // Add Button
  const handleAddClick = () => {
    // setAction('POST');
    setSelectedRow(null);
  };
  // Delete Button
  const deleteDisabled = Boolean(selectedRows.length === 0);

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

  const menuButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          // console.log(params.row)
          setSelectedRow(params.row);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  // Create Dialog Helpers
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  useEffect(() => {
    if (!createDialogOpen) {
      setLoading(true);
      getProductionOrders();
    }
    if (createDialogOpen) {
      // console.log(selectedRow);
    }
  }, [createDialogOpen]);

  // Update Dialog Helpers
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const handleUpdateDialogOpen = () => {
    setUpdateDialogOpen(true);
  };
  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
  };

  useEffect(() => {
    console.log(updateDialogOpen);
    if (!updateDialogOpen) {
      setLoading(true);
      getProductionOrders();
    }
    if (updateDialogOpen) {
      console.log(selectedRow);
    }
  }, [updateDialogOpen]);

  // ConfirmDialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // CRUD handlerss
  const handleDelete = async (ids) => {
    setSelectedRows([]);
    // deleteProductionOrders(ids)
    //   .then(() => handleAlertOpen('Successfully deleted Production Order(s)!', 'success'))
    //   .then(() => getProdOrders());
  };

  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'PO ID',
      flex: 1,
    },
    {
      field: 'plannedQuantity',
      headerName: 'Planned Quantity',
      flex: 2,
    },
    {
      field: 'daily',
      headerName: 'Daily / Adhoc',
      flex: 1,
      valueGetter: (params) => {
        return params.row.daily ? 'Daily' : 'Adhoc';
      },
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      renderCell: menuButton,
    },
  ];

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Production Order | ${user?.organisation?.name}`}</title>
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
            key="notification-alert"
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <Toolbar
            key="toolbar"
            name={name}
            numRows={selectedRows.length}
            deleteDisabled={deleteDisabled}
            handleSearch={handleSearch}
            handleAdd={handleAddClick}
            handleFormDialogOpen={handleCreateDialogOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <ProductionOrderCreateDialog
            key="prod-order-create-dialog"
            open={createDialogOpen}
            handleClose={handleCreateDialogClose}
            string={name}
            handleAlertOpen={handleAlertOpen}
          />
          {/* <BOMUpdateDialog
            key="bom-update-dialog"
            open={updateDialogOpen}
            handleClose={handleUpdateDialogClose}
            string={'Bill Of Material'}
            bom={selectedRow}
            handleAlertOpen={handleAlertOpen}
          /> */}
          <ProductMenu
            key="prod-order-menu"
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleUpdateDialogOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleClickViewEdit}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete ${name}(s)`}
            dialogContent={`Confirm deletion of ${name}(s)?`}
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
                  return row.id.toString().includes(search);
                })}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                disableSelectionOnClick
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
                  <Typography>{`No ${name}s Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

ProductionOrder.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductionOrder;
