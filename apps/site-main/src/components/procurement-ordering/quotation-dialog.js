import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../helpers/products";
import { fetchSuppliers } from "../../helpers/procurement-ordering";

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
    // supplierId
    // skuCode
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
    setSupplierValue(null);
    setProductValue(null);
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: handleOnSubmit
  })

  // Autocomplete Helpers
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [supplierInput, setSupplierInput] = useState("");
  const [supplierValue, setSupplierValue] = useState();

  const [productOptions, setProductOptions] = useState([]);
  const [productInput, setProductInput] = useState("");
  const [productValue, setProductValue] = useState();
  
  useEffect(() => {
    const fetchData = async () => {
      const suppliers = await fetchSuppliers();
      const products = await fetchProducts('raw-materials');

      setSupplierOptions(suppliers);
      setProductOptions(products);
    }
    fetchData();
  }, [open]);

  useEffect(() => {
    if (quotation !== null) {
      setProductValue(quotation.product)
    };
  }, [quotation])


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
          />
          <Stack sx={{ py: 1 }} direction="row" spacing={1}>
            {/* Supplier Selection */}
            <Autocomplete 
              sx={{width: '50%'}}
              options={supplierOptions}
              value={supplierValue}
              onChange={(event, newValue) => {
                setSupplierValue(newValue);
              }}
              isOptionEqualToValue={(option, value) => {
                return option.name === value.name;
              }}
              getOptionLabel={(option) => {
                return option.name
              }}
              renderInput={(params) => <TextField {...params} label="Suppliers"/>}
            />
            {/* Raw Material Selection */}
            <Autocomplete 
              sx={{width: '50%'}}
              options={productOptions}
              value={productValue}
              onChange={(event, newValue) => {
                setProductValue(newValue);
              }}
              isOptionEqualToValue={(option, value) => {
                return option.skuCode === value.skuCode;
              }}
              getOptionLabel={(option) => {
                return option.skuCode
              }}
              renderInput={(params) => <TextField {...params} label="Raw Materials"/>}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            disabled={
              !formik.isValid || formik.isSubmitting ||
              !supplierValue || !productValue
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
