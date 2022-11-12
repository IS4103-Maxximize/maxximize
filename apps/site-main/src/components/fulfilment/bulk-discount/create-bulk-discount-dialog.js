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

export const CreateBulkDiscountDialog = ({
  openDialog,
  setOpenDialog,
  handleAlertOpen,
  addOutlet,
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
    const response = await fetch('http://localhost:3000/api/outlets', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organisationId: organisationId,
        name: formik.values.name,
        address: formik.values.address,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      addOutlet(result);
      handleAlertOpen(`Created Outlet ${result.id} successfully`);
      setError('');
      handleDialogClose();
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'Name must be at least be 1 character long')
        .max(50, 'Name can at most be 50 characters long')
        .required('name is required'),
      address: Yup.string()
        .min(3, 'Address must be at least be 3 characters long')
        .max(95, 'Address can at most be 95 characters long')
        .required('Address is required'),
    }),
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
        {'Create Address Record'}
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

          <Typography variant="body1" color="red">
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
              Create
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
