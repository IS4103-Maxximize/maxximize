import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import LoadingButton from '@mui/lab/LoadingButton';
import { OrganisationConfirmDialog } from './organisation-confirm-dialog';
import { DataGrid } from '@mui/x-data-grid';

export const OrganisationDetailsDialog = (props) => {
  const {
    open,
    handleClose,
    organisation,
    handleAlertOpen,
    retrieveAllOrganisations,
  } = props;

  // Submission
  // Loading buttons
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ban the organisation
  const handleBan = async () => {
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/api/organisations/ban/${organisation.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      retrieveAllOrganisations();

      setError('');
      handleAlertOpen(`Ban client organisation ${result.id} successfully`);
      formik.resetForm();
      handleClose();
      setLoading(false);
    } else {
      const result = await response.json();
      setError(result.message);
      setLoading(false);
    }
  };

  // Unban the organisation
  const handleUnban = async () => {
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/api/organisations/unban/${organisation.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      retrieveAllOrganisations();

      setError('');
      handleAlertOpen(`Unban client organisation ${result.id} succesfully`);
      formik.resetForm();
      handleClose();
      setLoading(false);
    } else {
      const result = await response.json();
      setError(result.message);
      setLoading(false);
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
    setLoading(false);
  };

  return (
    <>
      <OrganisationConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={'Ban Organisation'}
        dialogContent={'Are you sure you want to ban this organisation?'}
        dialogAction={handleBan}
      />
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
                disabled={loading}
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Organisation Details
              </Typography>
              {loading ? (
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  size="medium"
                  variant="outlined"
                >
                  Loading
                </LoadingButton>
              ) : organisation?.isActive ? (
                <Button
                  disabled={!formik.isValid || formik.isSubmitting}
                  autoFocus
                  color="error"
                  size="medium"
                  onClick={handleConfirmDialogOpen}
                  variant="contained"
                  sx={{ marginRight: 2 }}
                >
                  Ban
                </Button>
              ) : (
                <Button
                  disabled={!formik.isValid || formik.isSubmitting}
                  autoFocus
                  color="inherit"
                  size="medium"
                  onClick={handleUnban}
                  variant="outlined"
                >
                  Unban
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Box display="flex">
              <Box mr={2} flex={1}>
                <Box display="flex" justifyContent={'flex-end'}>
                  <Typography variant="caption" color="red">
                    {error}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <TextField
                    sx={{ width: '49.5%' }}
                    disabled
                    color="success"
                    error={Boolean(
                      formik.touched.orgName && formik.errors.orgName
                    )}
                    helperText={formik.touched.orgName && formik.errors.orgName}
                    label="Organisation Name"
                    margin="normal"
                    name="orgName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.orgName}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '49.5%' }}
                    disabled
                    color="success"
                    error={Boolean(formik.touched.uen && formik.errors.uen)}
                    helperText={formik.touched.uen && formik.errors.uen}
                    label="UEN"
                    margin="normal"
                    name="uen"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.uen}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <TextField
                    sx={{ width: '49.5%' }}
                    disabled
                    color="success"
                    error={Boolean(
                      formik.touched.orgAddress && formik.errors.orgAddress
                    )}
                    helperText={
                      formik.touched.orgAddress && formik.errors.orgAddress
                    }
                    label="Organisation Address"
                    margin="normal"
                    name="orgAddress"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.orgAddress}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '49.5%' }}
                    disabled
                    color="success"
                    error={Boolean(
                      formik.touched.orgPostalCode &&
                        formik.errors.orgPostalCode
                    )}
                    helperText={
                      formik.touched.orgPostalCode &&
                      formik.errors.orgPostalCode
                    }
                    label="Organisation Postal Code"
                    margin="normal"
                    name="orgPostalCode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.orgPostalCode}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <TextField
                    sx={{ width: '49.5%' }}
                    disabled
                    color="success"
                    error={Boolean(
                      formik.touched.orgEmail && formik.errors.orgEmail
                    )}
                    helperText={
                      formik.touched.orgEmail && formik.errors.orgEmail
                    }
                    label="Organisation Email"
                    margin="normal"
                    name="orgEmail"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="orgEmail"
                    value={formik.values.orgEmail}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    sx={{ width: '49.5%' }}
                    disabled
                    color="success"
                    error={Boolean(
                      formik.touched.orgPhoneNumber &&
                        formik.errors.orgPhoneNumber
                    )}
                    helperText={
                      formik.touched.orgPhoneNumber &&
                      formik.errors.orgPhoneNumber
                    }
                    label="Organisation Phone Number"
                    margin="normal"
                    name="orgPhoneNumber"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.orgPhoneNumber}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
};
