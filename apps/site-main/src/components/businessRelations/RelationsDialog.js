import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

export const RelationsDialog = ({
  fields,
  openDialog,
  setOpenDialog,
  addOrganisation,
  type,
  orgId,
  handleAlertOpen,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState('');
  const handleDialogClose = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const user = JSON.parse(localStorage.getItem('user'));

  const handleOnSubmit = async () => {
    const response = await fetch(
      'http://localhost:3000/api/shell-organisations',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formik.values.name,
          uen: formik.values.uen,
          contact: {
            address: formik.values.address,
            email: formik.values.email,
            phoneNumber: formik.values.phoneNumber,
            postalCode: formik.values.postalCode,
          },
          organisationId: orgId,
          type: type === 'supplier' ? 'SUPPLIER' : 'RETAILER',
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      if (handleAlertOpen) {
        handleAlertOpen('Successfully onboarded Retailer!', 'success');
      }

      addOrganisation(result);
      setError('');
      handleDialogClose();
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: fields ? fields.name : '',
      uen: fields ? fields.uen : '',
      address: fields ? fields.address : '',
      postalCode: fields ? fields.postalCode : '',
      email: fields ? fields.email : '',
      phoneNumber: fields ? fields.phoneNumber : '',
      creditLimit: 1,
      error: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'First Name must be at least be 1 character long')
        .max(50, 'First Name can at most be 50 characters long')
        .required('Business partner name is required'),
      uen: Yup.string().max(255).required('UEN is required'),
      address: Yup.string()
        .min(3, 'Address must be at least be 3 characters long')
        .max(95, 'Address can at most be 95 characters long')
        .required('Address is required'),
      postalCode: Yup.string()
        .min(6, 'Postal Code must be at least be 6 digits')
        .max(6, 'Postal Code can at most be 6 digits')
        .required('Postal Code is required'),
      email: Yup.string()
        .email('Email must be in a proper format [eg. user@email.com]')
        .min(7, 'Email must be at least be 7 characters long')
        .max(62, 'Email can at most be 62 characters long')
        .required('Email is required'),
      phoneNumber: Yup.string()
        .min(8, 'Phone number must be at least be 8 digits')
        .max(16, 'Phone number can at most be 16 digits')
        .matches(new RegExp('[0-9]'), 'Phone number should only contain digits')
        .required('Phone Number is required'),
      creditLimit: Yup.number()
        .min(1, 'Credit Limit must be a positive number')
        .required('Credit Limit is required'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {`Onboard New ${type === 'supplier' ? 'Supplier' : 'Retailer'}`}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
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
            size="small"
          />

          <TextField
            error={Boolean(formik.touched.uen && formik.errors.uen)}
            fullWidth
            helperText={formik.touched.uen && formik.errors.uen}
            label="UEN"
            margin="normal"
            name="uen"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.uen}
            variant="outlined"
            size="small"
          />

          <TextField
            error={Boolean(formik.touched.address && formik.errors.address)}
            fullWidth
            helperText={formik.touched.address && formik.errors.address}
            label="Address"
            margin="normal"
            name="address"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.address}
            variant="outlined"
            size="small"
          />
          <TextField
            error={Boolean(
              formik.touched.postalCode && formik.errors.postalCode
            )}
            fullWidth
            helperText={formik.touched.postalCode && formik.errors.postalCode}
            label="Postal Code"
            margin="normal"
            name="postalCode"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.postalCode}
            variant="outlined"
            size="small"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
          <TextField
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label="Email"
            margin="normal"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
            variant="outlined"
            type="email"
            size="small"
          />
          <TextField
            error={Boolean(
              formik.touched.phoneNumber && formik.errors.phoneNumber
            )}
            fullWidth
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            label="Phone Number"
            margin="normal"
            name="phoneNumber"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
            variant="outlined"
            size="small"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
          {type === 'retailer' && (
            <TextField
              error={Boolean(
                formik.touched.creditLimit && formik.errors.creditLimit
              )}
              fullWidth
              helperText={
                formik.touched.creditLimit && formik.errors.creditLimit
              }
              label="Credit Limit"
              margin="normal"
              name="creditLimit"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.creditLimit}
              variant="outlined"
              size="small"
            />
          )}
          <Typography variant="caption" color="red">
            {error}
          </Typography>

          <Box
            mt={1}
            mb={1}
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button autoFocus onClick={handleDialogClose}>
              Back
            </Button>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              size="large"
              type="submit"
              variant="contained"
            >
              Onboard
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
