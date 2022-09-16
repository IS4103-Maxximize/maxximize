import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  useTheme,
  Box,
  Typography,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

export const CreateWorkerDialog = ({
  openDialog,
  setOpenDialog,
  handleAlertOpen,
  addWorker,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState('');

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Handle Formik submission
  const handleOnSubmit = async () => {
    const min = 100000;
    const max = 1000000;
    const rand = Math.floor(min + Math.random() * (max - min));

    formik.values.username =
      formik.values.firstName + formik.values.lastName + rand.toString();

    const response = await fetch('http://localhost:3000/api/users/createUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        username: formik.values.username,
        password: '',
        role: formik.values.role,
        organisationId: organisationId,
        contact: {
          address: formik.values.address,
          email: formik.values.email,
          phoneNumber: formik.values.phoneNumber,
          postalCode: formik.values.postalCode,
        },
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      addWorker(result);
      handleAlertOpen(`Created Worker ${result.id} successfully`);
      setError('');
      handleDialogClose();
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      role: '',
      address: '',
      postalCode: '',
      email: '',
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(1, 'First Name must be at least be 1 character long')
        .max(50, 'First Name can at most be 50 characters long')
        .required('First name is required'),
      lastName: Yup.string()
        .min(1, 'Last Name must be at least be 1 character long')
        .max(50, 'Last Name can at most be 50 characters long')
        .required('Last name is required'),
      role: Yup.string().required('Role is required'),
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
    }),
    onSubmit: handleOnSubmit,
  });

  const workerRoles = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'factoryWorker', label: 'Factory Worker' },
    { value: 'driver', label: 'Driver' },
  ];

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Create Worker Account'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            error={Boolean(formik.touched.firstName && formik.errors.firstName)}
            fullWidth
            helperText={formik.touched.firstName && formik.errors.firstName}
            label="First Name"
            margin="normal"
            name="firstName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.firstName}
            variant="outlined"
            size="small"
          />
          <TextField
            error={Boolean(formik.touched.lastName && formik.errors.lastName)}
            fullWidth
            helperText={formik.touched.lastName && formik.errors.lastName}
            label="Last Name"
            margin="normal"
            name="lastName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.lastName}
            variant="outlined"
            size="small"
          />
          <TextField
            select
            fullWidth
            helperText={formik.touched.role && formik.errors.role}
            label="Role"
            margin="normal"
            name="role"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="string"
            value={formik.values.role}
            variant="outlined"
            size="small"
          >
            {workerRoles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

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
            type="email"
            value={formik.values.email}
            variant="outlined"
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
          />

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
              Create Account
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
