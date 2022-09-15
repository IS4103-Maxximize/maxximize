import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    useTheme,
    Box,
    Typography,
    responsiveFontSizes,
  } from '@mui/material';
  import useMediaQuery from '@mui/material/useMediaQuery';
  import { useFormik } from 'formik';
import { useState } from 'react';
  import * as Yup from 'yup';

export const UpdateRelationsDialog = ({
    openUpdateDialog,
    setOpenUpdateDialog,
    updateOrganisation,
    type,
    rowData
  }) => {
    let initialValues = {
        address: rowData ? rowData.contact.address : null,
        postalCode: rowData ? rowData.contact.postalCode : null,
        phoneNumber: rowData ? rowData.contact.phoneNumber : null,
        email: rowData ? rowData.contact.email : null,
        error: ''
    }
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [error, setError] = useState('')

    const handleDialogClose = () => {
      setOpenUpdateDialog(false);
      formik.resetForm();
    };

    const handleOnSubmit = async () => {
     
        const response = await fetch(`http://localhost:3000/api/shell-organisations/${rowData.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
  
          updateOrganisation(result)
          setError('')
          handleDialogClose();
        } else {
          const result = await response.json()
          setError(result.message)
        }
  };
  
    const formik = useFormik({
      initialValues: initialValues,
      enableReinitialize: true,
      validationSchema: Yup.object({
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
      onSubmit: handleOnSubmit
    });
    
    return (
      <Dialog
        fullScreen={fullScreen}
        open={openUpdateDialog}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {`Update ${type === "supplier" ? "Supplier" : "Retailer"}`}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
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
              <Button autoFocus 
              onClick={handleDialogClose}>
                Back
              </Button>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                size="large"
                type="submit"
                variant="contained"
              >
                Update
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  