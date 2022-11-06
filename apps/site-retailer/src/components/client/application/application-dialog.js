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
import { ApplicationConfirmDialog } from './application-confirm-dialog';
import { Document, Page } from 'react-pdf';
import LoadingButton from '@mui/lab/LoadingButton';

export const ApplicationDialog = (props) => {
  const {
    open,
    handleClose,
    application,
    handleAlertOpen,
    retrieveAllApplications,
  } = props;

  // Submission
  // Loading buttons
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Documents
  const [applicationDocuments, setApplicationDocuments] = useState([]);

  useEffect(() => {
    retrieveApplicationDocuments();
  }, [open]);

  const retrieveApplicationDocuments = async () => {
    if (application) {
      const response = await fetch(
        `http://localhost:3000/api/files/appId/${application?.id}`
      );
      let result = [];
      if (response.status == 200 || response.status == 201) {
        result = await response.json();
      }
      setApplicationDocuments(result);
    }
  };

  // PDF Viewer
  //   const [numPages, setNumPages] = useState(null);

  //   const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
  //     setNumPages(nextNumPages);
  //   };

  // Download supporting document
  const handleDownload = async (file) => {
    const response = await fetch(
      `http://localhost:3000/api/files/download/${file.id}`
    );
    if (response.status == 200 || response.status == 201) {
      console.log(response);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${file.name}`);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    }
  };

  // Accept the application
  const handleAccept = async () => {
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/api/applications/${application.id}`,
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

      retrieveAllApplications();

      setError('');
      handleAlertOpen(
        `Onboarded client organisation ${result.id} successfully`
      );
      formik.resetForm();
      handleClose();
      setLoading(false);
    } else {
      const result = await response.json();
      setError(result.message);
      setLoading(false);
    }
  };

  // Reject the application
  const handleReject = async () => {
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/api/applications/${application.id}`,
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

      retrieveAllApplications();

      setError('');
      handleAlertOpen(`Rejected Application ${result.id}`);
      formik.resetForm();
      handleClose();
      setLoading(false);
    } else {
      const result = await response.json();
      setError(result.message);
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      orgName: application ? application.organisationName : '',
      uen: application ? application.uen : '',
      orgEmail: application ? application.orgEmail : '',
      orgAddress: application ? application.orgAddress : '',
      orgPostalCode: application ? application.orgPostalCode : '',
      orgPhoneNumber: application ? application.orgPhoneNumber : '',
      firstName: application ? application.applicantFirstName : '',
      lastName: application ? application.applicantLastName : '',
      address: application ? application.applicantAddress : '',
      postalCode: application ? application.applicantPostalCode : '',
      email: application ? application.applicantEmail : '',
      phoneNumber: application ? application.applicantPhoneNumber : '',
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
      <ApplicationConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={'Reject Application'}
        dialogContent={'Are you sure you want to reject the application?'}
        dialogAction={handleReject}
      />
      <form onSubmit={formik.handleSubmit}>
        <Dialog
          fullScreen
          open={open}
          onClose={onClose}
          aria-labelledby="responsive-dialog-title"
        >
          <AppBar color="primary" sx={{ position: 'relative' }}>
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
                Application Details
              </Typography>
              {loading ? (
                <LoadingButton
                  fullWidth
                  loading={loading}
                  loadingPosition="start"
                  size="medium"
                  variant="outlined"
                >
                  Loading
                </LoadingButton>
              ) : (
                <>
                  <Button
                    disabled={!formik.isValid || formik.isSubmitting}
                    autoFocus
                    color="error"
                    size="medium"
                    onClick={handleConfirmDialogOpen}
                    variant="contained"
                    sx={{ marginRight: 2 }}
                  >
                    Reject
                  </Button>
                  <Button
                    disabled={!formik.isValid || formik.isSubmitting}
                    autoFocus
                    color="inherit"
                    size="medium"
                    onClick={handleAccept}
                    variant="outlined"
                  >
                    Accept Application
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Box display="flex">
              <Box mr={2} flex={1}>
                <Typography variant="h6" component="div">
                  Client Organisation
                </Typography>
                <TextField
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.orgName && formik.errors.orgName
                  )}
                  fullWidth
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
                  disabled
                  color="primary"
                  error={Boolean(formik.touched.uen && formik.errors.uen)}
                  fullWidth
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
                <TextField
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.orgAddress && formik.errors.orgAddress
                  )}
                  fullWidth
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
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.orgPostalCode && formik.errors.orgPostalCode
                  )}
                  fullWidth
                  helperText={
                    formik.touched.orgPostalCode && formik.errors.orgPostalCode
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
                <TextField
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.orgEmail && formik.errors.orgEmail
                  )}
                  fullWidth
                  helperText={formik.touched.orgEmail && formik.errors.orgEmail}
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
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.orgPhoneNumber &&
                      formik.errors.orgPhoneNumber
                  )}
                  fullWidth
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
                {applicationDocuments.map((file) => (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownload(file)}
                    sx={{ marginTop: 2, marginRight: 2 }}
                  >
                    Download Document {file.id}
                  </Button>
                ))}
                {/* {applicationDocuments.map((file) => (
                  <Document
                    file={() => handleDisplayPDF(file)}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                  </Document>
                ))} */}
              </Box>

              <Box ml={2} flex={1}>
                <Typography sx={{ flex: 1 }} variant="h6" component="div">
                  First Admin Account
                </Typography>
                <TextField
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.firstName && formik.errors.firstName
                  )}
                  fullWidth
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  label="First Name"
                  margin="normal"
                  name="firstName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.lastName && formik.errors.lastName
                  )}
                  fullWidth
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  label="Last Name"
                  margin="normal"
                  name="lastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  variant="outlined"
                  size="small"
                />

                <TextField
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.address && formik.errors.address
                  )}
                  fullWidth
                  helperText={formik.touched.address && formik.errors.address}
                  label="Address"
                  margin="normal"
                  name="address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.postalCode && formik.errors.postalCode
                  )}
                  fullWidth
                  helperText={
                    formik.touched.postalCode && formik.errors.postalCode
                  }
                  label="Postal Code"
                  margin="normal"
                  name="postalCode"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.postalCode}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  disabled
                  color="primary"
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  margin="normal"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  disabled
                  color="primary"
                  error={Boolean(
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  )}
                  fullWidth
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                  label="Phone Number"
                  margin="normal"
                  name="phoneNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent={'center'}>
              <Typography variant="caption" color="red">
                {error}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
};
