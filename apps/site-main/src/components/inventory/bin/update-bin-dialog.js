import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

export const UpdateBinDialog = ({
  bin,
  updateBin,
  openUpdateDialog,
  setOpenUpdateDialog,
  handleAlertOpen,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //Error handling
  const [error, setError] = useState('');

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpenUpdateDialog(false);
  };

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
        capacity: formik.values.capacity,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      handleAlertOpen(`Updated Bin ${result.id} successfully`);
      setError('');
      updateBin(result);
      handleDialogClose();
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      warehouseId: bin?.warehouse.id,
      name: bin?.name,
      capacity: bin?.capacity,
    },
    validationSchema: Yup.object({
      //   warehouseId: Yup.string()
      //     .min(1, 'Warehouse ID must be at least be 1 character long')
      //     .max(50, 'Warehouse ID can at most be 50 characters long')
      //     .required('Warehouse ID is required'),
      name: Yup.string()
        .min(1, 'Name must be at least be 1 character long')
        .max(50, 'Name can at most be 50 characters long')
        .required('Name is required'),
      capacity: Yup.number().required('Capacity is required'),
    }),
    onSubmit: handleOnSubmit,
  });

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 2,
      width: 300,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      width: 120,
      editable: true,
    },
  ];

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openUpdateDialog}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{'Update Bin'}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            disabled
            error={Boolean(
              formik.touched.warehouseId && formik.errors.warehouseId
            )}
            fullWidth
            helperText={formik.touched.warehouseId && formik.errors.warehouseId}
            label="Warehouse ID"
            margin="normal"
            name="warehouseId"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.warehouseId}
            variant="outlined"
            size="small"
          />
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
            error={Boolean(formik.touched.capacity && formik.errors.capacity)}
            fullWidth
            helperText={formik.touched.capacity && formik.errors.capacity}
            label="Capacity"
            margin="normal"
            name="capacity"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.capacity}
            variant="outlined"
            multiline
            minRows={4}
          />
          <Typography variant="body1" color="red">
            {error}
          </Typography>

          <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
            Batch Line Items (View only)
          </Typography>
          <Box sx={{ minWidth: 500 }}>
            <DataGrid
              autoHeight
              minHeight="500"
              rows={bin?.batchLineItems}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              allowSorting={true}
              components={{
                Toolbar: GridToolbar,
              }}
              disableSelectionOnClick
            />
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
              Update Bin
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
