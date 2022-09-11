import Head from 'next/head';
import { Box, Container, Grid, Pagination, Typography } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard-layout';
import { ModuleCard } from '../../components/procurement/module-card';
import { useRouter } from 'next/router';

const modules = [
  {
    id: 1,
    media: '/static/images/procurement/procurement-ordering.jpg',
    description1: 'Handle product requisitions',
    description2: 'Purchase orders and find suppliers',
    title: 'Ordering',
  },
  {
    id: 2,
    media: '/static/images/procurement/procurement-receiving.jpg',
    description1: 'Accept/Reject incoming supply batch',
    description2: 'Create a stock transfer order',
    title: 'Receiving',
  },
  {
    id: 3,
    media: '/static/images/procurement/procurement-forecast.jpg',
    description1: 'Demand forecast for subsequent periods',
    description2: 'Compare forecast with actual demand',
    title: 'Forecast',
  },
];

const Procurement = () => {
  const router = useRouter();
  const { organisation } = router.query;

  return (
    <>
      <Head>
        <title>
          {organisation
            ? `Procurement | ${organisation.toUpperCase()}`
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
            Procurement
          </Typography>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {modules.map((module) => (
                <Grid item key={module.id} lg={4} md={6} xs={12}>
                  <ModuleCard module={module} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Procurement.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Procurement;
