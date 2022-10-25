import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Autocomplete,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
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
  const organisationId = user.organisation.id;

  const {
    open,
    handleClose,
    processedPurchaseOrder,
    handleAlertOpen,
    retrieveAllReceivedPurchaseOrders,
    closeReceivedPODialog,
  } = props;

  // Formik Helpers
  const initialValues = {
    processedPurchaseOrderId: processedPurchaseOrder
      ? processedPurchaseOrder.id
      : '',
    // created: processedPurchaseOrder
    //   ? DayJS(processedPurchaseOrder.created).format('DD MMM YYYY hh:mm a')
    //   : '',
    // leadTime: processedPurchaseOrder
    //   ? processedPurchaseOrder.quotation.leadTime
    //   : '',
    addressFrom: '',
    reservedLineItems: [],
    unfulfilledLineItems: [],
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

  const [error, setError] = useState('');

  // Creation of DR
  const handleCreateDR = async () => {
    const response = await fetch(
      'http://localhost:3000/api/delivery-requests',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressFrom: formik.values.addressFrom,
          purchaseOrderId: processedPurchaseOrder.id,
          organisationId: organisationId,
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      retrieveAllReceivedPurchaseOrders();
      closeReceivedPODialog();
      onClose();
      handleAlertOpen(
        `Successfully created delivery order ${result.id}!`,
        'success'
      );
      setError('');
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };
  // Creation of Prod Request
  const handleCreateProdReq = async () => {
    const body = formik.values.unfulfilledLineItems.map((lineItem) => {
      return {
        purchaseOrderId: processedPurchaseOrder.id,
        organisationId: organisationId,
        finalGoodId: lineItem.finalGood.id,
        quantity: lineItem.quantity,
      };
    });

    const response = await fetch(
      `http://localhost:3000/api/production-requests/bulk`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (response.status === 200 || response.status === 201) {
      //   const result = await response.json();

      handleAlertOpen(`Successfully created production request(s)`, 'success');

      retrieveAllReceivedPurchaseOrders();
      closeReceivedPODialog();
      handleClose();
    } else {
      const result = await response.json();
      setError(`Error creating production request. ${result.message}`);
    }
  };

  const onClose = () => {
    formik.setFieldValue('reservedLineItems', []);
    formik.setFieldValue('unfulfilledLineItems', []);
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: schema,
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Retrieve list of unfulfilled items (Production Request)
  const retrieveUnfulfilledLineItems = async () => {
    const response = await fetch(
      `http://localhost:3000/api/purchase-orders/getUnfufilledLineItems/${processedPurchaseOrder.id}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();

      formik.setFieldValue(
        'unfulfilledLineItems',
        result
          ? result?.map((item) => {
              return {
                id: item.finalGood.id,
                quantity: item.quantity,
                finalGood: item.finalGood,
              };
            })
          : []
      );
    }
  };

  useEffect(() => {
    if (processedPurchaseOrder) {
      console.log(processedPurchaseOrder);
      formik.setFieldValue(
        'reservedLineItems',
        processedPurchaseOrder
          ? processedPurchaseOrder.reservationLineItems?.map((item) => {
              return {
                id: item.id,
                price: item.price,
                quantity: item.quantity,
                rawMaterial: item.rawMaterial,
                batchLineItem: item.batchLineItem,
              };
            })
          : []
      );

      retrieveUnfulfilledLineItems();

      console.log(formik.values.reservedLineItems);
      console.log(formik.values.unfulfilledLineItems);
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

  // DataGrid Helpers
  const columns = [
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.batchLineItem?.product?.skuCode : '';
      },
    },
    {
      field: 'finalName',
      headerName: 'Final Good Name',
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.batchLineItem?.product?.name : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.batchLineItem?.product?.unit : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
  ];

  // DataGrid Helpers
  const unfulfilledColumns = [
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
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
  ];

  return (
    <>
      {/* <ReceivedPurchaseOrderConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Reject Purchase Order`}
        dialogContent={`Confirm rejection of purchase order?`}
        dialogAction={handleReject}
      /> */}
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
                Process Purchase Order
              </Typography>
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
              value={formik.values.processedPurchaseOrderId}
              variant="outlined"
              disabled
              size="small"
            />
            {formik.values.unfulfilledLineItems.length === 0 ? (
              <TextField
                fullWidth
                error={Boolean(formik.touched.id && formik.errors.id)}
                helperText={formik.touched.id && formik.errors.id}
                label="Delivery From"
                margin="normal"
                name="addressFrom"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.addressFrom}
                variant="outlined"
                size="small"
              />
            ) : (
              <></>
            )}
            {/* <Box display="flex" justifyContent="space-between">
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
            </Box> */}

            <Box display="flex" justifyContent="space-between" mt={1}>
              <Box
                width={
                  formik.values.unfulfilledLineItems.length !== 0
                    ? '49%'
                    : '100%'
                }
              >
                <Typography variant="h6" style={{ marginBottom: '0.5%' }}>
                  Reserved
                </Typography>
                <Card>
                  <DataGrid
                    autoHeight
                    rows={formik.values.reservedLineItems}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    // onSelectionModelChange={(ids) => setSelectedRows(ids)}
                    // processRowUpdate={handleRowUpdate}
                    disableSelectionOnClick
                  />
                </Card>
              </Box>
              {formik.values.unfulfilledLineItems.length !== 0 ? (
                <Box width="49%">
                  <Typography variant="h6" style={{ marginBottom: '0.5%' }}>
                    Unfulfilled
                  </Typography>
                  <Card>
                    <DataGrid
                      autoHeight
                      rows={formik.values.unfulfilledLineItems}
                      columns={unfulfilledColumns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      // onSelectionModelChange={(ids) => setSelectedRows(ids)}
                      // processRowUpdate={handleRowUpdate}
                      disableSelectionOnClick
                    />
                  </Card>
                </Box>
              ) : (
                <></>
              )}
            </Box>

            <Box mt={2} display="flex" justifyContent={'center'}>
              <Typography variant="body2" color="red">
                {error}
              </Typography>
            </Box>

            {formik.values.unfulfilledLineItems.length !== 0 ? (
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleCreateProdReq}>
                  Create Production Request
                </Button>
              </Box>
            ) : (
              <></>
            )}

            {formik.values.unfulfilledLineItems.length === 0 ? (
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleCreateDR}
                  disabled={formik.values.addressFrom === ''}
                >
                  Create Delivery Request
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
