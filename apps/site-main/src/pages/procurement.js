import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Typography } from '@mui/material';
import { ModuleCard } from '../components/procurement/module-card';

const orderingModules = [
  //   {
  //     id: 1,
  //     media: '../assets/images/procurement/procurement-ordering.jpg',
  //     description1: 'Handle product requisitions',
  //     description2: 'Purchase orders and find suppliers',
  //     title: 'Product Requisition',
  //	href: 'productrequisition',
  //     access: ['manager', 'factoryworker'],
  //   },
  {
    id: 1,
    media: '../assets/images/procurement/procurement-sales-inquiry.jpg',
    description1: 'Raise Sales Inquiry',
    description2: 'Receive quotation replies from suppliers',
    title: 'Sales Inquiry',
    href: 'sales-inquiry',
    access: ['manager', 'factoryworker'],
  },
  {
    id: 2,
    media: '../assets/images/procurement/procurement-quotation.jpg',
    description1: 'Quotations from supplier',
    description2: 'Handle quotation records from supplier',
    title: 'Quotation',
    href: 'quotation',
    access: ['manager', 'factoryworker'],
  },
  //   {
  //     id: 3,
  //     media: '../assets/images/procurement/procurement-purchase-order.jpg',
  //     description1: 'Handle purchase orders',
  //     description2: 'Send purchase order to supplier',
  //     title: 'Purchase Order',
  //     href: 'purchaseorder',
  //     access: ['manager', 'factoryworker'],
  //   },
];

const receivingModules = [
  //   {
  //     id: 1,
  //     media: '../assets/images/procurement/procurement-good-receipt.jpg',
  //     description1: 'Handle Good Receipt',
  //     description2: 'For incoming supply',
  //     title: 'Good Receipt',
  //     href: 'goodreceipt',
  //     access: ['manager', 'factoryworker'],
  //   },
];

const analyticsModules = [
  {
    id: 1,
    media: '../assets/images/procurement/procurement-forecast.jpg',
    description1: 'Demand forecast for subsequent periods',
    description2: 'Compare forecast with actual demand',
    title: 'Forecast',
    href: 'forecast',
    access: ['manager'],
  },
];

const Procurement = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Helmet>
        <title>{`Procurement | ${user?.organisation?.name}`}</title>
      </Helmet>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 1 }}>
            {user.role === 'manager' || user.role === 'factoryworker' ? (
              <Typography sx={{ m: 1 }} variant="h4">
                Ordering
              </Typography>
            ) : (
              <></>
            )}
            <Grid container spacing={3} mt={1} mb={3}>
              {orderingModules
                .filter((module) => module.access.includes(user.role))
                .map((module) => (
                  <Grid item key={module.id} lg={4} md={6} xs={12}>
                    <ModuleCard module={module} />
                  </Grid>
                ))}
            </Grid>
            {(user.role === 'manager' || user.role === 'factoryworker') &&
            receivingModules.length > 0 ? (
              <Typography sx={{ m: 1 }} variant="h4">
                Receiving
              </Typography>
            ) : (
              <></>
            )}
            <Grid container spacing={3} mt={1} mb={3}>
              {receivingModules
                .filter((module) => module.access.includes(user.role))
                .map((module) => (
                  <Grid item key={module.id} lg={4} md={6} xs={12}>
                    <ModuleCard module={module} />
                  </Grid>
                ))}
            </Grid>
            {user.role === 'manager' ? (
              <Typography sx={{ m: 1 }} variant="h4">
                Analytics
              </Typography>
            ) : (
              <></>
            )}
            <Grid container spacing={3} mt={1}>
              {analyticsModules
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

export default Procurement;
