import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@mui/material';
import { ModuleCard } from '../components/procurement/module-card';

const inventoryModules = [
  {
    id: 1,
    media: '../assets/images/inventory/inventory-warehouse.jpg',
    description1: 'Warehouse Management',
    description2: 'Overview of warehouses',
    title: 'Warehouse',
    href: 'warehouse',
    access: ['manager', 'factoryworker', 'superadmin'],
  },
  {
    id: 2,
    media: '../assets/images/inventory/inventory-bin.jpg',
    description1: 'Bin Management',
    description2: 'Overview of bins',
    title: 'Bin',
    href: 'bin',
    access: ['manager', 'factoryworker', 'superadmin'],
  },
];

const Inventory = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Inventory | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 1 }}>
            {user.role === 'manager' ||
            user.role === 'factoryworker' ||
            user.role === 'superadmin' ? (
              <Typography sx={{ m: 1 }} variant="h4">
                Inventory
              </Typography>
            ) : (
              <></>
            )}
            <Grid container spacing={3} mt={1} mb={3}>
              {inventoryModules
                .filter((module) => module.access.includes(user.role))
                .map((module) => (
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

export default Inventory;
