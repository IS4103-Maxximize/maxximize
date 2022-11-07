import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Autocomplete,
  Button,
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

export const DeliveryRequestDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { open, handleClose, deliveryRequest } = props;

  useEffect(() => {
    console.log(deliveryRequest);
  }, [open]);

  // Formik Helpers
  const initialValues = {
    id: deliveryRequest ? deliveryRequest.id : null,
    created: deliveryRequest
      ? DayJS(deliveryRequest.dateCreated).format('DD MMM YYYY hh:mm a')
      : null,
    status: deliveryRequest ? deliveryRequest.status : '',
    addressTo: deliveryRequest ? deliveryRequest.addressTo : '',
    addressFrom: deliveryRequest ? deliveryRequest.addressFrom : '',
    vehicle: deliveryRequest ? deliveryRequest.vehicle.licensePlate : '',
    driver: deliveryRequest ? deliveryRequest.user.username : '',
    purchaseOrderId: deliveryRequest ? deliveryRequest.purchaseOrder.id : '',
    deliveryRequestLineItems: deliveryRequest
      ? deliveryRequest.deliveryRequestLineItems
      : [],
  };

  const schema = Yup.object({});

  // Placeholder, will never be called
  const handleOnSubmit = () => {
    //
  };

  const onClose = () => {
    formik.setFieldValue('quotationLineItems', []);
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Deliver (Status change)
  //   const handleDeliver = async () => {
  //     const response = await fetch(
  //       `http://localhost:3000/api/delivery-requests/${deliveryRequest.id}`,
  //       {
  //         method: 'PATCH',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           status: 'outfordelivery',
  //         }),
  //       }
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       const result = await response.json();

  //       //   handleAlertOpen(`Out for delivery DR ${deliveryRequest.id}`);
  //       //   handleClose();
  //       //   retrieveAllReceivedPurchaseOrders();
  //     } else {
  //       const result = await response.json();
  //       //   handleAlertOpen(
  //       //     `Error rejecting Purchase Order ${result.id}. ${result.message}`,
  //       //     'error'
  //       //   );
  //     }
  //   };
  //   // Complete a DR
  //   const handleComplete = async () => {
  //     const response = await fetch(
  //       `http://localhost:3000/api/delivery-requests/${deliveryRequest.id}`,
  //       {
  //         method: 'PATCH',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           status: 'completed',
  //         }),
  //       }
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       const result = await response.json();

  //       //   handleAlertOpen(`Rejected Purchase Order ${result.id}`);
  //       //   handleClose();
  //       //   retrieveAllReceivedPurchaseOrders();
  //     } else {
  //       //   const result = await response.json();
  //       //   handleAlertOpen(
  //       //     `Error rejecting Purchase Order ${result.id}. ${result.message}`,
  //       //     'error'
  //       //   );
  //     }
  //   };

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.product?.skuCode : '';
      },
    },
    {
      field: 'finalGoodName',
      headerName: 'Final Good Name',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.product?.name : '';
      },
    },
    {
      field: 'finalGoodDescription',
      headerName: 'Description',
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.product?.description : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.product?.unit : '';
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
              View Delivery Request
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" justifyContent="space-between" width="49.5%">
                <TextField
                  sx={{ width: '33%' }}
                  error={Boolean(formik.touched.id && formik.errors.id)}
                  helperText={formik.touched.id && formik.errors.id}
                  label="Delivery Request ID"
                  margin="normal"
                  name="id"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.id}
                  variant="outlined"
                  disabled
                  size="small"
                />
                <TextField
                  sx={{ width: '33%' }}
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
                  size="small"
                />
                <TextField
                  sx={{ width: '33%' }}
                  error={Boolean(formik.touched.status && formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                  label="Status"
                  margin="normal"
                  name="status"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.status}
                  variant="outlined"
                  disabled
                  size="small"
                />
              </Box>

              <Box width="10.5%">
                <TextField
                  sx={{ width: '100%' }}
                  error={Boolean(
                    formik.touched.purchaseOrderId &&
                      formik.errors.purchaseOrderId
                  )}
                  helperText={
                    formik.touched.purchaseOrderId &&
                    formik.errors.purchaseOrderId
                  }
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
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <TextField
                sx={{ width: '49.5%' }}
                error={Boolean(formik.touched.driver && formik.errors.driver)}
                helperText={formik.touched.driver && formik.errors.driver}
                label="Driver"
                margin="normal"
                name="driver"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.driver}
                variant="outlined"
                disabled
                size="small"
              />
              <TextField
                sx={{ width: '49.5%' }}
                error={Boolean(formik.touched.vehicle && formik.errors.vehicle)}
                helperText={formik.touched.vehicle && formik.errors.vehicle}
                label="Vehicle"
                margin="normal"
                name="vehicle"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.vehicle}
                variant="outlined"
                disabled
                size="small"
              />
            </Box>

            <Box display="flex" justifyContent="space-between">
              <TextField
                sx={{ width: '49.5%' }}
                error={Boolean(
                  formik.touched.addressFrom && formik.errors.addressFrom
                )}
                helperText={
                  formik.touched.addressFrom && formik.errors.addressFrom
                }
                label="Deliver From"
                margin="normal"
                name="addressFrom"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.addressFrom}
                variant="outlined"
                disabled
                size="small"
              />
              <TextField
                sx={{ width: '49.5%' }}
                error={Boolean(
                  formik.touched.addressTo && formik.errors.addressTo
                )}
                helperText={formik.touched.addressTo && formik.errors.addressTo}
                label="Delivery To"
                margin="normal"
                name="addressTo"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.addressTo}
                variant="outlined"
                disabled
                size="small"
              />
            </Box>
          </Box>
          <DataGrid
            autoHeight
            rows={formik.values.deliveryRequestLineItems}
            columns={columns}
            disableSelectionOnClick
            pageSize={5}
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            experimentalFeatures={{ newEditingApi: true }}
          />
          {/* <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              autoFocus
              color="inherit"
              size="medium"
              type="submit"
              variant="outlined"
              onClick={handleDeliver}
            >
              Deliver
            </Button>
          </Box>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              autoFocus
              color="inherit"
              size="medium"
              type="submit"
              variant="outlined"
              onClick={handleComplete}
            >
              Complete
            </Button>
          </Box> */}
        </DialogContent>
      </Dialog>
    </form>
  );
};
