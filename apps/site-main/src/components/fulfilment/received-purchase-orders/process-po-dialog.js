import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import DayJS from 'dayjs';
import { Box } from '@mui/system';
import { ReceivedPurchaseOrderConfirmDialog } from './received-po-confirm-dialog';

export const ProcessPurchaseOrderDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { open, handleClose, purchaseOrder, handleAlertOpen } = props;

  // Formik Helpers
  const initialValues = {
    created: purchaseOrder
      ? DayJS(purchaseOrder.created).format('DD MMM YYYY hh:mm a')
      : '',
    totalPrice: purchaseOrder ? purchaseOrder.totalPrice : 0,
    leadTime: purchaseOrder ? purchaseOrder.quotation.leadTime : '',
    purchaseOrderId: purchaseOrder ? purchaseOrder.id : '',
    purchaseOrderLineItems: purchaseOrder ? purchaseOrder.poLineItems : [],
  };

  //   const schema = Yup.object({
  //     totalPrice: Yup.number().positive().required('Total Price is required'),
  //     leadTime: Yup.number()
  //       .integer()
  //       .positive()
  //       .required('Lead Time is Required'),
  //   });

  // Handle on submit may be more of a redirecting function to another dialog
  // The next dialog will handle reserve, creation of Prod R and DR
  const handleOnSubmit = async (values) => {
    // const response = await fetch('http://localhost:3000/api/quotations', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     organisationId: organisationId,
    //     name: formik.values.name,
    //     address: formik.values.address,
    //     description: formik.values.description,
    //   }),
    // });
    // if (response.status === 200 || response.status === 201) {
    //   const result = await response.json();
    //   handleAlertOpen(`Sent Quotation ${result.id} successfully`);
    //   setError('');
    //   handleClose();
    // } else {
    //   const result = await response.json();
    //   setError(result.message);
    // }
  };

  // TODO Accept a purchase order (Status change)
  const handleAccept = async () => {
    return;
  };

  // TODO Reject a purchase order (Status change)
  const handleReject = async () => {
    return;
  };

  const onClose = () => {
    formik.setFieldValue('poLineItems', []);
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: schema,
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  useEffect(() => {
    formik.setFieldValue(
      'purchaseOrderLineItems',
      purchaseOrder
        ? purchaseOrder.poLineItems?.map((item) => {
            return {
              id: item.id,
              price: item.price,
              quantity: item.quantity,
              rawMaterial: item.rawMaterial,
              finalGood: item.finalGood,
            };
          })
        : []
    );
  }, [open]);

  // Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // DataGrid Helpers
  const columns = [
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.skuCode : '';
      },
    },
    {
      field: 'finalName',
      headerName: 'Final Good Name',
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.name : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.unit : '';
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.price : '';
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        return params.row.price * params.row.quantity;
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
  ];

  return (
    <>
      <ReceivedPurchaseOrderConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Reject Purchase Order`}
        dialogContent={`Confirm rejection of purchase order?`}
        dialogAction={handleReject}
      />
      <form onSubmit={formik.handleSubmit}>
        <Dialog fullScreen open={open} onClose={onClose}>
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
                View Purchase Order
              </Typography>
              {purchaseOrder?.status === 'pending' ? (
                <>
                  <Button
                    autoFocus
                    color="error"
                    size="medium"
                    type="submit"
                    variant="contained"
                    onClick={handleConfirmDialogOpen}
                    sx={{ marginRight: 2 }}
                  >
                    Reject
                  </Button>
                  <Button
                    autoFocus
                    color="inherit"
                    size="medium"
                    type="submit"
                    variant="outlined"
                    onClick={handleAccept}
                  >
                    Accept
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Toolbar>
          </AppBar>
          <DialogContent>
            <TextField
              fullWidth
              error={Boolean(formik.touched.id && formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
              label="Purchase Order ID"
              margin="normal"
              name="id"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.purchaseOrderId}
              variant="outlined"
              disabled
              size="small"
            />
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" justifyContent="space-between" width="60%">
                <TextField
                  error={Boolean(
                    formik.touched.created && formik.errors.created
                  )}
                  helperText={formik.touched.created && formik.errors.created}
                  label="Date Created"
                  margin="normal"
                  name="created"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.created}
                  variant="outlined"
                  disabled
                  sx={{ width: '79%' }}
                  size="small"
                />
                <TextField
                  disabled
                  error={Boolean(
                    formik.touched.leadTime && formik.errors.leadTime
                  )}
                  helperText={formik.touched.leadTime && formik.errors.leadTime}
                  label="Lead Time"
                  margin="normal"
                  name="leadTime"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.leadTime}
                  variant="outlined"
                  sx={{ width: '20%' }}
                  size="small"
                />
              </Box>
              <TextField
                error={Boolean(
                  formik.touched.totalPrice && formik.errors.totalPrice
                )}
                helperText={
                  formik.touched.totalPrice && formik.errors.totalPrice
                }
                label="Total Price"
                margin="normal"
                name="totalPrice"
                type="number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.totalPrice}
                variant="outlined"
                disabled
                sx={{ width: '13%' }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Box>

            <DataGrid
              autoHeight
              rows={formik.values.purchaseOrderLineItems}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // onSelectionModelChange={(ids) => setSelectedRows(ids)}
              // processRowUpdate={handleRowUpdate}
              disableSelectionOnClick
            />
            {purchaseOrder?.status === 'accepted' ||
            purchaseOrder?.status === 'partiallyFulfilled' ? (
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={formik.handleSubmit}>
                  Process
                </Button>
              </Box>
            ) : (
              <></>
            )}
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
};
