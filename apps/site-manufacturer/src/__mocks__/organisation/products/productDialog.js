import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, FormControlLabel, 
  Radio, RadioGroup, TextField, Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const options = [
  'KILOGRAM',
  'LITRE',
]

export const ProductDialog = (props) => {
  const {open, handleClose} = props;

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      unit: 'KILOGRAM',
      unitPrice: '',
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(255)
        .required('Product Name is required'),
      description: Yup
        .string()
        .max(255),
      unit: Yup
        .string(),
      unitPrice: Yup
        .number()
        .required('Unit Price is required'),
    }),
    onSubmit: {}
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter Product Name, Description, Measurement Unit and Unit Price.
          </DialogContentText>
          <TextField
            required
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Product Name"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
          />
          <TextField
            error={Boolean(formik.touched.description && formik.errors.description)}
            fullWidth
            helperText={formik.touched.description && formik.errors.description}
            label="Product Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outlined"
          />
          <Stack 
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Typography>Measurement Unit :</Typography>
            <RadioGroup
              error={Boolean(formik.touched.unit && formik.errors.unit)}
              fullWidth
              label="Unit"
              margin="normal"
              name="unit"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.unit}
              row
            >
              {options.map(option => (
                <FormControlLabel 
                  key={option} 
                  value={option} 
                  control={<Radio/>} 
                  label={option}
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
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            onClick={handleClose}>
            Submit
          </Button>
          <Button 
            color="error" 
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}