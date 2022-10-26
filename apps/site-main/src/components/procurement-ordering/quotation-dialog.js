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
import {
  createQuotation,
  fetchSalesInquiries,
  updateQuotation,
  updateQuotationLineItem,
} from '../../helpers/procurement-ordering';
import DayJS from 'dayjs';

export const QuotationDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    action, // POST || PATCH
    open,
    handleClose,
    string,
    quotation,
    addQuotation,
    // updateQuotation
    handleAlertOpen,
    ...rest
  } = props;

  // Formik Helpers
  const initialValues = {
    id: quotation ? quotation.id : null,
    created: quotation
      ? DayJS(quotation.created).format('DD MMM YYYY hh:mm a')
      : null,
    totalPrice: quotation ? quotation.totalPrice : 0,
    leadTime: quotation ? quotation.leadTime : 7,
    supplierId: quotation ? quotation.shellOrganisation?.id : null,
    currentOrgId: quotation ? quotation.currentOrganisation?.id : null,
    salesInquiryId: quotation ? quotation.salesInquiry.id : null,
    quotationLineItems: quotation ? quotation.quotationLineItems : [],
  };

  const schema = Yup.object({
    totalPrice: Yup.number().positive().required('Enter Total Price'),
    leadTime: Yup.number().integer().positive().required('Enter Lead Time'),
    supplierId: Yup.number().required('Select Supplier ID'),
  });

  const handleOnSubmit = async (values) => {
    console.log(values);
    if (action === 'POST') {
      // create quotation and lineitems
      const result = await createQuotation(
        values.salesInquiryId,
        values.supplierId,
        values.quotationLineItems,
        values.leadTime,
        values.totalPrice
      ).catch((err) => handleAlertOpen(`Error creating ${string}`, 'error'));
      addQuotation(result);
    }
    onClose();
  };

  const onClose = () => {
    const updateQ = async () => {
      return await updateQuotation(quotation.id, formik.values.totalPrice);
    };
    if (action === 'PATCH') updateQ();
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

  // Autocomplete Helpers
  const [supplierOptions, setSupplierOptions] = useState([]);

  const [salesInquiries, setSalesInquiries] = useState([]);
  const [salesInquiryOptions, setSalesInquiryOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const salesInquiries = await fetchSalesInquiries(user.organisation.id);
      setSalesInquiries(salesInquiries);
      // Should only be allowed to select sales inquiries which
      // have status 'sent'
      setSalesInquiryOptions(
        salesInquiries
          .filter((el) => el.status === 'sent' && !el.receivingOrganisationId)
          .map((el) => el.id)
      );
    };

    if (action === 'POST') {
      fetchData();
    }
    // Calculate total price
    formik.setFieldValue(
      'totalPrice',
      formik.values.quotationLineItems.reduce((a, b) => {
        const price = b.price ? b.price : 1;
        return a + b.quantity * price;
      }, 0)
    );
  }, [open, formik.values.quotationLineItems]);

  useEffect(() => {
    if (action === 'POST') {
      const si = salesInquiries.find(
        (inquiry) => inquiry.id === formik.values.salesInquiryId
      );
      // console.log(si ? si.salesInquiryLineItems : []);
      formik.setFieldValue(
        'quotationLineItems',
        si
          ? si.salesInquiryLineItems.map((item) => {
              return {
                id: item.id,
                price: item.indicativePrice,
                quantity: item.quantity,
                rawMaterial: item.rawMaterial,
                finalGood: item.finalGood,
              };
            })
          : []
      );
    }
  }, [formik.values.salesInquiryId]);

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowUpdate = (newRow, oldRow) => {
    let updatedRow = { ...newRow };
    console.log(updatedRow);

    if (newRow.price < 1 || isNaN(newRow.price)) {
      const message = 'Price must be a positive number!';
      handleAlertOpen(message, 'error');
      throw new Error(message);
    }

    formik.setFieldValue(
      'quotationLineItems',
      formik.values.quotationLineItems.map((item) => {
        if (item.id === updatedRow.id) {
          console.log(updatedRow);
          return updatedRow;
        } else {
          return item;
        }
      })
    );
    if (action === 'PATCH') {
      // console.log(updatedRow);
      if (newRow.price === oldRow.price) {
        return oldRow; // Dont call update api if price didn't change
      }

      const updatedId = updatedRow.id;
      updatedRow = updateQuotationLineItem(updatedRow.id, updatedRow.price)
        .then(
          () =>
            handleAlertOpen(
              `Updated QuotationLineItem ${updatedId} successfully !`
            ),
          'success'
        )
        .catch((err) =>
          handleAlertOpen(`Error updating QuotationLineItem`, 'error')
        );
    }
    return updatedRow;
  };

  // useEffect(() => {
  //   console.log(quotation);
  // }, [open])

  const columns = [
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.skuCode : '';
      },
    },
    {
      field: 'rawName',
      headerName: 'Raw Material Name',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.name : '';
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.description : '';
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
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'price',
      headerName: 'Quoted Price *',
      flex: 1,
      editable: !quotation?.receivingOrganisationId,
      valueGetter: (params) => {
        if (action === 'POST') {
          return params.row.price
            ? params.row.price
            : params.row.indicativePrice;
        }
        if (action === 'PATCH') {
          //   console.log(params.row);
          return params.row.price;
        }
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        return params.row.price * params.row.quantity;
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
              {!quotation && `Create `}
              {quotation && `View / Edit `}
              {string}
            </Typography>
            {action === 'POST' && (
              <Button
                variant="contained"
                disabled={!formik.isValid || formik.isSubmitting}
                onClick={formik.handleSubmit}
              >
                Submit
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent>
          {quotation && (
            <TextField
              fullWidth
              error={Boolean(formik.touched.id && formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
              label="Quotation ID"
              margin="normal"
              name="id"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.id}
              variant="outlined"
              disabled
              size="small"
            />
          )}
          {quotation && (
            <TextField
              fullWidth
              error={Boolean(formik.touched.created && formik.errors.created)}
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
          )}
          <TextField
            fullWidth
            error={Boolean(
              formik.touched.totalPrice && formik.errors.totalPrice
            )}
            helperText={formik.touched.totalPrice && formik.errors.totalPrice}
            label="Total Price"
            margin="normal"
            name="totalPrice"
            type="number"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.totalPrice}
            variant="outlined"
            disabled
            size="small"
          />
          <TextField
            fullWidth
            error={Boolean(formik.touched.leadTime && formik.errors.leadTime)}
            helperText={formik.touched.leadTime && formik.errors.leadTime}
            label="Lead Time"
            margin="normal"
            name="leadTime"
            type="number"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.leadTime}
            variant="outlined"
            disabled={Boolean(quotation?.receivingOrganisationId)}
            size="small"
          />
          <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
            {!quotation && (
              <Autocomplete
                id="sales-inquiry-selector"
                sx={{ width: 300, mb: 1 }}
                options={salesInquiryOptions}
                value={formik.values.salesInquiryId}
                onChange={(event, newValue) => {
                  event.preventDefault();
                  formik.setFieldValue('salesInquiryId', newValue);
                  console.log(newValue);
                  console.log(salesInquiries);
                  const si = salesInquiries.find((el) => el.id === newValue);
                  console.log(si);
                  const suppliers = si ? si.suppliers : [];
                  const quotations = si ? si.quotations : [];
                  const shellOrganisationIds = quotations.map(
                    (el) => el.shellOrganisation.id
                  );
                  const filteredSuppliers = suppliers.filter(
                    (supplier) => !shellOrganisationIds.includes(supplier.id)
                  );
                  setSupplierOptions(filteredSuppliers);
                }}
                getOptionLabel={(option) => option.toString(10)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sales Inquiry ID"
                    size="small"
                  />
                )}
              />
            )}
            {/* Supplier Selection */}
            {!quotation && (
              <Autocomplete
                disabled={!formik.values.salesInquiryId}
                id="supplier-selector"
                sx={{ width: 300, mb: 1 }}
                options={supplierOptions.map((el) => el.id.toString())}
                onChange={(event, newValue) => {
                  console.log(newValue);
                  formik.setFieldValue('supplierId', parseInt(newValue));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Suppliers ID" size="small" />
                )}
              />
            )}
            {quotation && (
              <TextField
                label="Sales Inquiry ID"
                value={quotation.salesInquiry.id}
                disabled={Boolean(quotation)}
                size="small"
              />
            )}
            {quotation && (
              <TextField
                label="Supplier ID"
                value={
                  quotation.shellOrganisation
                    ? quotation.shellOrganisation.id
                    : quotation.currentOrganisation.id
                }
                disabled={Boolean(quotation)}
                size="small"
              />
            )}
          </Stack>
          <DataGrid
            autoHeight
            rows={formik.values.quotationLineItems}
            columns={columns}
            disableSelectionOnClick
            pageSize={5}
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={handleRowUpdate}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};
