import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { factory_machines } from '../__mocks__/factory-machines';
import { MachineListToolbar } from '../components/machine/machine-list-toolbar';
import { Machine } from '../components/machine/machine';
import { DashboardLayout } from '../components/dashboard-layout';

const Machines = () => (
  <>
    <Head>
      <title>
        Factory Machines | Material Kit
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
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {factory_machines.map((factory_machine) => (
              <Grid
                item
                key={factory_machines.id}
                lg={4}
                md={6}
                xs={12}
              >
                <Machine factory_machine={factory_machine} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
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
