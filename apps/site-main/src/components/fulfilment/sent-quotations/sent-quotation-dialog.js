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

export const SentQuotationDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { open, handleClose, quotation } = props;

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

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

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
      field: 'rawName',
      headerName: 'Final Good Name',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.name : '';
      },
    },
    {
      field: 'finalGoodDescription',
      headerName: 'Description',
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.description : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.unit : '';
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
      headerName: 'Quoted Price',
      flex: 1,
      editable: !quotation,
      valueGetter: (params) => {
        return params.row.price;
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        console.log(params);
        return params.row.quantity * params.row.price;
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
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
              View Sent Quotation
            </Typography>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
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
            disabled
            size="small"
          />
          <Stack direction="row" spacing={1} mt={2}>
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
                label="Recipient ID"
                value={quotation.receivingOrganisation.id}
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
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};
