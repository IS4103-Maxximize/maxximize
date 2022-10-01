import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  AppBar,
  Autocomplete,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useState } from 'react';
import { ConfirmDialog } from '../assetManagement/confirm-dialog';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DayJS from 'dayjs';

export const ProductionOrderViewDialog = (props) => {
  const { productionOrder, openViewDialog, closeViewDialog } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

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

      prodOrders: productionOrder ? productionOrder.prodLineItems : null,
      userContact: productionOrder ? productionOrder.userContact : null,
      supplierContact: productionOrder ? productionOrder.supplierContact : null,
      poLineItems: productionOrder ? productionOrder.poLineItems : [],
      followUpLineItems: productionOrder
        ? productionOrder.followUpLineItems
        : [],
      quotation: productionOrder ? productionOrder.quotation : null,
      multiplier: 1,
      quantity: 0,
      bomId: null,
      daily: false,
      noOfDays: 0,
      prodLineItems: [],
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
        return params.row ? params.row.productionLine.id : '';
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
            <Box mr={'2%'} width="25%">
              {/* BOM Selection */}
              <Typography variant="h6">Required Quantity</Typography>
              <Card sx={{ marginTop: 2 }}>
                <Box margin={2}>
                  {/* Bill of Material */}
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="Bill of Material"
                      sx={{ width: '100%', mb: 1 }}
                      margin="normal"
                      name="bill-of-material"
                      value={formik.values.billOfMaterial}
                      variant="outlined"
                      disabled
                      size="small"
                    />
                  </Stack>

                  {/* Quantity per lot, Number of lots*/}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="baseline"
                    justifyContent="space-between"
                  >
                    <TextField
                      label="Quantity per lot"
                      sx={{ width: '49%', mb: 1 }}
                      margin="normal"
                      name="final-good-lotQuantity"
                      variant="outlined"
                      disabled
                      //   InputProps={{
                      //     endAdornment: (
                      //       <InputAdornment position="end">
                      //         {finalGood}
                      //       </InputAdornment>
                      //     ),
                      //   }}
                      size="small"
                    />
                    <TextField
                      disabled
                      sx={{ width: '49%', mb: 1 }}
                      error={Boolean(
                        formik.touched.multiplier && formik.errors.multiplier
                      )}
                      helperText={
                        formik.touched.multiplier && formik.errors.multiplier
                      }
                      label="Number of lot(s)"
                      margin="normal"
                      name="multiplier"
                      type="number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.multiplier}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>

                  {/* Daily and Lots */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="baseline"
                    justifyContent="flex-end"
                  >
                    <TextField
                      sx={{ width: '100%', mb: 1 }}
                      error={Boolean(
                        formik.touched.quantity && formik.errors.quantity
                      )}
                      helperText={
                        formik.touched.quantity && formik.errors.quantity
                      }
                      label="Production Quantity"
                      margin="normal"
                      name="quantity"
                      type="number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.quantity}
                      variant="outlined"
                      disabled
                      size="small"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="space-between"
                    marginBottom={1}
                  >
                    <FormControlLabel
                      disabled
                      sx={{ width: '50%' }}
                      error={Boolean(
                        formik.touched.daily && formik.errors.daily
                      )}
                      helperText={formik.touched.daily && formik.errors.daily}
                      value={formik.values.daily}
                      control={<Checkbox />}
                      label={
                        <Typography variant="body2">Produce Daily</Typography>
                      }
                    />
                    <Box display="flex" width="50%" alignItems="baseline">
                      <TextField
                        disabled
                        sx={{ width: '100%' }}
                        error={Boolean(
                          formik.touched.noOfDays && formik.errors.noOfDays
                        )}
                        helperText={
                          formik.touched.noOfDays && formik.errors.noOfDays
                        }
                        label="Number of Days"
                        margin="normal"
                        name="noOfDays"
                        type="number"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.noOfDays}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Stack>
                </Box>
              </Card>
            </Box>

            <Box width="75%">
              <Typography variant="h6">Schedule(s)</Typography>
              <Card sx={{ marginTop: 2 }}>
                <DataGrid
                  autoHeight
                  rows={schedules}
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
