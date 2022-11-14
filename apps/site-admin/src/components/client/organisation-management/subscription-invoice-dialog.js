import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

export const SubscriptionInvoiceDialog = (props) => {
  const { open, handleClose, subscription, invoices } = props;

  const [error, setError] = useState('');

  //   useEffect(() => {
  //     if (open && subscription) {
  //       retrieveAllInvoiceOfSubscriptions();
  //     }
  //   }, [open]);

  // Close dialog
  const onClose = () => {
    handleClose();
    setError('');
    // setInvoices([]);
  };

  // Columns for subscription datagrid
  const invoiceColumns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.created : '';
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 4,
      valueGetter: (params) => {
        return params.row ? params.row.total : '';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.status : '';
      },
    },
  ];

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar color="success" sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Subscription Invoices
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box display="flex" justifyContent={'flex-end'}>
            <Typography variant="caption" color="red">
              {error}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="h6">Invoices</Typography>

            <DataGrid
              autoHeight
              rows={invoices}
              columns={invoiceColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // onSelectionModelChange={(ids) => setSelectedRows(ids)}
              // processRowUpdate={handleRowUpdate}
              disableSelectionOnClick
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
