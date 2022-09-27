import { Button, Box, Typography, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

export const UpdateWarehouse = ({
  warehouse,
  updateWarehouse,
  handleAlertOpen,
}) => {
  //Error handling
  const [error, setError] = useState('');

  //Update Warehouse
  const handleOnSubmit = async (values) => {
    const response = await fetch(
      `http://localhost:3000/api/warehouses/${warehouse.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formik.values.name,
          address: formik.values.address,
          description: formik.values.description,
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      updateWarehouse(result);
      handleAlertOpen(`Updated Warehouse ${result.id} successfully`);
      setError('');
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: warehouse?.name,
      address: warehouse?.address,
      description: warehouse?.description,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'Name must be at least be 1 character long')
        .max(50, 'Name can at most be 50 characters long')
        .required('Name is required'),
      address: Yup.string()
        .min(3, 'Address must be at least be 3 characters long')
        .max(95, 'Address can at most be 95 characters long')
        .required('Address is required'),
      description: Yup.string()
        .min(1, 'Description must be at least be 1 character long')
        .max(200, 'Description can at most be 200 characters long')
        .required('Description is required'),
    }),
    onSubmit: handleOnSubmit,
  });

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.o;

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" justifyContent="space-between">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              m: -1,
            }}
          >
            <Typography sx={{ m: 1 }} variant="h4">
              {warehouse.name}
            </Typography>
          </Box>
          <Box
            mt={1}
            mb={1}
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              size="small"
              type="submit"
              variant="contained"
            >
              Update Warehouse
            </Button>
          </Box>
        </Box>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          //   fullWidth
          helperText={formik.touched.name && formik.errors.name}
          label="Name"
          margin="normal"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.name || ''}
          variant="outlined"
          size="small"
          sx={{ marginRight: '1%', width: '20%' }}
        />

        <TextField
          error={Boolean(formik.touched.address && formik.errors.address)}
          //   fullWidth
          helperText={formik.touched.address && formik.errors.address}
          label="Address"
          margin="normal"
          name="address"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.address || ''}
          variant="outlined"
          size="small"
          sx={{ width: '79%' }}
        />
        <Box display="flex" justifyContent="flex-end">
          <TextField
            error={Boolean(
              formik.touched.description && formik.errors.description
            )}
            //   fullWidth
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description || ''}
            variant="outlined"
            multiline
            minRows={4}
            sx={{ width: '79%' }}
          />
        </Box>
        <Typography variant="body1" color="red">
          {error}
        </Typography>
      </form>
    </>
  );
};
