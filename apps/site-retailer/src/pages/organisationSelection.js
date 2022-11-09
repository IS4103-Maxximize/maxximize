import { Box, Button, Container, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function OrganisationSelection() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      organisation: '',
      authenticationError: '',
    },
    validationSchema: Yup.object({
      organisation: Yup.string()
        .max(255)
        .required('Organisation Code is required'),
    }),
    onSubmit: async ({ organisation }) => {
      //retrieve data based on the provided organisation code

      const response = await fetch(
        `http://localhost:3000/api/organisations/${organisation}`
      );
      if (response.status === 200 || response.status === 201) {
        //if organisation is found
        const result = await response.json();

        if (!result.isActive) {
          formik.values.authenticationError = 'Organisation is suspended';
        } else {
          //navigate to the login page with id of the organisation
          navigate(`/login/${result.id}`);
        }
      } else {
        formik.values.authenticationError = 'Organisation Code is invalid';
      }
    },
  });
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{'Organisation Selection'}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                MaxxiMize
              </Typography>
            </Box>
            <TextField
              error={Boolean(
                formik.touched.organisation && formik.errors.organisation
              )}
              fullWidth
              helperText={
                formik.touched.organisation && formik.errors.organisation
              }
              label="Organisation Code"
              margin="normal"
              name="organisation"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.organisation}
              variant="outlined"
            />
            <Typography color="red" variant="subtitle2">
              {formik.values.authenticationError}
            </Typography>
            <Typography color="textPrimary" variant="subtitle2">
              Forgot the organisation code? Call us at 67467891 or email us at
              maxximize@gmail.com
            </Typography>
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Enter Portal
              </Button>
              <Box display="flex" justifyContent="center" m={5}>
                <Link to="/register-organisation" underline="none">
                  Don't have an account? Register here
                </Link>
              </Box>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
}
