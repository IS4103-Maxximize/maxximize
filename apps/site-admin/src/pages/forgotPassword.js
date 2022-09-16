import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import { NotificationAlert } from '../components/notification-alert';

const ForgotPassword = () => {
  const location = useLocation();
  const currentOrgId = localStorage.getItem('organisationId');
  const [organisation, setOrganisation] = useState({});

  useEffect(() => {
    localStorage.setItem('organisationId', '1');
  }, []);

  // NotificationAlert helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState();
  const [alertSeverity, setAlertSeverity] = useState('success');
  const handleAlertOpen = (text, severity) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertText(null);
    setAlertSeverity('success');
  };

  const handleForgotPassword = () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      organisationId: currentOrgId,
      email: formik.values.email,
    });

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
    };

    fetch(`http://localhost:3000/api/users/forgotPassword`, requestOptions)
      .then((response) => response.text())
      .then(() => handleAlertOpen('Email sent successfully!', 'success'))
      .catch((error) =>
        handleAlertOpen(`An error was encountered: ${error}`, 'error')
      );

    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email must be in a proper format [eg. user@email.com]')
        .max(255)
        .required('Email is required'),
    }),
    onSubmit: handleForgotPassword,
  });

  return (
    <>
      <Helmet>
        <title>{'Forgot Password | MaxxiMize'}</title>
      </Helmet>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '85vh',
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                MaxxiMize
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Forgot Password
              </Typography>
            </Box>
            <Typography color="textPrimary" variant="subtitle2">
              Enter the email for your account
            </Typography>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />

            <Box sx={{ py: 2 }}>
              <Button
                color="success"
                disabled={!formik.isValid || formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Confirm
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPassword;
