import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Link, Typography } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>404</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography align="center" color="textPrimary" variant="h1">
              404: The page you are looking for isn’t here
            </Typography>
            <Typography align="center" color="textPrimary" variant="subtitle2">
              You either tried some shady route or you came here by mistake.
              Whichever it is, try using the navigation
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <img
                alt="Under development"
                src="/assets/images/undraw_page_not_found_su7k.svg"
                style={{
                  marginTop: 50,
                  display: 'inline-block',
                  maxWidth: '100%',
                  width: 560,
                }}
              />
            </Box>
            {/* -1 in react-router-v6 is navigate back 1 page, if doesn't exist navigate to home */}
            <Link component={RouterLink} underline="none" to={-1 || '/'}>
              <Button
                component="a"
                startIcon={<ArrowBackIcon fontSize="small" />}
                sx={{ mt: 3 }}
                variant="contained"
              >
                Back
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default NotFound;
