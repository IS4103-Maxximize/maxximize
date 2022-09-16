import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import { NotificationAlert } from '../components/notification-alert';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const organisation = user.organisation;

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

  const handleResetPassword = () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      password: formik.values.confirmPassword,
    });

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
    };

    let timer;

    fetch(
      `http://localhost:3000/api/users/changePassword/${user.id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then(() => {
        handleAlertOpen(
          'Password changed successfully! Redirecting...',
          'success'
        );
        user.passwordChanged = true;
        localStorage.setItem('user', JSON.stringify(user));
      })
      .then(() => {
        timer = setTimeout(() => navigate('/', { replace: true }), 3000);
      })

      .catch((error) =>
        handleAlertOpen(`An error was encountered: ${error}`, 'error')
      );

    clearTimeout(timer);

    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      authenticationError: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().max(255).required('New Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .max(255)
        .required('Confirm Password is required'),
    }),
    onSubmit: handleResetPassword,
  });

  return (
    <>
      <Helmet>
        <title>{`Reset Password | ${organisation?.name}`}</title>
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
              <Typography color="textPrimary" variant="h4">
                {organisation?.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Reset Password
              </Typography>
            </Box>
            <Typography color="textPrimary" variant="subtitle2">
              Resetting password is required for new users
            </Typography>
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="New Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )}
              fullWidth
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              label="Confirm Password"
              margin="normal"
              name="confirmPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.confirmPassword}
              variant="outlined"
            />
            <Typography color="red" variant="subtitle2">
              {formik.values.authenticationError}
            </Typography>

            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
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

export default ResetPassword;
