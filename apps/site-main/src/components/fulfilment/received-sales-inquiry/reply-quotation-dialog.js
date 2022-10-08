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

export const ReplyQuotationDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { open, handleClose, salesInquiry, handleAlertOpen } = props;

  // Formik Helpers
  const initialValues = {
    created: salesInquiry
      ? DayJS(salesInquiry.created).format('DD MMM YYYY hh:mm a')
      : '',
    totalPrice: 0,
    leadTime: '',
    salesInquiryId: salesInquiry ? salesInquiry.id : '',
    salesInquiryLineItems: salesInquiry
      ? salesInquiry.salesInquiryLineItems
      : [],
  };

  const schema = Yup.object({
    totalPrice: Yup.number().positive().required('Total Price is required'),
    leadTime: Yup.number()
      .integer()
      .positive()
      .required('Lead Time is Required'),
  });

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

  const onClose = () => {
    formik.setFieldValue('salesInquiryLineItems', []);
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  useEffect(() => {
    // console.log(si ? si.salesInquiryLineItems : []);
    formik.setFieldValue(
      'salesInquiryLineItems',
      salesInquiry
        ? salesInquiry.salesInquiryLineItems.map((item) => {
            return {
              id: item.id,
              price: item.indicativePrice,
              quantity: item.quantity,
              rawMaterial: item.rawMaterial,
            };
          })
        : []
    );
  }, [open]);

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowUpdate = (newRow, oldRow) => {
    let updatedRow = { ...newRow };
    if (newRow.price === oldRow.price) {
      return oldRow;
    }

    // Open error alert if orice is < 1
    if (newRow.price < 1) {
      const message = 'Price must be positive!';
      handleAlertOpen(message, 'error');
      throw new Error(message);
    }

    formik.setFieldValue(
      'salesInquiryLineItems',
      formik.values.salesInquiryLineItems.map((item) => {
        if (item.id === updatedRow.id) {
          console.log(updatedRow);
          return updatedRow;
        } else {
          return item;
        }
      })
    );
    return updatedRow;
  };

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
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'price',
      headerName: 'Quoted Price*',
      flex: 1,
      editable: true,
      valueGetter: (params) => {
        return params.row.price ? params.row.price : params.row.indicativePrice;
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
              Create Quotation Reply
            </Typography>

            <Button
              variant="contained"
              disabled={!formik.isValid || formik.isSubmitting}
              onClick={formik.handleSubmit}
            >
              Send
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <TextField
            fullWidth
            error={Boolean(formik.touched.id && formik.errors.id)}
            helperText={formik.touched.id && formik.errors.id}
            label="Sales Inquiry ID"
            margin="normal"
            name="id"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.salesInquiryId}
            variant="outlined"
            disabled
            size="small"
          />
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
            size="small"
          />
          <DataGrid
            autoHeight
            rows={formik.values.salesInquiryLineItems}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={handleRowUpdate}
            disableSelectionOnClick
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};
