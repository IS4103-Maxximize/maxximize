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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';

export const CartPODialog = (props) => {
  const {
    open,
    handleClose,
    cart,
    discount,
    setPurchaseOrders,
    availableLineItems,
    handleAvailableLineItemsChange,
    handleAlertOpen,
    ...rest
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // Create a new PO for the cart checkout dialog
  const handleOnSubmit = async (values) => {
    let poLineItemDtos = [];

    poLineItemDtos = poLineItems.map((item) => {
      return {
        quantity: item.quantity,
        price: item.finalGood.unitPrice,
        finalGood: item.finalGood,
      };
    });

    const submitValues = {
      id: uuid(),
      deliveryAddress: values.deliveryAddress,
      totalPrice: values.netPrice,
      deliveryDate: values.deliveryDate,
      currentOrganisationId: organisationId,
      userContactId: user.contact.id,
      poLineItemDtos: poLineItemDtos,
      supplierId: cart.supplierId,
    };

    handleAvailableLineItemsChange(poLineItems, 'create');

    console.log(submitValues);
    setPurchaseOrders((purchaseOrders) => [...purchaseOrders, submitValues]);
    onClose();
  };

  const [outlets, setOutlets] = useState([]);

  //Retrieve all outlets
  const getOutlets = async () => {
    const outletsList = await fetch(
      `http://localhost:3000/api/outlets/orgId/${organisationId}`
    );
    const result = await outletsList.json();

    setOutlets(result);
  };

  const [poLineItems, setPOLineItems] = useState([]);

  useEffect(() => {
    // fetch when opening create dialog
    if (open) {
      setPOLineItems(JSON.parse(JSON.stringify(availableLineItems)));
      getOutlets();
      formik.setFieldValue('deliveryDate', new Date());
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {
      deliveryAddress: '',
      totalPrice: poLineItems.reduce(
        (a, b) => a + b.quantity * b.finalGood.unitPrice,
        0
      ),
      netPrice:
        poLineItems.reduce(
          (a, b) => a + b.quantity * b.finalGood.unitPrice,
          0
        ) *
        ((100 - discount) / 100), //Cart line items calculation
      deliveryDate: null,
      currentOrganisation: user.organisation,
      userContact: user.contact.id,
    },
    validationSchema: Yup.object({
      deliveryAddress: Yup.string().required(),
      netPrice: Yup.number().positive().required(),
      deliveryDate: Yup.date().required(),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    handleClose();
    formik.resetForm();
  };

  // Handle the updating of quantity of line item
  const updateLineItems = (newRow, oldRow) => {
    console.log(newRow);
    console.log(oldRow);
    const updatedRow = { ...newRow };

    // if (newRow.quantity === oldRow.quantity) {
    //   return oldRow;
    // }

    // Open error alert if orice is < 1
    if (newRow.quantity < 1) {
      const message = 'Quantity must be positive!';
      handleAlertOpen(message, 'error');
      throw new Error(message);
    }

    if (
      newRow.quantity >
      availableLineItems.find(
        (lineItem) => lineItem.finalGood.id === newRow.finalGood.id
      ).quantity
    ) {
      const message = 'Quantity exceeds remaining quantity in cart!';
      handleAlertOpen(message, 'error');
      throw new Error(message);
    }

    let totalPrice = 0;

    for (const lineItem of poLineItems) {
      if (lineItem.id == updatedRow.id) {
        lineItem.quantity = updatedRow.quantity;
        lineItem.finalGood = updatedRow.finalGood;
      }

      totalPrice += lineItem.indicativePrice * lineItem.quantity;
    }

    const netPrice = totalPrice * ((100 - discount) / 100);
    formik.setFieldValue('netPrice', netPrice);

    return updatedRow;
  };

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
      field: 'name',
      headerName: 'Final Good Name',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.name : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      editable: true,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Final Good',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.unit : '';
      },
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.unitPrice : '';
      },
      valueFormatter: (params) => {
        return params.value ? `$ ${params.value}` : '';
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        return params.row
          ? `$ ${params.row.finalGood?.unitPrice * params.row.quantity}`
          : '';
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
              Create Purchase Order (Outlet)
            </Typography>
            <Button
              variant="contained"
              disabled={
                !formik.isValid ||
                formik.isSubmitting ||
                poLineItems.length === 0
              }
              onClick={formik.handleSubmit}
            >
              Create PO
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {/* PO Information */}
          {/* For desktop screens */}

          {/* Outlet Selection */}

          <Typography variant="h6">Purchase Order Line Items</Typography>
          <DataGrid
            autoHeight
            rows={poLineItems}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={updateLineItems}
          />

          {fullScreen ? (
            // For mobile devices
            <>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Autocomplete
                  id="outlet-selector"
                  fullWidth
                  options={outlets}
                  getOptionLabel={(option) =>
                    `[${option.name}] : ${option.address}`
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(e, value) => {
                    formik.setFieldValue(
                      'deliveryAddress',
                      value ? value.address : null
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" label="Deliver To" />
                  )}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}
              >
                <DatePicker
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
                spacing={0.5}
                sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}
              >
                <TextField
                  disabled
                  label="Total Price"
                  name="totalPrice"
                  type="number"
                  value={cart.totalPrice}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  size="small"
                />
                <TextField
                  disabled
                  label="Discount"
                  margin="normal"
                  name="discount"
                  type="number"
                  value={discount}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  size="small"
                />
                <TextField
                  error={Boolean(
                    formik.touched.netPrice && formik.errors.netPrice
                  )}
                  helperText={formik.touched.netPrice && formik.errors.netPrice}
                  label="Net Price"
                  margin="normal"
                  name="netPrice"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.netPrice.toFixed(2)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  size="small"
                  disabled
                />
              </Stack>
            </>
          ) : (
            <>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 2,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
                width="100%"
              >
                <Box display="flex" justifyContent="space-between" width="60%">
                  <Autocomplete
                    id="outlet-selector"
                    sx={{ width: '70%' }}
                    options={outlets}
                    getOptionLabel={(option) =>
                      `[${option.name}] : ${option.address}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(e, value) => {
                      formik.setFieldValue(
                        'deliveryAddress',
                        value ? value.address : null
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Deliver To" />
                    )}
                  />

                  <DatePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Delivery Date"
                    value={formik.values.deliveryDate}
                    minDate={new Date()} // earliest date is current + leadTime OR purchaseOrder.deliveryDate
                    onChange={(newValue) => {
                      formik.setFieldValue('deliveryDate', newValue);
                    }}
                  />
                </Box>
                <TextField
                  disabled
                  label="Total Price"
                  margin="normal"
                  name="totalPrice"
                  type="number"
                  value={formik.values.totalPrice}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  disabled
                  label="Discount"
                  margin="normal"
                  name="discount"
                  type="number"
                  value={discount}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  disabled
                  label="Net Price"
                  margin="normal"
                  name="netPrice"
                  type="number"
                  value={formik.values.netPrice.toFixed(2)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </>
          )}
        </DialogContent>
      </Dialog>
    </form>
  );
};
