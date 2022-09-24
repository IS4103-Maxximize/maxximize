import { Box, Container, Typography } from '@mui/material';
import { WorkerListResults } from '../components/worker-management/worker-list-results';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const WorkerManagement = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Workers | ${user?.organisation?.name}`}</title>
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
              Worker
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <WorkerListResults />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default WorkerManagement;
