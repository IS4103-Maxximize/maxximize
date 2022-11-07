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

export const SubscriptionDialog = (props) => {
  const { open, handleClose, organisation } = props;

  const [error, setError] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);

  // Retrieve all subscriptions invoices
  //   const retrieveAllInvoiceOfSubscriptions = async () => {
  //     const response = await fetch(
  //       `http://localhost:3000/api/memberships/stripe/invoices/subscriptions/${organisation?.membership?.subscriptionId}`
  //     );
  //     let result = [];

  //     if (response.status == 200 || response.status == 201) {
  //       result = await response.json();
  //     }

  //     setSubscriptions(result);
  //   };

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
      console.log(organisation);
      //   retrieveAllInvoiceOfSubscriptions();
    }
  }, [open]);

  useEffect(() => console.log(subscriptions), [subscriptions]);

  const formik = useFormik({
    initialValues: {
      orgName: organisation ? organisation.name : '',
      uen: organisation ? organisation.uen : '',
      orgEmail: organisation ? organisation.contact.email : '',
      orgAddress: organisation ? organisation.contact.address : '',
      orgPostalCode: organisation ? organisation.contact.postalCode : '',
      orgPhoneNumber: organisation ? organisation.contact.phoneNumber : '',
    },
    enableReinitialize: true,
  });

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

  // Columns for subscription datagrid
  //   const subscriptionColumns = [
  //     {
  //       field: 'id',
  //       headerName: 'ID',
  //       flex: 1,
  //     },
  //     {
  //       field: 'created',
  //       headerName: 'Created',
  //       flex: 2,
  //       valueGetter: (params) => {
  //         return params.row ? params.row.created : '';
  //       },
  //     },
  //     {
  //       field: 'total',
  //       headerName: 'Total',
  //       flex: 4,
  //       valueGetter: (params) => {
  //         return params.row ? params.row.total : '';
  //       },
  //     },
  //     {
  //       field: 'status',
  //       headerName: 'Status',
  //       flex: 2,
  //       valueGetter: (params) => {
  //         return params.row ? params.row.status : '';
  //       },
  //     },
  //   ];

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
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
                Subscriptions
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
              <Typography variant="h6">Subscriptions</Typography>
              {/* <DataGrid
                autoHeight
                rows={subscriptions}
                columns={subscriptionColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                // onSelectionModelChange={(ids) => setSelectedRows(ids)}
                // processRowUpdate={handleRowUpdate}
                disableSelectionOnClick
              /> */}
            </Box>
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
};
