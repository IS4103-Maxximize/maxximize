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
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export const CreatePurchaseRequisitionDialog = ({
  open,
  handleClose,
  finalGoodId,
  firstFinalGoodQuantity,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState('');

  useEffect(() => {
    formik.setFieldValue('finalGoodQuantity', firstFinalGoodQuantity);
  }, [open]);

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const navigate = useNavigate();

  //Handle Formik submission
  const handleOnSubmit = async () => {
    let response;

    for (const rawMaterial of rows) {
      response = await fetch(
        `http://localhost:3000/api/purchase-requisitions`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expectedQuantity: rawMaterial.quantityRequired,
            organisationId: organisationId,
            rawMaterialId: rawMaterial.id,
            requestByType: 'forecast',
          }),
        }
      );
    }

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      setError('');
      onClose();
      navigate('/procurement/purchase-requisition');
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const [rawMaterials, setRawMaterials] = useState([]);

  // Retrieve list of required raw materials
  const retrieveRawMaterial = async () => {
    const response = await fetch(
      `http://localhost:3000/api/final-goods/required-raw-materials/${finalGoodId}/${formik.values.finalGoodQuantity}`
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      setRawMaterials(result);
    }
  };

  // Formik
  const formik = useFormik({
    initialValues: {
      finalGoodQuantity: 0,
    },
    validationSchema: Yup.object({
      finalGoodQuantity: Yup.number()
        .typeError('Quantity must be a whole number')
        .min(0, 'Quantity cannot be negative')
        .required('Quantity is required'),
    }),
    onSubmit: handleOnSubmit,
  });

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.name : '';
      },
    },
    {
      field: 'quantityRequired',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantityRequired : '';
      },
    },
  ];

  const rows = rawMaterials;
  useEffect(() => console.log(rows), [rows]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Create Purchase Requisitions'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box display="flex" justifyContent="space-evenly">
            <TextField
              error={Boolean(
                formik.touched.finalGoodQuantity &&
                  formik.errors.finalGoodQuantity
              )}
              fullWidth
              helperText={
                formik.touched.finalGoodQuantity &&
                formik.errors.finalGoodQuantity
              }
              label="Final Good Quantity"
              margin="normal"
              name="finalGoodQuantity"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.finalGoodQuantity}
              variant="outlined"
              size="small"
            />
            <Box ml={1}>
              <Button onClick={retrieveRawMaterial} variant="contained">
                Retrieve
              </Button>
            </Box>
          </Box>

          <DataGrid
            autoHeight
            getRowId={(row) => row.rawMaterial.id}
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
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
            <Button autoFocus onClick={onClose}>
              Back
            </Button>
            <Button
              color="primary"
              disabled={formik.isSubmitting || rawMaterials.length === 0}
              size="large"
              type="submit"
              variant="contained"
            >
              Create Purchase Requisitions
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
