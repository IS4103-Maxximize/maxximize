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
import { ProductionOrderMenu } from '../../components/production-order/production-order-menu';
import { ProductionOrderViewDialog } from '../../components/production-order/production-order-view-dialog';
import { SeverityPill } from '../../components/severity-pill';
import { Toolbar } from '../../components/toolbar';
import { prodOrderStatusColorMap, prodOrderStatusStringMap } from '../../helpers/constants';

export const ProductionOrder = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Production Order';

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [productionOrders, setProductionOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Selected Row IDs
  const [selectedRow, setSelectedRow] = useState();

  useEffect(()=> console.log(selectedRow), [selectedRow])

  const getProductionOrders = async () => {
    const response = await fetch(
      `http://localhost:3000/api/production-orders/all/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }

    setProductionOrders(result);
  };

  useEffect(() => {
    // Get Prod Orders
    getProductionOrders();
  }, []);

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

  // Add Production Order entry
  const addProductionOrder = (productionOrder) => {
    try {
      const updatedProductionOrders = [...productionOrders, productionOrder];

      setProductionOrders(updatedProductionOrders);
    } catch {
      console.log('An error occured please try again later');
    }
  };

  // Update production order status to released
  const updateProductionOrders = (productionOrder) => {
    const indexOfEditProductionOrder = productionOrders.findIndex(
      (currentProductionOrder) =>
        currentProductionOrder.id === productionOrder.id
    );
    const newProductionOrders = [...productionOrders];
    newProductionOrders[indexOfEditProductionOrder] = productionOrder;
    setProductionOrders(newProductionOrders);
    handleAlertOpen(
      `Updated Production Order ${productionOrder.id} successfully!`,
      'success'
    );
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

  // Create Dialog Helpers
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  //View Dialog Helper
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    if (selectedRow?.status == 'readytorelease') {
      retrievePossibleSchedules();
    }

    // const getProductionOrdersAfterPR = async () => {
    //   const response = await fetch(
    //     `http://localhost:3000/api/production-orders/all/${organisationId}`
    //   );

    //   let result = [];

    //   if (response.status == 200 || response.status == 201) {
    //     result = await response.json();
    //   }

    //   setProductionOrders(result);
    // };

    setTimeout(getProductionOrders, 500);
    // getProductionOrdersAfterPR();
    // clearTimeout(timeoutProdO)
  }, [openViewDialog, createDialogOpen]);

  //Use this to store the new row with a schedule, just for display
  const [tempSelectedRow, setTempSelectedRow] = useState('');
  // Earliest Schedules for final product
  const retrievePossibleSchedules = async () => {
    const response = await fetch(
      `http://localhost:3000/api/production-lines/earliestSchedules?quantity=${
        selectedRow.plannedQuantity
      }&finalGoodId=${selectedRow.bom.finalGood.id}&daily=${
        selectedRow.daily
      }&days=${0}&organisationId=${organisationId}`
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      selectedRow.schedules = result;

      setTempSelectedRow(selectedRow);
    } else {
      const result = await response.json();
    }
  };

  const handleOpenViewDialog = () => {
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  // Confirm Dialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // CRUD handlers
  const handleDelete = async (selectedIds) => {
    setSelectedRows([]);
    const requestOptions = {
      method: 'DELETE',
    };

    selectedIds.forEach((currentId) => {
      fetch(
        `http://localhost:3000/api/production-orders/${currentId}`,
        requestOptions
      )
        .then(() => {
          handleAlertOpen(
            `Successfully deleted production orders(s)`,
            'success'
          );
        })
        .catch((error) => {
          handleAlertOpen(
            `Failed to delete production orders(s):${error}`,
            'error'
          );
        });
    });

    setProductionOrders(
      productionOrders.filter(
        (productionOrder) => !selectedIds.includes(productionOrder.id)
      )
    );
  };

  const rows = productionOrders;

  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'Production Order ID',
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
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => 
        params.row ? 
        <SeverityPill color={prodOrderStatusColorMap[params.row.status]}>
          {prodOrderStatusStringMap [params.row.status]}
        </SeverityPill> 
        : ''
    },
    {
      field: 'actions',
      headerName: 'Action',
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
            addProductionOrder={addProductionOrder}
            handleAlertOpen={handleAlertOpen}
          />
          <ProductionOrderMenu
            key="prod-order-menu"
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleOpenViewDialog}
          />
          {openViewDialog ? (
            <ProductionOrderViewDialog
              productionOrder={
                selectedRow?.status == 'readytorelease'
                  ? tempSelectedRow
                  : selectedRow
              }
              openViewDialog={openViewDialog}
              closeViewDialog={handleCloseViewDialog}
              handleAlertOpen={handleAlertOpen}
              handleAlertClose={handleAlertClose}
            />
          ) : (
            <></>
          )}
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
            <Card>
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
                  isRowSelectable={(params) => params.row.status == 'created'}
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
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

ProductionOrder.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductionOrder;
