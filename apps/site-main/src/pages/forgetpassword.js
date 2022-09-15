import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

async function loginUser(credentials) {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (res.status === 201 || res.status === 200) {
    const result = await res.json();
    return result;
  } else {
    return null;
  }
}

const ForgetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentOrgId = location.pathname.split('/')[2];
  const [organisation, setOrganisation] = useState({});

  useEffect(() => {
    const retrieveOrganisation = async () => {
      const res = await fetch(
        `http://localhost:3000/api/organisations/${currentOrgId}`
      );
      const result = await res.json();
      if (result) {
        setOrganisation(result);
      } else {
        navigate('/organisationSelection', { replace: true });
      }
    };
    retrieveOrganisation();
  }, []);
  const from = location.state?.from?.pathname || '/';
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
    onSubmit: {},
  });

  return (
    <>
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
                Forget Password
              </Typography>
            </Box>
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
            <Typography color="red" variant="subtitle2">
              {formik.values.authenticationError}
            </Typography>
            <Typography color="textPrimary" variant="subtitle2">
              Having troubles logging in? Call us at 67467891 or Email us at
              maxximize@gmail.com
            </Typography>
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={!(formik.dirty && formik.isValid)}
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

export default ForgetPassword;
