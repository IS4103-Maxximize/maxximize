import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { WorkerListResults } from '../components/worker-management/worker-list-results';
import { DashboardLayout } from '../components/dashboard-layout';

const WorkerManagement = ({ props }) => {
  return (
    <>
      <Head>
        <title>Worker Management</title>
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
            Workers
          </Typography>
          <Box sx={{ mt: 3 }}>
            <WorkerListResults />
          </Box>
        </Container>
      </Box>
    </>
  );
};

WorkerManagement.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default WorkerManagement;
