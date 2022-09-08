import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { MachineListToolbar } from '../components/machine/machine-list-toolbar';
import { MachineListResults } from '../components/machine/machine-list-results';
import { DashboardLayout } from '../components/dashboard-layout';

const Machines = () => (
  <>
    <Head>
      <title>
        Machine Management
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <MachineListToolbar />
          <Typography sx={{ m: 1 }} 
          variant="h4">
            Machines
          </Typography>
          <Box sx={{ mt: 3 }}>
            <MachineListResults />
          </Box>
        </Container>
      </Box>
    </>
  );

Machines.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Machines;
