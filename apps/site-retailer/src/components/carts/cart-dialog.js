import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  AppBar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useState } from 'react';

export const CartDialog = (props) => {
  const { open, handleClose, cart, handleAlertOpen } = props;

  const [purchaseOrders, setPurchaseOrder] = useState([]);

  // Submission
  // Loading buttons
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Checkout Cart
  const handleCheckout = async () => {
    console.log('Checkout');
    //     setLoading(true);
    //     const response = await fetch(
    //       `http://localhost:3000/api/applications/${application.id}`,
    //       {
    //         method: 'PATCH',
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           status: 'approved',
    //         }),
    //       }
    //     );

    //     if (response.status === 200 || response.status === 201) {
    //       const result = await response.json();

    //       retrieveAllApplications();

    //       setError('');
    //       handleAlertOpen(
    //         `Onboarded client organisation ${result.id} successfully`
    //       );
    //       formik.resetForm();
    //       handleClose();
    //       setLoading(false);
    //     } else {
    //       const result = await response.json();
    //       setError(result.message);
    //       setLoading(false);
    //     }
  };

  const formik = useFormik({
    initialValues: {
      supplierId: cart ? cart.supplierId : '',
    },
    enableReinitialize: true,
  });

  // Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Close dialog
  const onClose = () => {
    handleClose();
    setError('');
    setLoading(false);
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
      field: 'finalGoodName',
      headerName: 'Final Good Name',
      width: 200,
      flex: 3,
      valueGetter: (params) => {
        return params.row.finalGood.name ? params.row.finalGood.name : '';
      },
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 150,
      flex: 1,
      valueGetter: (params) => {
        return params.row.finalGood.unitPrice
          ? params.row.finalGood.unitPrice
          : '';
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 150,
      flex: 1,
      valueGetter: (params) => {
        return params.row.quantity ? params.row.quantity : '';
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        return params.row.finalGood.unitPrice * params.row.quantity;
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
  ];

  const rows = cart.cartLineItems;

  //Columns for datagrid, column headers & specs
  const poColumns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,
    },
    {
      field: 'finalGoodName',
      headerName: 'Final Good Name',
      width: 200,
      flex: 3,
      valueGetter: (params) => {
        return params.row.finalGood.name ? params.row.finalGood.name : '';
      },
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 150,
      flex: 1,
      valueGetter: (params) => {
        return params.row.finalGood.unitPrice
          ? params.row.finalGood.unitPrice
          : '';
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 150,
      flex: 1,
      valueGetter: (params) => {
        return params.row.quantity ? params.row.quantity : '';
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        return params.row.finalGood.unitPrice * params.row.quantity;
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
  ];

  const poRows = purchaseOrders;

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Dialog
          fullScreen
          open={open}
          onClose={onClose}
          aria-labelledby="responsive-dialog-title"
        >
          <AppBar color="primary" sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                disabled={loading}
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Cart
              </Typography>
              {loading ? (
                <LoadingButton
                  fullWidth
                  loading={loading}
                  loadingPosition="start"
                  size="medium"
                  variant="outlined"
                >
                  Loading
                </LoadingButton>
              ) : (
                <Button
                  disabled={!formik.isValid || formik.isSubmitting}
                  autoFocus
                  color="inherit"
                  size="medium"
                  onClick={handleCheckout}
                  variant="outlined"
                >
                  Checkout
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Box mr={2} flex={1}>
              <Typography variant="h6" component="div">
                Details
              </Typography>
              <TextField
                disabled
                color="primary"
                error={Boolean(
                  formik.touched.supplierId && formik.errors.supplierId
                )}
                fullWidth
                helperText={
                  formik.touched.supplierId && formik.errors.supplierId
                }
                label="Supplier ID"
                margin="normal"
                name="supplierId"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.supplierId}
                variant="outlined"
                size="small"
              />
            </Box>
            <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
              Cart Line Items
            </Typography>
            <Card>
              <Box>
                <DataGrid
                  autoHeight
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  allowSorting={true}
                  //   components={{
                  //     Toolbar: GridToolbar,
                  //   }}
                  disableSelectionOnClick
                  //   checkboxSelection={true}
                  //   onSelectionModelChange={(ids) => {
                  //     setSelectionModel(ids);
                  //   }}
                  //   editMode="row"
                  //   experimentalFeatures={{ newEditingApi: true }}
                />
              </Box>
            </Card>
            <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
              Purchase Orders
            </Typography>
            <Card>
              <Box>
                <DataGrid
                  autoHeight
                  rows={poRows}
                  columns={poColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  allowSorting={true}
                  //   components={{
                  //     Toolbar: GridToolbar,
                  //   }}
                  disableSelectionOnClick
                  //   checkboxSelection={true}
                  //   onSelectionModelChange={(ids) => {
                  //     setSelectionModel(ids);
                  //   }}
                  //   editMode="row"
                  //   experimentalFeatures={{ newEditingApi: true }}
                />
              </Box>
            </Card>
            <Box display="flex" justifyContent={'center'}>
              <Typography variant="caption" color="red">
                {error}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
};
