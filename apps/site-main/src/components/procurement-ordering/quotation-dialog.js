import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Autocomplete, Button, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { createQuotation, fetchSalesInquiries, updateQuotationLineItem } from "../../helpers/procurement-ordering";

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
    handleAlertOpen
  } = props;

  // Formik Helpers
  let initialValues = {
    id: quotation ? quotation.id : null,
    created: quotation ? quotation.created : null,
    totalPrice: quotation ? quotation.totalPrice : 1,
    supplierId: quotation ? quotation.shellOrganisation.id : null,
    salesInquiryId: quotation ? quotation.salesInquiry.id : null,
    quotationLineItems: quotation ? quotation.quotationLineItems : [],
  }

  let schema = Yup.object({
    totalPrice: Yup
      .number()
      .integer()
      .positive()
      .required('Enter Total Price'),
  })

  const handleOnSubmit = async (values) => {
    console.log(values)
    if (action === 'POST') {
      // create quotation and lineitems
      const result = await createQuotation(
        values.salesInquiryId, 
        values.supplierId, 
        values.quotationLineItems
      ).catch((err) => handleAlertOpen(`Error creating ${string}`, 'error'));
      console.log(result);
      addQuotation(result);
      // const result = await createSalesInquiry(user.organisation.id, values.lineItems)
      //   .catch((err) => handleAlertOpen(`Error creating ${string}`, 'error'));
      // addSalesInquiry(result);
    } 
    else if (action === 'PATCH') {
      // update lineitems quantity and quotation totalPrice

    }
    console.log(formik.values)
    onClose();
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: handleOnSubmit
  })

  // Autocomplete Helpers
  const [suppliers, setSuppliers] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);

  const [salesInquiries, setSalesInquiries] = useState([]);
  const [salesInquiryOptions, setSalesInquiryOptions] = useState([]);

  // const [products, setProducts] = useState([]);
  // const [productOptions, setProductOptions] = useState([]);
  // // const [productInputValue, setProductInputValue] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      const salesInquiries = await fetchSalesInquiries(user.organisation.id);
      setSalesInquiries(salesInquiries);
      setSalesInquiryOptions(salesInquiries.map(el => el.id));
    }
    if (action === 'POST') {
      fetchData();
    }
    // Calculate total price
    formik.setFieldValue('totalPrice', 
    formik.values.quotationLineItems.reduce((a, b) => {
      const price = b.price ? b.price : 1
      return a + b.quantity * price
    }, 0))
  }, [open, formik.values.quotationLineItems]);

  useEffect(() => {
    if (action === 'POST') {
      const si = salesInquiries.find(inquiry => inquiry.id === formik.values.salesInquiryId)
      // console.log(si ? si.salesInquiryLineItems : [])
      formik.setFieldValue('quotationLineItems', si ? si.salesInquiryLineItems : [])
    }
  }, [formik.values.salesInquiryId])

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowUpdate = (newRow) => {
    let updatedRow = {...newRow};
    // console.log(updatedRow);
    formik.setFieldValue('quotationLineItems', 
      formik.values.quotationLineItems.map(item => {
        if (item.id === updatedRow.id) {
          console.log(updatedRow)
          return updatedRow;
        }
        return item;
      })
    )
    console.log(formik.values.quotationLineItems)
    if (action === 'PATCH') {
      // console.log(updatedRow);
      const updatedId = updatedRow.id
      updatedRow = updateQuotationLineItem(updatedRow.id, updatedRow.price)
        .then(() => handleAlertOpen(`Updated QuotationLineItem ${updatedId} successfully !`), 'success')
        .catch(err => handleAlertOpen(`Error updating QuotationLineItem`, 'error'))
    }
    return updatedRow;
  }

  // useEffect(() => {
  //   console.log(quotation);
  // }, [open])

  const columns = [
    {
      field: 'price',
      headerName: 'Quoted Price *',
      flex: 1,
      editable: true,
      valueGetter: (params) => {
        if (action === 'POST') {
          return params.row.price ? params.row.price : params.row.indicativePrice
        }
        if (action === 'PATCH') {
          // console.log(params.row)
          return params.row.price
        }
      }
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : ''
      }
    },
    {
      field: 'rawName',
      headerName: 'Raw Material Name',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.name : ''
      }
    },
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.skuCode : ''
      }
    },
  ]

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
      >
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
              {/* {`Create `}
              {`View `} */}
              {string}
            </Typography>
            {action === 'POST' && <Button 
              variant="contained"
              disabled={
                !formik.isValid || 
                formik.isSubmitting
              }
              onClick={formik.handleSubmit}
            >
              Submit
            </Button>}
          </Toolbar>
        </AppBar>
        <DialogContent>
          {quotation && <TextField
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
          />}
          {quotation && <TextField
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
          />}
          <TextField
            fullWidth
            error={Boolean(formik.touched.totalPrice && formik.errors.totalPrice)}
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
          />
          <Stack direction="row" spacing={1}>
            {!quotation && <Autocomplete 
              id="sales-inquiry-selector"
              sx={{ width: 300, mb: 1 }}
              options={salesInquiryOptions}
              value={formik.values.salesInquiryId}
              onChange={(event, newValue) => {
                formik.setFieldValue('salesInquiryId', newValue);
                console.log(newValue);
                console.log(salesInquiries);
                const si = salesInquiries.find(el => el.id === newValue);
                console.log(si);
                setSupplierOptions(si.suppliers);
              }}
              getOptionLabel={(option) => option.toString(10)}
              renderInput={(params) => <TextField {...params} label="Sales Inquiry ID"/>}
            />}
            {/* Supplier Selection */}
            {!quotation && <Autocomplete 
              id="supplier-selector"
              sx={{ width: 300, mb: 1 }}
              options={supplierOptions.map(el => el.id.toString())}
              onChange={(event, newValue) => {
                console.log(newValue);
                formik.setFieldValue('supplierId', parseInt(newValue));
              }}
              renderInput={(params) => <TextField {...params} label="Suppliers ID"/>}
            />}
            {quotation && <TextField
              label="Sales Inquiry ID"
              value={quotation.salesInquiry.id}
              disabled={quotation}
            />}
            {quotation && <TextField
              label="Supplier ID"
              value={quotation.shellOrganisation.id}
              disabled={quotation}
            />}
            
          </Stack>
          <DataGrid
            autoHeight
            rows={formik.values.quotationLineItems}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={handleRowUpdate}
          />
        </DialogContent>
      </Dialog>
      </form>
  )
};
