import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Autocomplete, Badge, Box, Button, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import * as Yup from "yup";
import { fetchSuppliers } from "../../helpers/procurement-ordering";
import { fetchProducts } from "../../helpers/products";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { formatRelative } from 'date-fns';

export const QuotationDialog = (props) => {
  const {
    action, // POST || PATCH
    open,
    handleClose,
    string,
    quotation,
    addQuotation,
    updateQuotation
  } = props;

  // Formik Helpers
  let initialValues = {
    id: quotation ? quotation.id : null,
    created: quotation ? quotation.created : null,
    totalPrice: quotation ? quotation.totalPrice : 1,    
    supplierId: quotation ? quotation.shellOrganisation.id : null,
    skuCode: '',
    numProd: 1,
    salesInquiry: quotation ? quotation.salesInquiry : null,
    lineItems: quotation ? quotation.quotationLineItems : [],
  }

  let schema = Yup.object({
    totalPrice: Yup
      .number()
      .integer()
      .positive()
      .required('Enter Total Price'),
  })

  const handleOnSubmit = async (values) => {
    if (action === 'POST') {
      // create
    } else if (action === 'PATCH') {
      // update
    }
    console.log(formik.values)
    // onClose();
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

  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productInputValue, setProductInputValue] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      let suppliers = await fetchSuppliers();
      let products = await fetchProducts('raw-materials');

      setSuppliers(suppliers);
      products = products.filter(el => formik.values.lineItems.map(item => item.rawMaterial.skuCode).includes(el.skuCode) ? null : el);
      setProducts(products);

      setSupplierOptions(suppliers.map(el => el.id));
      setProductOptions(products.map(el => el.skuCode));
    }
    fetchData();
    // console.log(products)
    // console.log(suppliers)
  }, [open, formik.values.lineItems]);

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const addLineItem = (quantity, input) => {
    // console.log(input)
    const product = products.find((option) => option.skuCode === input);
    // console.log(product);
    const newItem = {
      id: uuid(),
      quantity: quantity,
      rawMaterial: product,
    }
    console.log(newItem);
    formik.setFieldValue('lineItems', [...formik.values.lineItems, newItem]);
    console.log(formik.values.lineItems);
    setProductInputValue("");
    formik.setFieldValue('numProd', 1);
  };

  const deleteLineItems = (ids) => {
    const updatedLineItems = formik.values.lineItems.filter((el) => !ids.includes(el.id));
    formik.setFieldValue('lineItems', [...updatedLineItems]);
  }

  // useEffect(() => {
  //   console.log(formik.values.lineItems);
  // }, [formik.values.lineItems])

  const columns = [
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
    }
  ]

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
      >
        {/* <DialogTitle>
          {action === 'POST' &&  'Add '}
          {action === 'PATCH' &&  'Edit '}
          {string}
        </DialogTitle> */}
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
              {action === 'POST' && 'Add '}
              {action === 'PATCH' && 'Edit '}
              {string}
            </Typography>
            {formik.values.status !== 'pending' &&
              <Button 
                variant="contained"
                disabled={
                  !formik.isValid || 
                  formik.isSubmitting
                }
                onClick={formik.handleSubmit}
              >
                Save
              </Button>
            }
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
          />
          {/* Supplier Selection */}
          <Autocomplete 
            id="supplier-selector"
            sx={{ width: 300, mb: 1 }}
            options={supplierOptions}
            value={formik.values.supplierId}
            onChange={(event, newValue) => {
              formik.setFieldValue('supplierId', newValue);
            }}
            getOptionLabel={(option) => option.toString(10)}
            renderInput={(params) => <TextField {...params} label="Suppliers ID"/>}
          />
          {/* Line Item Management */}
          <Box my={2} display="flex" justifyContent="space-between">
              <Stack 
                direction="row" 
                spacing={1}
              >
                <Autocomplete
                  disablePortal
                  sx={{width: 300}}
                  options={productOptions}
                  value={formik.values.skuCode}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('skuCode', newValue);
                  }}
                  inputValue={productInputValue}
                  onInputChange={(event, newInputValue) => {
                    setProductInputValue(newInputValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="SKUs"/>}
                />
                <TextField
                  error={Boolean(formik.touched.numProd && formik.errors.numProd)}
                  helperText={formik.touched.numProd && formik.errors.numProd}
                  label="Enter Number of Raw Materials"
                  margin="normal"
                  name="numProd"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.numProd}
                  variant="outlined"
                />
                <IconButton
                  disabled={
                    !formik.values.skuCode || 
                    formik.values.numProd <= 0 || 
                    formik.values.numProd === null
                  }
                  color="primary"
                  onClick={() => {
                    addLineItem(formik.values.numProd, productInputValue);
                  }}
                >
                  <AddBoxIcon/>
                </IconButton>
              </Stack>
              <IconButton
                disabled={selectedRows.length === 0}
                color="error"
                onClick={() => deleteLineItems(selectedRows)}
              >
                <Badge badgeContent={selectedRows.length} color="error">
                  <DeleteIcon/>
                </Badge>
              </IconButton>
            </Box>
            <DataGrid
            autoHeight
            rows={formik.values.lineItems}
            columns={columns}
            checkboxSelection={formik.values.status !== 'pending'}
            disableSelectionOnClick={formik.values.status === 'pending'}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
          />
        </DialogContent>
      </Dialog>
      </form>
  )
};
