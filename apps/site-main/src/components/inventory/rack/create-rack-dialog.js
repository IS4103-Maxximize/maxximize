import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  useTheme,
  Box,
  Typography,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

export const CreateRackDialog = ({
  warehouse,
  open,
  setOpen,
  addRack,
  handleAlertOpen,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Error handling
  const [error, setError] = useState('');

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  //Handle Formik submission
  const handleOnSubmit = async () => {
    const response = await fetch('http://localhost:3000/api/racks', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        warehouseId: warehouse.id,
        name: formik.values.name,
        description: formik.values.description,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      addRack(result);
      handleAlertOpen(`Created Rack ${result.id} successfully`);
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
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'Name must be at least be 1 character long')
        .max(50, 'Name can at most be 50 characters long')
        .required('Name is required'),
      description: Yup.string()
        .min(1, 'Description must be at least be 1 character long')
        .max(255, 'Description can at most be 255 characters long')
        .required('Description is required'),
    }),
    onSubmit: handleOnSubmit,
  });

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{'Create Rack'}</DialogTitle>
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
              Create Rack
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
