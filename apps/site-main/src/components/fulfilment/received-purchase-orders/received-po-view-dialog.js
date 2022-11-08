import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar, Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment, TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { apiHost } from '../../../helpers/constants';
import DayJS from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { UpdateCreditDialog } from '../../finance/update-retailer-credit-dialog';
import { ProcessPurchaseOrderDialog } from './process-po-dialog';
import { ReceivedPurchaseOrderConfirmDialog } from './received-po-confirm-dialog';

export const ReceivedPurchaseOrderViewDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const {
    open,
    handleClose,
    purchaseOrder,
    handleAlertOpen,
    retrieveAllReceivedPurchaseOrders,
    retailer
  } = props;

  const [ret, setRet] = useState(retailer);
  const [creditRequired, setCreditRequired] = useState(0)

  // Formik Helpers
  const initialValues = {
    created: purchaseOrder
      ? DayJS(purchaseOrder.created).format('DD MMM YYYY hh:mm a')
      : '',
    totalPrice: purchaseOrder ? purchaseOrder.totalPrice : 0,
    leadTime: purchaseOrder ? purchaseOrder.quotation.leadTime : '',
    purchaseOrderId: purchaseOrder ? purchaseOrder.id : '',
    purchaseOrderLineItems: purchaseOrder ? purchaseOrder.poLineItems : [],
    followUpLineItems: purchaseOrder ? purchaseOrder.followUpLineItems : [],
  };

  // Accept a purchase order (Status change)
  const handleAccept = async () => {
    const response = await fetch(
      `http://localhost:3000/api/purchase-orders/${purchaseOrder.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'accepted',
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      handleAlertOpen(`Accepted Purchase Order ${result.id}`);
      handleClose();
      retrieveAllReceivedPurchaseOrders();
    } else {
      const result = await response.json();
      handleAlertOpen(
        `Error accepting Purchase Order ${result.id}. ${result.message}`,
        'error'
      );
    }
  };

  // Reject a purchase order (Status change)
  const handleReject = async () => {
    const response = await fetch(
      `http://localhost:3000/api/purchase-orders/${purchaseOrder.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      handleAlertOpen(`Rejected Purchase Order ${result.id}`);
      handleClose();
      retrieveAllReceivedPurchaseOrders();
    } else {
      const result = await response.json();
      handleAlertOpen(
        `Error rejecting Purchase Order ${result.id}. ${result.message}`,
        'error'
      );
    }
  };

  // Reserve final goods for purchase order
  const [processedPurchaseOrder, setProcessedPurchaseOrder] = useState('');

  const handleReservation = async () => {
    const response = await fetch(
      `http://localhost:3000/api/purchase-orders/reserve`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchaseOrderId: purchaseOrder.id,
          organisationId: organisationId,
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      setProcessedPurchaseOrder(result);

      handleProcessPODialogOpen();
    } else {
      const result = await response.json();
      handleAlertOpen(
        `Error reserving for Purchase Order ${result.id}. ${result.message}`,
        'error'
      );
    }
  };

  // Processing of Purchase Order
  const [processPODialogOpen, setProcessingPODialogOpen] = useState(false);
  const handleProcessPODialogOpen = () => {
    setProcessingPODialogOpen(true);
  };
  const handleProcessPODialogClose = () => {
    setProcessingPODialogOpen(false);
  };

  const onClose = () => {
    formik.setFieldValue('poLineItems', []);
    formik.setFieldValue('followUpLineItems', []);
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: schema,
    enableReinitialize: true,
    // onSubmit: handleOnSubmit,
  });

  useEffect(() => {
    if (open) {
      setRet(retailer);
      setCreditRequired(Math.max(0, purchaseOrder.totalPrice - (retailer.creditLimit - retailer.currentCredit)))
    }

    console.log(purchaseOrder);
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

    if (purchaseOrder?.followUpLineItems.length !== 0) {
      formik.setFieldValue(
        'followUpLineItems',
        purchaseOrder
          ? purchaseOrder.followUpLineItems?.map((item) => {
              return {
                id: item.id,
                price: item.subTotal,
                quantity: item.quantity,
                rawMaterial: item.rawMaterial,
                finalGood: item.finalGood,
              };
            })
          : []
      );
    }
  }, [open]);

  // Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Update Credit Dialog Helpers
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const handleCreditDialogOpen = () => {
    setCreditDialogOpen(true);
  };
  const handlecreditDialogClose = () => {
    setCreditDialogOpen(false);
  };

  const getUpdatedRetailer = async () => {
    const url = `${apiHost}/shell-organisations/${retailer?.id}`;
    await fetch(url)
      .then(res => res.json())
      .then(result => {
        console.log(result)
        setRet(result)
        setCreditRequired(Math.max(0, formik.values.totalPrice - (result.creditLimit - result.currentCredit)))
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    if (!creditDialogOpen) {
      getUpdatedRetailer();
    }
  }, [creditDialogOpen])

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
      <ProcessPurchaseOrderDialog
        open={processPODialogOpen}
        handleClose={handleProcessPODialogClose}
        processedPurchaseOrder={processedPurchaseOrder}
        handleAlertOpen={handleAlertOpen}
        retrieveAllReceivedPurchaseOrders={retrieveAllReceivedPurchaseOrders}
        closeReceivedPODialog={onClose}
      />
      <UpdateCreditDialog
        open={creditDialogOpen}
        handleClose={handlecreditDialogClose}
        retailer={ret}
        creditRequired={creditRequired}
        handleAlertOpen={handleAlertOpen}
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
              {(ret && purchaseOrder?.status === 'pending') ? (
                <>
                  {(ret && creditRequired <= 0) &&
                  <Button
                    autoFocus
                    color="inherit"
                    size="medium"
                    type="submit"
                    variant="outlined"
                    onClick={handleAccept}
                  >
                    Accept
                  </Button>}
                  {creditRequired > 0 && 
                  <>
                  <Typography>{`Credit Required: $${creditRequired}`}</Typography>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleCreditDialogOpen}
                    sx={{ ml: 1 }}
                  >
                    Update Credit Limit
                  </Button>
                  </>}
                  <Button
                    autoFocus
                    color="error"
                    size="medium"
                    type="submit"
                    variant="contained"
                    onClick={handleConfirmDialogOpen}
                    sx={{ ml: 2 }}
                  >
                    Reject
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

            {purchaseOrder?.followUpLineItems.length === 0 ? (
              <Box mt={2}>
                <Typography variant="h6">Purchase Order Line Items</Typography>
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
              </Box>
            ) : (
              <>
                <Box mt={2}>
                  <Typography variant="h6">
                    Purchase Order Line Items
                  </Typography>
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
                </Box>
                <Box mt={2}>
                  <Typography variant="h6">Follow Up Line Items</Typography>
                  <DataGrid
                    autoHeight
                    rows={formik.values.followUpLineItems}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    // onSelectionModelChange={(ids) => setSelectedRows(ids)}
                    // processRowUpdate={handleRowUpdate}
                    disableSelectionOnClick
                  />
                </Box>
              </>
            )}
            {purchaseOrder?.status === 'accepted' ||
            purchaseOrder?.status === 'productioncompleted' ||
            purchaseOrder?.status === 'partiallyfulfilled' ? (
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleReservation}>
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
