import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useFormik } from 'formik';
import { useState } from 'react';
import { PurchaseRequisitionNew } from '../../pages/procurement/purchase-requisition-new';
import { ConfirmDialog } from '../assetManagement/confirm-dialog';

export const ProductionOrderViewDialog = (props) => {
  const {
    productionOrder,
    openViewDialog,
    closeViewDialog,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // PR Dialog Helpers
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  // State for confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Handle closing of dialog
  const onClose = () => {
    formik.resetForm();
    closeViewDialog();
  };

  // Handle sending of product requisition, likely open another dialog/page
  const handleSendProductRequisition = () => {
    // When ProdO status is still created, there is insufficient quantity of ProdO Line items
    // Require to send product Requisition
    handleCreateDialogOpen();
  };

  // Handle release of production order
  const handleRelease = () => {
    // When the ProdO status changes to readytorelease,
    // Button to release will appear to prompt user to confirm release
  };

  const formik = useFormik({
    initialValues: {
      id: productionOrder ? productionOrder.id : null,
      status: productionOrder ? productionOrder.status : '',
      daily: productionOrder ? productionOrder.daily : false,
      quantity: productionOrder ? productionOrder.plannedQuantity : null,
      prodLineItems: productionOrder ? productionOrder.prodLineItems : [],
      schedules: productionOrder ? productionOrder.schedules : [],
    },
    enableReinitialize: true,
    onSubmit: handleRelease,
  });

  // Schedule Headers
  const scheduleColumns = [
    {
      field: 'start',
      headerName: 'Start Time',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.start : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'end',
      headerName: 'End Time',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.end : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'productionLineId',
      headerName: 'Production Line ID',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.productionLineId : '';
      },
    },
  ];

  // Prod Line Item Headers
  const productionOrderColumns = [
    {
      field: 'rawMaterial',
      headerName: 'Raw Material',
      flex: 2,
      valueGetter: (params) => {
        return params.row
          ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}] `
          : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity Required',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.unit : '';
      },
    },
    {
      field: 'sufficient',
      headerName: 'Sufficient Status',
      flex: 1,
      renderCell: (params) => {
        return params.row.sufficient ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        );
      },
    },
  ];

  const schedules = [];

  return (
    <form onSubmit={formik.handleSubmit}>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        dialogTitle={`Release Production Order`}
        dialogContent={`Confirm release of production order?`}
        dialogAction={handleRelease}
      />
      <PurchaseRequisitionNew
        key="purchase-req-new"
        open={createDialogOpen}
        handleClose={handleCreateDialogClose}
        string={'Purchase Requisition'}
        prodOrderId={productionOrder ? productionOrder.id : ''}
        prodLineItems={formik.values.prodLineItems}
        handleAlertOpen={handleAlertOpen}
        handleAlertClose={handleAlertClose}
      />
      <Dialog fullScreen open={openViewDialog} onClose={onClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              View Production Order
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ backgroundColor: '#F9FAFC' }}>
          <Box display="flex">
            <Box width="100%">
              <Typography variant="h6">Schedule(s)</Typography>
              <Card sx={{ marginTop: 2 }}>
                <DataGrid
                  autoHeight
                  rows={formik.values.schedules}
                  columns={scheduleColumns}
                  pageSize={10}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  // experimentalFeatures={{ newEditingApi: true }}
                  // processRowUpdate={handleRowUpdate}
                  sx={{ marginLeft: 1, marginRight: 1, marginBottom: 1 }}
                />
              </Card>
              <Typography sx={{ marginTop: 2 }} variant="h6">
                Production Line Items
              </Typography>
              <Card sx={{ marginTop: 2, marginBottom: 2 }}>
                <DataGrid
                  autoHeight
                  rows={formik.values.prodLineItems}
                  columns={productionOrderColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  // experimentalFeatures={{ newEditingApi: true }}
                  // processRowUpdate={handleRowUpdate}
                  sx={{ marginLeft: 1, marginRight: 1, marginBottom: 1 }}
                />
              </Card>

              {productionOrder?.status == 'created' ? (
                <Button
                  variant="contained"
                  onClick={handleSendProductRequisition}
                >
                  Send Product Requisition
                </Button>
              ) : (
                <></>
              )}

              {productionOrder?.status == 'readytorelease' ? (
                <Button variant="contained" onClick={handleRelease}>
                  Release
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </form>
  );
};
