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
import { Search as SearchIcon } from '../../icons/search';
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

const options = [
  "supplier",
  "b2b-sales",
]

const Partners_Onboard = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      organisationName: '',
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
    }),
    onSubmit: () => {
      router.push('/');
    }
  });

  return (
    <>
    <Head>
      <title>
        Onboard Business Partners | Material Kit
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
          href="/"
          passHref
        >
          <Button
            component="a"
            startIcon={<ArrowBackIcon fontSize="small" />}
          >
            Dashboard
          </Button>
        </NextLink>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              Onboard an existing account
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

            <Box sx={{ mt: 3 }}>
            <form>
                <TextField
                id="search-bar"
                className="text"
                onInput={(e) => {
                    setSearchQuery(e.target.value);
                }}
                label="Enter an organisation name"
                variant="outlined"
                placeholder="Search..."
                size="small"
                />
                <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "blue" }} />
                </IconButton>
            </form>
            </Box>
          
            <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Confirm to Link Business Partner 
            </Button>
          </Box>
          
          <Typography
            color="textSecondary"
            variant="body2"
          >
            New business partner?
            {' '}
            <NextLink
              href="/partners-register"
              passHref
            >
              <Link
                variant="subtitle2"
                underline="hover"
              >
                  Link Business Partner
              </Link>
            </NextLink>
          </Typography>
        </form>
      </Container>
    </Box>
  </>
  );
};
export default Partners_Onboard;