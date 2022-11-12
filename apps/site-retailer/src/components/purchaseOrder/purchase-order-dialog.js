import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const PODialog = (props) => {
  const { open, handleClose, purchaseOrder, ...rest } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const formik = useFormik({
    initialValues: {
      id: purchaseOrder ? purchaseOrder.id : null,
      status: purchaseOrder ? purchaseOrder.status : 'pending',
      deliveryAddress: purchaseOrder ? purchaseOrder.deliveryAddress : null,
      totalPrice: purchaseOrder ? purchaseOrder.totalPrice : 0,
      created: purchaseOrder ? purchaseOrder.created : null,
      deliveryDate: purchaseOrder ? parseISO(purchaseOrder.deliveryDate) : null,
      currentOrganisation: purchaseOrder
        ? purchaseOrder.currentOrganisation
        : user.organisation,
      userContact: purchaseOrder ? purchaseOrder.userContact : null,
      supplierContact: purchaseOrder ? purchaseOrder.supplierContact : null,
      poLineItems: purchaseOrder ? purchaseOrder.poLineItems : [],
    },
    validationSchema: Yup.object({
      deliveryAddress: Yup.string().required(),
      totalPrice: Yup.number().positive().required(),
      deliveryDate: Yup.date().required(),
      quotation: Yup.object().defined().required(),
    }),
    enableReinitialize: true,
  });

  const onClose = () => {
    handleClose();
    formik.resetForm();
  };

  const columns = [
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.skuCode : '';
      },
    },
    {
      field: 'name',
      headerName: 'Raw Material Name',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.name : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row
          ? `${params.row.quantity} ${
              params.row.finalGood.unit === 'kilogram' ? 'kg' : 'litre'
            }`
          : '';
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? `$ ${params.value}` : '';
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? `$ ${params.row.price * params.row.quantity}` : '';
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
              View Purchase Order
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {/* PO Information */}
          {!fullScreen ? (
            <>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
              >
                <Box display="flex" width="100%" justifyContent="space-between">
                  <Box
                    display="flex"
                    width="50%"
                    justifyContent="space-between"
                  >
                    {purchaseOrder && (
                      <TextField
                        sx={{ width: '24%' }}
                        label="Purchase Order ID"
                        value={purchaseOrder.id}
                        disabled={Boolean(purchaseOrder)}
                      />
                    )}
                    {purchaseOrder && (
                      <TextField
                        sx={{ width: '74%' }}
                        label="Supplier ID & Name"
                        value={
                          purchaseOrder.supplier
                            ? purchaseOrder.supplier.id +
                              ' ' +
                              purchaseOrder.supplier.name
                            : ''
                        }
                        disabled
                      />
                    )}
                  </Box>
                  <Box display="flex" width="40%" justifyContent="flex-end">
                    {purchaseOrder && (
                      <TextField
                        sx={{ width: '40%' }}
                        label="Status"
                        value={purchaseOrder.status}
                        disabled={Boolean(purchaseOrder)}
                      />
                    )}
                  </Box>
                </Box>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
              >
                <Box display="flex" width="100%" justifyContent="space-between">
                  <Box
                    display="flex"
                    width={'50%'}
                    justifyContent="space-between"
                  >
                    {purchaseOrder && (
                      <TextField
                        sx={{ width: '65%' }}
                        label="Deliver To"
                        value={purchaseOrder.deliveryAddress}
                        disabled={Boolean(purchaseOrder)}
                      />
                    )}

                    <DatePicker
                      disabled={
                        !formik.values.quotation || Boolean(purchaseOrder)
                      }
                      renderInput={(props) => <TextField {...props} />}
                      label="Delivery Date"
                      value={formik.values.deliveryDate}
                      minDate={formik.values.deliveryDate} // earliest date is current + leadTime OR purchaseOrder.deliveryDate
                      onChange={(newValue) => {
                        formik.setFieldValue('deliveryDate', newValue);
                      }}
                    />
                  </Box>
                  <Box display="flex" width="40%" justifyContent="flex-end">
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      sx={{ width: '40%' }}
                      disabled
                    />
                  </Box>
                </Box>
              </Stack>
            </>
          ) : (
            <>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
              >
                {purchaseOrder && (
                  <TextField
                    sx={{ width: '34%' }}
                    label="Purchase Order ID"
                    value={purchaseOrder.id}
                    disabled={Boolean(purchaseOrder)}
                    size="small"
                  />
                )}
                {purchaseOrder && (
                  <TextField
                    sx={{ width: '64%' }}
                    label="Supplier ID & Name"
                    value={
                      purchaseOrder.supplier
                        ? purchaseOrder.supplier.id +
                          ' ' +
                          purchaseOrder.supplier.name
                        : ''
                    }
                    size="small"
                    disabled
                  />
                )}
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
              >
                {purchaseOrder && (
                  <TextField
                    sx={{ width: '65%' }}
                    label="Deliver To"
                    value={purchaseOrder.deliveryAddress}
                    disabled={Boolean(purchaseOrder)}
                    size="small"
                  />
                )}

                <DatePicker
                  disabled={!formik.values.quotation || Boolean(purchaseOrder)}
                  renderInput={(props) => <TextField size="small" {...props} />}
                  label="Delivery Date"
                  value={formik.values.deliveryDate}
                  minDate={formik.values.deliveryDate} // earliest date is current + leadTime OR purchaseOrder.deliveryDate
                  onChange={(newValue) => {
                    formik.setFieldValue('deliveryDate', newValue);
                  }}
                />
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
              >
                {purchaseOrder && (
                  <TextField
                    sx={{ width: '50%' }}
                    label="Status"
                    value={purchaseOrder.status}
                    disabled={Boolean(purchaseOrder)}
                    size="small"
                  />
                )}

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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{ width: '48%' }}
                  disabled
                  size="small"
                />
              </Stack>
            </>
          )}
          <Typography variant="h6">Purchase Order Line Items</Typography>
          <Card>
            <DataGrid
              autoHeight
              rows={
                purchaseOrder
                  ? purchaseOrder.poLineItems
                  : formik.values.poLineItems
              }
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Card>
        </DialogContent>
      </Dialog>
    </form>
  );
};
