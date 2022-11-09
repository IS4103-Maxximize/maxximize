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
import DayJS from 'dayjs';

export const InvoiceDialog = (props) => {
  const { open, handleClose, organisation } = props;

  const [error, setError] = useState('');
  const [invoices, setInvoices] = useState([]);

  // Retrieve all invoices
  const retrieveAllInvoicesOfCustomer = async () => {
    if (organisation.membership) {
      const response = await fetch(
        `http://localhost:3000/api/memberships/stripe/invoices/customers/${organisation?.membership?.customerId}`
      );
      let result = [];

      if (response.status == 200 || response.status == 201) {
        result = await response.json();
      }

      setInvoices(result);
    }
  };

  // Retrieve membership details
  //   const retrieveMembership = async () => {
  //     const response = await fetch(
  //       `http://localhost:3000/api/memberships/orgId/${organisation.id}`
  //     );

  //     if (response.status == 200 || response.status == 201) {
  //       const result = await response.json();
  //       return result;
  //     } else {
  //       const result = await response.json();
  //       setError(result.message);
  //     }
  //   };

  useEffect(() => {
    if (organisation) {
      retrieveAllInvoicesOfCustomer();
    }
  }, [open]);

  // Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Close dialog
  const onClose = () => {
    handleClose();
    setError('');
  };

  // Columns for invoices datagrid
  const invoiceColumns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 3,
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.created : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
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
              Invoices
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
