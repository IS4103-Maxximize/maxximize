import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

export const OnboardClientDialog = (props) => {
  const { action, open, handleClose, onboardClient, handleAlertOpen } = props;

  const createOrganisation = async (values) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    //Create Client Organisation
    let orgBody = {
      name: formik.values.orgName,
      type: formik.values.orgType,
      uen: formik.values.uen,
      contact: {
        phoneNumber: formik.values.orgPhoneNumber,
        email: formik.values.orgEmail,
        address: formik.values.orgAddress,
        postalCode: formik.values.orgPostalCode,
      },
    };

    orgBody = JSON.stringify(orgBody);

    const orgRequestOptions = {
      method: 'POST',
      headers: headers,
      body: orgBody,
    };

    const newClientOrganisation = await fetch(
      `http://localhost:3000/api/organisations`,
      orgRequestOptions
    );

    //const newClientOrganisationResult = await newClientOrganisation.json();

    return newClientOrganisation;
  };

  const createAdminAccount = async (values, newClientOrganisationId) => {
    console.log(newClientOrganisationId);
    console.log(values);
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    //Create Admin User Account
    const min = 100000;
    const max = 1000000;
    const rand = Math.floor(min + Math.random() * (max - min));

    formik.values.username =
      formik.values.firstName + formik.values.lastName + rand.toString();

    let adminBody = {
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      username: formik.values.username,
      password: '',
      role: 'admin',
      organisationId: newClientOrganisationId,
      contact: {
        address: formik.values.address,
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
        postalCode: formik.values.postalCode,
      },
    };

    adminBody = JSON.stringify(adminBody);

    const accountRequestOptions = {
      method: 'POST',
      headers: headers,
      body: adminBody,
    };

    const adminAccount = await fetch(
      `http://localhost:3000/api/users/createUser`,
      accountRequestOptions
    );

    //const adminAccountResult = await adminAccount.json();

    return adminAccount;
  };

  //Submission
  const [error, setError] = useState('');

  const handleOnSubmit = async (values) => {
    if (action === 'POST') {
      const response = await createOrganisation(values);
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        console.log('Organisation success');
        const result = await response.json();
        console.log(result);
        setError('');

        const accountResponse = await createAdminAccount(values, result.id);
        if (accountResponse.status === 200 || accountResponse.status === 201) {
          console.log('Account success');
          const accountResult = await accountResponse.json();
          console.log(accountResult);
          setError('');
          handleClose();
        } else {
          console.log('Account fail');
          const accountResult = await accountResponse.json();
          console.log(accountResult.message);
          setError(accountResult.message);
        }
      } else {
        console.log('Organisation failed');
        console.log(response.message);
        setError(response.message);
      }
    }
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      orgName: '',
      orgType: '',
      uen: '',
      orgEmail: '',
      orgAddress: '',
      orgPostalCode: '',
      orgPhoneNumber: '',
      firstName: '',
      lastName: '',
      username: '',
      address: '',
      postalCode: '',
      email: '',
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      orgName: Yup.string()
        .min(1, 'Organisation Name must be at least be 1 character long')
        .max(60, 'Organisation Name can at most be 60 characters long')
        .required('Organisaion Name is required'),
      uen: Yup.string()
        .min(9, 'UEN must be at least be 9 characters long')
        .max(10, 'UEN can at most be 10 characters long')
        .required('UEN is required'),
      orgEmail: Yup.string()
        .email('Email must be in a proper format [eg. user@email.com]')
        .min(7, 'Email must be at least be 7 characters long')
        .max(62, 'Email can at most be 62 characters long')
        .required('Email is required'),
      orgAddress: Yup.string()
        .min(3, 'Address must be at least be 3 characters long')
        .max(95, 'Address can at most be 95 characters long')
        .required('Address is required'),
      orgPostalCode: Yup.string()
        .min(6, 'Postal Code must be at least be 6 digits')
        .max(6, 'Postal Code can at most be 6 digits')
        .required('Postal Code is required'),
      orgPhoneNumber: Yup.string()
        .min(8, 'Phone number must be at least be 8 digits')
        .max(16, 'Phone number can at most be 16 digits')
        .matches(new RegExp('[0-9]'), 'Phone number should only contain digits')
        .required('Phone Number is required'),
      firstName: Yup.string()
        .min(1, 'First Name must be at least be 1 character long')
        .max(50, 'First Name can at most be 50 characters long')
        .required('First name is required'),
      lastName: Yup.string()
        .min(1, 'Last Name must be at least be 1 character long')
        .max(50, 'Last Name can at most be 50 characters long')
        .required('Last name is required'),
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

  const orgTypes = [
    { value: 'supplier', label: 'Supplier' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'retailer', label: 'Retailer' },
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar color="success" sx={{ position: 'relative' }}>
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
              Onboard Client
            </Typography>
            <Button
              disabled={!(formik.dirty && formik.isValid)}
              autoFocus
              color="inherit"
              size="medium"
              onClick={formik.handleSubmit}
              variant="outlined"
            >
              Onboard
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box display="flex">
            <Box mr={2} flex={1}>
              <Typography variant="h6" component="div">
                Client Organisation
              </Typography>
              <TextField
                color="success"
                error={Boolean(formik.touched.orgName && formik.errors.orgName)}
                fullWidth
                helperText={formik.touched.orgName && formik.errors.orgName}
                label="Organisation Name"
                margin="normal"
                name="orgName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.orgName}
                variant="outlined"
                size="small"
              />
              <TextField
                color="success"
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
                color="success"
                select
                fullWidth
                helperText={formik.touched.orgType && formik.errors.orgType}
                label="Type"
                margin="normal"
                name="orgType"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="string"
                value={formik.values.orgType}
                variant="outlined"
                size="small"
              >
                {orgTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                color="success"
                error={Boolean(
                  formik.touched.orgAddress && formik.errors.orgAddress
                )}
                fullWidth
                helperText={
                  formik.touched.orgAddress && formik.errors.orgAddress
                }
                label="Organisation Address"
                margin="normal"
                name="orgAddress"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.orgAddress}
                variant="outlined"
                size="small"
              />
              <TextField
                color="success"
                error={Boolean(
                  formik.touched.orgPostalCode && formik.errors.orgPostalCode
                )}
                fullWidth
                helperText={
                  formik.touched.orgPostalCode && formik.errors.orgPostalCode
                }
                label="Organisation Postal Code"
                margin="normal"
                name="orgPostalCode"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.orgPostalCode}
                variant="outlined"
                size="small"
              />
              <TextField
                color="success"
                error={Boolean(
                  formik.touched.orgEmail && formik.errors.orgEmail
                )}
                fullWidth
                helperText={formik.touched.orgEmail && formik.errors.orgEmail}
                label="Organisation Email"
                margin="normal"
                name="orgEmail"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="orgEmail"
                value={formik.values.orgEmail}
                variant="outlined"
                size="small"
              />
              <TextField
                color="success"
                error={Boolean(
                  formik.touched.orgPhoneNumber && formik.errors.orgPhoneNumber
                )}
                fullWidth
                helperText={
                  formik.touched.orgPhoneNumber && formik.errors.orgPhoneNumber
                }
                label="Organisation Phone Number"
                margin="normal"
                name="orgPhoneNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.orgPhoneNumber}
                variant="outlined"
                size="small"
              />
            </Box>

            <Box ml={2} flex={1}>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                First Admin Account
              </Typography>
              <TextField
                color="success"
                error={Boolean(
                  formik.touched.firstName && formik.errors.firstName
                )}
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
                color="success"
                error={Boolean(
                  formik.touched.lastName && formik.errors.lastName
                )}
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
                color="success"
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
                color="success"
                error={Boolean(
                  formik.touched.postalCode && formik.errors.postalCode
                )}
                fullWidth
                helperText={
                  formik.touched.postalCode && formik.errors.postalCode
                }
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
                color="success"
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
                color="success"
                error={Boolean(
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                )}
                fullWidth
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                label="Phone Number"
                margin="normal"
                name="phoneNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
          <Typography>Error: {error}</Typography>
        </DialogContent>
      </Dialog>
    </form>
  );
};
