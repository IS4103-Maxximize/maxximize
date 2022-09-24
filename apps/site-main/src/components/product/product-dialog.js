import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createProduct, updateProduct } from '../../helpers/products';

const options = ['kilogram', 'litre'];

export const ProductDialog = (props) => {
  const {
    action,
    open,
    handleClose,
    type,
    typeString,
    product,
    addProduct,
    handleAlertOpen,
    organisationId,
    updateProducts,
  } = props;

  let initialValues = {
    id: product ? product.id : null,
    name: product ? product.name : '',
    description: product ? product.description : '',
    unit: product ? product.unit : 'kilogram',
    unitPrice: product ? Number(product.unitPrice) : '',
    expiry: product ? Number(product.expiry) : '',
    skuCode: product ? product.skuCode : '',
    lotQuantity: product ? Number(product.lotQuantity) : '',
  };
  let schema = {
    name: Yup.string().max(255).required('Name is required'),
    description: Yup.string(),
    unit: Yup.string(),
    unitPrice: Yup.number().required('Unit Price is required'),
    expiry: Yup.number().required('Expiry (days) is required'),
    lotQuantity: Yup.number().required('Lot quantity is required'),
  };

  const handleOnSubmit = async (values) => {
    if (action === 'POST') {
      const result = await createProduct(type, values, organisationId).catch(
        (err) => handleAlertOpen(`Error creating ${typeString}`, 'error')
      );
      addProduct(result);
    } else if (action === 'PATCH') {
      try {
        const updatedProduct = await updateProduct(product.id, type, values);
        updateProducts(updatedProduct);
        handleAlertOpen(
          `Updated ${typeString} ${updatedProduct.id} successfully!`,
          'success'
        );
      } catch (err) {
        handleAlertOpen(`Error updateing ${typeString} product.id`, 'error');
      }
    }
    onClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object(schema),
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {action === 'POST' && 'Add '}
          {action === 'PATCH' && 'Edit '}
          {typeString}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter {typeString} Name, Description, Measurement Unit, Unit Price,
            Expiry (in days)
            {type === 'final-goods' && ', Lot Quantity'}
          </DialogContentText>
          <TextField
            required
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Name"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
            disabled={action === 'PATCH'}
          />
          {product && (
            <TextField
              required
              error={Boolean(formik.touched.skuCode && formik.errors.skuCode)}
              fullWidth
              helperText={formik.touched.skuCode && formik.errors.skuCode}
              label="SKU"
              margin="normal"
              name="skuCode"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.skuCode}
              variant="outlined"
              disabled
            />
          )}
          <TextField
            error={Boolean(
              formik.touched.description && formik.errors.description
            )}
            fullWidth
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outlined"
            multiline
            minRows={4}
            autoFocus={action === 'PATCH'}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Measurement Unit :</Typography>
            <RadioGroup
              label="Unit"
              margin="normal"
              name="unit"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.unit}
              defaultValue={options[0]}
              row
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={action === 'PATCH'}
                />
              ))}
            </RadioGroup>
          </Stack>
          <TextField
            required
            error={Boolean(formik.touched.unitPrice && formik.errors.unitPrice)}
            fullWidth
            helperText={formik.touched.unitPrice && formik.errors.unitPrice}
            label="Unit Price"
            margin="normal"
            name="unitPrice"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={formik.values.unitPrice}
            variant="outlined"
          />
          <TextField
            required
            error={Boolean(
              formik.touched.lotQuantity && formik.errors.lotQuantity
            )}
            fullWidth
            helperText={
              formik.touched.lotQuantity && formik.errors.lotQuantity
            }
            label="Lot Quantity"
            margin="normal"
            name="lotQuantity"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={formik.values.lotQuantity}
            variant="outlined"
          />
          <TextField
            required
            error={Boolean(formik.touched.expiry && formik.errors.expiry)}
            fullWidth
            helperText={formik.touched.expiry && formik.errors.expiry}
            label="Expiry (Days)"
            margin="normal"
            name="expiry"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={formik.values.expiry}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!formik.isValid || formik.isSubmitting}
            variant="contained"
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};
