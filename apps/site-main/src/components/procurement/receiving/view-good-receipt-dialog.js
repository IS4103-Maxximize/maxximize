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

export const ViewGoodReceiptDialog = ({
  goodReceiptLineItems,
  openViewDialog,
  setOpenViewDialog,
  goodReceipt,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpenViewDialog(false);
  };

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 2,
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
  ];

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openViewDialog}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'View Goods Receipt'}
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography sx={{ marginBottom: 1 }}>
            <b>Purchase Order ID:</b> {goodReceipt?.purchaseOrder.id}
          </Typography>
          <Typography sx={{ marginBottom: 1 }}>
            <b>Recipient:</b> {goodReceipt?.recipientName}
          </Typography>
          <Typography sx={{ marginBottom: 1 }}>
            <b>Date Received: </b>
            {DayJS(goodReceipt?.createdDateTime).format('DD MMM YYYY hh:mm a')}
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            <b>Description:</b>{' '}
            {goodReceipt?.description ? goodReceipt.description : '-NIL-'}
          </Typography>
        </Box>
        <Box sx={{ minWidth: 500 }}>
          <DataGrid
            autoHeight
            minHeight="500"
            rows={goodReceipt?.goodsReceiptLineItems}
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
