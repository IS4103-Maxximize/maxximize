import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useFormik } from 'formik';
import { useState, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
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
    ...rest
  } = props;

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (product) {
      if (type === 'raw-materials') {
        setDisabled(product.bomLineItems.length > 0);
      }
      if (type === 'final-goods') {
        setDisabled(product.billOfMaterial);
      }
    }
  }, [product]);

  let initialValues = {
    id: product ? product.id : null,
    name: product ? product.name : '',
    description: product ? product.description : '',
    unit: product ? product.unit : 'kilogram',
    unitPrice: product ? Number(product.unitPrice) : '',
    expiry: product ? Number(product.expiry) : '',
    skuCode: product ? product.skuCode : '',
    lotQuantity: product ? Number(product.lotQuantity) : '',
    image: '',
  };
  let schema = {
    name: Yup.string().max(255).required('Name is required'),
    description: Yup.string(),
    unit: Yup.string(),
    unitPrice: Yup.number()
      .positive('Unit Price must be positive')
      .required('Unit Price is required'),
    expiry: Yup.number()
      .positive('Days must be a positive integer')
      .integer('Days must be a positive integer')
      .required('Expiry (days) is required'),
    lotQuantity: Yup.number()
      .positive('Lot Quantity must be a positive integer')
      .integer('Lot Quantity must be a positive integer')
      .required('Lot quantity is required'),
    image: Yup.mixed().required(),
  };

  const handleOnSubmit = async (values) => {
    if (action === 'POST') {
      let result;
      if (type === 'final-goods') {
        result = await createProduct(type, values, organisationId).catch(
          (err) => handleAlertOpen(`Error creating ${typeString}`, 'error')
        );
      } else {
        result = await createProduct(type, values, organisationId).catch(
          (err) => handleAlertOpen(`Error creating ${typeString}`, 'error')
        );
      }
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

  useEffect(() => console.log(formik.values.image), [formik.values.image]);

  const onClose = () => {
    formik.resetForm();
    setDisabled(false);
    handleClose();
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    if (file) reader.readAsDataURL(file);

    reader.onload = function () {
      return reader.result;
    };

    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      formik.setFieldValue('image', convertToBase64(acceptedFiles));
    },
  });

  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignitems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };

  const focusedStyle = {
    borderColor: '#2196f3',
  };

  const acceptStyle = {
    borderColor: '#00e676',
  };

  const rejectStyle = {
    borderColor: '#ff1744',
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

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
            Lot Quantity, Expiry (in days)
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
            disabled={disabled}
            error={Boolean(
              formik.touched.lotQuantity && formik.errors.lotQuantity
            )}
            fullWidth
            helperText={formik.touched.lotQuantity && formik.errors.lotQuantity}
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
            disabled={disabled}
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
            InputProps={{
              startAdornment: <InputAdornment sx={{ mr: 1 }}>$</InputAdornment>,
            }}
          />
          <TextField
            required
            disabled={disabled}
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
          {type === 'final-goods' ? (
            <Box mt={2}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Upload final good image
              </Typography>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop image here, or click to select image</p>
              </div>
              <Box ml={3} mt={2}>
                <aside>
                  <h4>Uploaded image</h4>
                  <ul>{acceptedFileItems}</ul>
                </aside>
              </Box>
            </Box>
          ) : (
            <></>
          )}
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
