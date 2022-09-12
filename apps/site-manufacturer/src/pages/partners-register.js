import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const options = [
  "supplier",
  "retailer",
]

const Partners_Register = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      organisationName: '',
      email: '',
      phone_number: '',
      address: '',
      password: '',
      policy: false
    },
    validationSchema: Yup.object({
      organisation: Yup
        .string(),
      organisationName: Yup
        .string()
        .max(255)
        .required(
          'Organisation Name is required'
        ),
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required'),
      phone_number: Yup
        .string()
        .max(255)
        .required(
          'Phone number is required'),
      address: Yup
        .string()
        .max(255)
        .required(
          'Address is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required'),
      policy: Yup
        .boolean()
        .oneOf(
          [true],
          'This field must be checked'
        )
    }),
    onSubmit: () => {
      router.push('/');
    }
  });

  return (
    <>
      <Head>
        <title>
          Register Business Partners | Material Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/business-partner-management"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Business Partner Management
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Create a new account
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Use your email to create a new account
              </Typography>
            </Box>

            <Box sx={{ mb: 3}}>
            <Typography>Select Organisation Type :</Typography>
              <RadioGroup
                error={Boolean(formik.touched.organisation && formik.errors.organisation)}
                fullWidth
                label="Organisation Type"
                margin="normal"
                name="organisation"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.organisation}
                row
              >
                {options.map(option => (
                  <FormControlLabel 
                    key={option} 
                    value={option} 
                    control={<Radio/>} 
                    label={option}
                  />
                ))}
              </RadioGroup>
              <TextField
                error={Boolean(formik.touched.organisationName && formik.errors.organisationName)}
                fullWidth
                helperText={formik.touched.organisationName && formik.errors.organisationName}
                label="Organisation Name"
                margin="normal"
                name="organisationName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.organisationName}
                variant="outlined"
              />
            </Box>
            
            <TextField
              error={Boolean(formik.touched.phone_number && formik.errors.phone_number)}
              fullWidth
              helperText={formik.touched.phone_number && formik.errors.phone_number}
              label="phone number"
              margin="normal"
              phone_number="phone number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone_number}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.address && formik.errors.address)}
              fullWidth
              helperText={formik.touched.address && formik.errors.address}
              label="address"
              margin="normal"
              address="address"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address}
              variant="outlined"
            />
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
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: -1
              }}
            >
              <Checkbox
                checked={formik.values.policy}
                name="policy"
                onChange={formik.handleChange}
              />
            </Box>
            {Boolean(formik.touched.policy && formik.errors.policy) && (
              <FormHelperText error>
                {formik.errors.policy}
              </FormHelperText>
            )}
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign Up Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Existing business partner?
              {' '}
              <NextLink
                href="/partners-login"
                passHref
              >
                <Link
                  variant="subtitle2"
                  underline="hover"
                >
                  Sign In
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
      </>
  );
};

export default Partners_Register;