import { Box, Container, Typography } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { OutletsList } from '../components/outlets/outlets-list';

const Outlets = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Addresses | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              m: -1,
            }}
          >
            <Typography sx={{ m: 1 }} variant="h4">
              Addresses
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <OutletsList />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Outlets;
