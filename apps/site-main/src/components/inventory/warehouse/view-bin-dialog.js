import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  Box,
  Typography,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DayJS from 'dayjs';

export const ViewBinDialog = ({
  bin,
  batchLineItems,
  openViewDialog,
  setOpenViewDialog,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpenViewDialog(false);
  };

  useEffect(() => {
    console.log(batchLineItems);
  }, [openViewDialog]);

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 3,
      width: 300,
      valueGetter: (params) => {
        if (params.row.product.name) {
          return params.row.product.name;
        } else {
          return '';
        }
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      width: 120,
      editable: false,
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      flex: 2,
      width: 120,
      editable: false,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
  ];

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openViewDialog}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{'View Bin'}</DialogTitle>
      <DialogContent>
        <Box>
          <Typography sx={{ marginBottom: 1 }}>
            <b>Bin Name:</b> {bin?.name}
          </Typography>
          <Typography sx={{ marginBottom: 1 }}>
            <b>Capacity:</b> {bin?.capacity}
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            <b>Current Capacity:</b> {bin?.currentCapacity}
          </Typography>
        </Box>
        <Box sx={{ minWidth: 500 }}>
          <DataGrid
            autoHeight
            minHeight="500"
            rows={batchLineItems}
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};
