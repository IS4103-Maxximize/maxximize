import Head from 'next/head';
import { Box, Container, Grid, Pagination, Typography } from '@mui/material';
import { DashboardLayout } from '../../../components/dashboard-layout';
import { useRouter } from 'next/router';

const ProcurementReceiving = () => {
  const router = useRouter();
  const { organisation } = router.query;

  return (
    <>
      <Head>
        <title>
          {organisation
            ? `Procurement Receiving | ${organisation.toUpperCase()}`
            : 'Loading...'}
        </title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Typography sx={{ m: 1 }} variant="h4">
            Receiving
          </Typography>
          <Box sx={{ mt: 3 }}></Box>
        </Container>
      </Box>
    </>
  );
};

ProcurementReceiving.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ProcurementReceiving;
