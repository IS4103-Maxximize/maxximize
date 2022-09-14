import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../helpers/products";
import { fetchSuppliers } from "../../helpers/procurement-ordering";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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
    lotQuantity: quotation ? quotation.lotQuantity : 1,
    lotPrice: quotation ? quotation.lotPrice : 1,
    unit: quotation ? quotation.unit : 'kilogram',
    supplierId: quotation ? quotation.shellOrganisation.id : null,
    skuCode: quotation ? quotation.product.skuCode : null,
  }

  let schema = Yup.object({
    lotQuantity: Yup
      .number()
      .integer()
      .positive()
      .required('Enter Lot Quantity'),
    lotPrice: Yup
      .number()
      .integer()
      .positive()
      .required('Enter Lot Price'),
    unit: Yup
      .string(),
    supplierId: Yup
      .number()
      .integer()
      .required('Select Supplier ID'),
    skuCode: Yup
      .string()
      .required('Select Raw Material SKU'),
  })

  const handleOnSubmit = async (values) => {
    if (action === 'POST') {
      // create
    } else if (action === 'PATCH') {
      // update
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
  const [products, setProducts] = useState([]);

  const [supplierOptions, setSupplierOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const suppliers = await fetchSuppliers();
      const products = await fetchProducts('raw-materials');

      setSuppliers(suppliers);
      setProducts(products);

      setSupplierOptions(suppliers.map(el => el.id));
      setProductOptions(products.map(el => el.skuCode));
    }
    fetchData();
  }, [open]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          {action === 'POST' &&  'Add '}
          {action === 'PATCH' &&  'Edit '}
          {string}
        </DialogTitle>
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
          <TextField
            fullWidth
            error={Boolean(formik.touched.lotPrice && formik.errors.lotPrice)}
            helperText={formik.touched.lotPrice && formik.errors.lotPrice}
            label="Lot Price"
            margin="normal"
            name="lotPrice"
            type="number"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.lotPrice}
            variant="outlined"
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment sx={{mr: 1}}>
            //       $
            //     </InputAdornment>
            //   )
            // }}
          />
          <TextField
            fullWidth
            error={Boolean(formik.touched.lotQuantity && formik.errors.lotQuantity)}
            helperText={formik.touched.lotQuantity && formik.errors.lotQuantity}
            label="Lot Quantity"
            margin="normal"
            name="lotQuantity"
            type="number"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.lotQuantity}
            variant="outlined"
          />
          <Stack sx={{ py: 1 }} direction="row" spacing={1}>
            {/* Supplier Selection */}
            <Autocomplete 
              id="supplier-selector"
              sx={{width: '50%'}}
              options={supplierOptions}
              value={formik.values.supplierId}
              onChange={(event, newValue) => {
                formik.setFieldValue('supplierId', newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Suppliers ID"/>}
            />
            {/* Raw Material Selection */}
            <Autocomplete 
              id="raw-material-selector"
              sx={{width: '50%'}}
              options={productOptions}
              value={formik.values.skuCode}
              onChange={(event, newValue) => {
                formik.setFieldValue('skuCode', newValue);
              }}
              renderInput={(params) => <TextField {...params} label="SKUs"/>}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            disabled={
              !formik.isValid || formik.isSubmitting ||
              !formik.values.supplierId || !formik.values.skuCode
            }
            variant="contained"
            onClick={formik.handleSubmit}>
            Submit
          </Button>
          <Button 
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      </form>
  )
};
