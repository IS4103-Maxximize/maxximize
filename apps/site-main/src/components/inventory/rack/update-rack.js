import { Button, Box, Typography, TextField, Card } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

export const UpdateRack = ({ rack, updateRack, handleAlertOpen }) => {
  //Error handling
  const [error, setError] = useState('');

  //Update Rack
  const handleOnSubmit = async (values) => {
    const response = await fetch(`http://localhost:3000/api/racks/${rack.id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: formik.values.description,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      updateRack(result);
      handleAlertOpen(`Updated Rack ${result.id} successfully`);
      setError('');
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: rack?.description,
    },
    validationSchema: Yup.object({
      //   name: Yup.string()
      //     .min(1, 'Name must be at least be 1 character long')
      //     .max(50, 'Name can at most be 50 characters long')
      //     .required('Name is required'),
      //   address: Yup.string()
      //     .min(3, 'Address must be at least be 3 characters long')
      //     .max(95, 'Address can at most be 95 characters long')
      //     .required('Address is required'),
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
              {rack.description}
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
              Update Rack
            </Button>
          </Box>
        </Box>
        <Card sx={{ marginTop: 1, marginBottom: 2 }}>
          <Box p={2}>
            <Box display="flex" justifyContent="flex-end">
              <TextField
                fullWidth
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
                //   fullWidth
                helperText={
                  formik.touched.description && formik.errors.description
                }
                label="Description"
                margin="normal"
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description || ''}
                variant="outlined"
                multiline
                minRows={4}
              />
            </Box>
            <Typography variant="body1" color="red">
              {error}
            </Typography>
          </Box>
        </Card>
      </form>
    </>
  );
};
