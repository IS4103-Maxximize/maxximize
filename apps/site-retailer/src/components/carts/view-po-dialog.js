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
  InputAdornment,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

export const ViewPODialog = ({
  purchaseOrder,
  openViewPODialog,
  setOpenViewPODialog,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState('');

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpenViewPODialog(false);
  };

  const columns = [
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.skuCode : '';
      },
    },
    {
      field: 'name',
      headerName: 'Final Good Name',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.name : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Final Good Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood.unit : '';
      },
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.finalGood?.unitPrice : '';
      },
      valueFormatter: (params) => {
        return params.value ? `$ ${params.value}` : '';
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        return params.row
          ? `$ ${params.row.finalGood?.unitPrice * params.row.quantity}`
          : '';
      },
    },
  ];

  const rows = purchaseOrder?.poLineItemDtos;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openViewPODialog}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Purchase Order Details'}
      </DialogTitle>
      <DialogContent>
        <TextField
          sx={{ width: '500px' }}
          label="Total Price"
          margin="normal"
          name="totalPrice"
          type="number"
          value={purchaseOrder?.totalPrice.toFixed(2)}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          disabled
        />
        <Typography variant="h6">Purchase Order Line Items</Typography>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.finalGood.id}
        />
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};
