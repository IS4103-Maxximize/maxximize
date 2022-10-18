import {
  Button,
  Box,
  Typography,
  TextField,
  Card,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import KitchenIcon from '@mui/icons-material/Kitchen';
import { useNavigate } from 'react-router-dom';

export const UpdateBin = ({ bin, updateBin, handleAlertOpen }) => {
  //Error handling
  const [error, setError] = useState('');

  //Update Bin
  const handleOnSubmit = async (values) => {
    const response = await fetch(`http://localhost:3000/api/bins/${bin.id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formik.values.name,
        volumetricSpace: formik.values.volumetricSpace,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      updateBin(result);
      handleAlertOpen(`Updated Bin ${result.id} successfully`);
      setError('');
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      rackId: bin?.rack?.id,
      name: bin?.name,
      volumetricSpace: bin?.volumetricSpace,
      currentCapacity: bin?.currentCapacity,
    },
    validationSchema: Yup.object({
      //   rackId: Yup.string()
      //     .min(1, 'Rack ID must be at least be 1 character long')
      //     .max(50, 'Rack ID can at most be 50 characters long')
      //     .required('Rack ID is required'),
      name: Yup.string()
        .min(1, 'Name must be at least be 1 character long')
        .max(50, 'Name can at most be 50 characters long')
        .required('Name is required'),
      volumetricSpace: Yup.number()
        .positive('Volumetric Space must be positive')
        .required('Volumetric Space is required'),
    }),
    onSubmit: handleOnSubmit,
  });

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // License: MIT - https://opensource.org/licenses/MIT
  // Author: Michele Locati <michele@locati.it>
  // Source: https://gist.github.com/mlocati/7210513
  //Edited for darker shade, better constrast
  const perc2color = (bin) => {
    let perc =
      ((bin.volumetricSpace - bin.currentCapacity) / bin.volumetricSpace) * 100;
    let r,
      g,
      b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    } else {
      g = 255;
      r = Math.round(510 - 5.1 * perc);
    }
    let h = r * 0x10000 + g * 0x100 + b * 0x1;
    h = h.toString(16);

    let newString = '';

    for (let i = 0; i < h.length; i++) {
      if (i % 2 != 0) {
        newString += '0';
      } else {
        newString += h.charAt(i);
      }
    }

    return '#' + ('000000' + newString).slice(-6);
  };

  //Navigate to the bin page
  const navigate = useNavigate();

  return (
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
            {bin.name}
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
            Update Bin
          </Button>
        </Box>
      </Box>
      <Card sx={{ marginTop: 1, marginBottom: 2 }}>
        <Box p={2}>
          <TextField
            disabled
            error={Boolean(formik.touched.rackId && formik.errors.rackId)}
            fullWidth
            helperText={formik.touched.rackId && formik.errors.rackId}
            label="Rack ID"
            margin="normal"
            name="rackId"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.rackId || ''}
            variant="outlined"
            size="small"
          />
          <Box display="flex" justifyContent="space-between">
            <TextField
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Name"
              margin="normal"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name || ''}
              variant="outlined"
              size="small"
              sx={{ width: '68%' }}
            />
            <TextField
              error={Boolean(
                formik.touched.volumetricSpace && formik.errors.volumetricSpace
              )}
              fullWidth
              helperText={
                formik.touched.volumetricSpace && formik.errors.volumetricSpace
              }
              label="Volumetric Space"
              margin="normal"
              name="volumetricSpace"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.volumetricSpace || ''}
              variant="outlined"
              size="small"
              sx={{ width: '15%' }}
            />

            <TextField
              disabled
              fullWidth
              label="Occupied"
              margin="normal"
              name="currentCapacity"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.currentCapacity || '0'}
              variant="outlined"
              size="small"
              sx={{ width: '15%' }}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <TextField
              disabled
              fullWidth
              label="Remaining Volumetric Space"
              margin="normal"
              name="remainingCapacity"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={
                formik.values.volumetricSpace - formik.values.currentCapacity ||
                '0'
              }
              variant="outlined"
              size="small"
              sx={{ width: '15%' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <KitchenIcon sx={{ color: perc2color(bin) }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Typography variant="body1" color="red">
            {error}
          </Typography>
        </Box>
      </Card>
    </form>
  );
};
