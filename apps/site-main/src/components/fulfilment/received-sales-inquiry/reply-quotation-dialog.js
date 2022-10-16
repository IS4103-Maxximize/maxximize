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
import { updateQuotation } from '../../../helpers/procurement-ordering';

export const ReplyQuotationDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    open,
    handleClose,
    salesInquiry,
    handleAlertOpen,
    retrieveAllReceivedSalesInquiry,
  } = props;

  // Formik Helpers
  const initialValues = {
    created: salesInquiry
      ? DayJS(salesInquiry.created).format('DD MMM YYYY hh:mm a')
      : '',
    totalPrice: 0,
    leadTime: '',
    // Take note the recipient is currentOrganisationId on the backend [Sender]
    recipient: salesInquiry ? salesInquiry.currentOrganisationId : '',
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

  const [error, setError] = useState('');

  const handleOnSubmit = async (values) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch('http://localhost:3000/api/quotations', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        salesInquiryId: values.salesInquiryId,
        currentOrganisationId: user.organisation.id,
        receivingOrganisationId: values.recipient,
        leadTime: values.leadTime,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const quotationResult = await response.json();

      console.log(values.totalPrice);

      const lineItemsPromise = formik.values.salesInquiryLineItems.map(
        async (item) => {
          let body = {
            quantity: item.quantity,
            price: item.price,
            rawMaterialId: item.rawMaterial.id,
            finalGoodId: item.finalGood.id,
            quotationId: quotationResult.id,
          };
          body = JSON.stringify(body);
          const requestOptions = {
            method: 'POST',
            headers: headers,
            body: body,
          };

          const lineItemResponse = await fetch(
            'http://localhost:3000/api/quotation-line-items',
            requestOptions
          );

          if (
            lineItemResponse.status === 200 ||
            lineItemResponse.status === 201
          ) {
            const updatedQuotation = await updateQuotation(
              quotationResult.id,
              values.totalPrice
            );
            handleAlertOpen(
              `Sent Quotation ${quotationResult.id} successfully`
            );
            setError('');
            retrieveAllReceivedSalesInquiry();
            handleClose();
          } else {
            const result = await response.json();
            setError(result.message);
          }
        }
      );
    } else {
      const result = await response.json();
      setError(result.message);
    }
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
              finalGood: item.finalGood,
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
          return updatedRow;
        } else {
          return item;
        }
      })
    );

    return updatedRow;
  };

  useEffect(() => {
    formik.setFieldValue(
      'totalPrice',
      formik.values.salesInquiryLineItems.reduce((a, b) => {
        const price = b.price ? b.price : 1;
        return a + b.quantity * price;
      }, 0)
    );
  }, [formik.values.salesInquiryLineItems]);

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
      field: 'finalGoodName',
      headerName: 'Final Good Name',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.name : '';
      },
    },
    {
      field: 'finalGoodDescription',
      headerName: 'Description',
      flex: 2,
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
      headerName: 'Quoted Price *',
      flex: 1,
      editable: true,
      valueGetter: (params) => {
        return params.row.price ? params.row.price : params.row.indicativePrice;
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        console.log(params);
        return params.row.quantity * params.row.price;
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
          <Typography variant="body1">{error}</Typography>
          <TextField
            fullWidth
            error={Boolean(formik.touched.id && formik.errors.id)}
            helperText={formik.touched.id && formik.errors.id}
            label="Recipient ID"
            margin="normal"
            name="recipientId"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.recipient}
            variant="outlined"
            disabled
            size="small"
          />
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
