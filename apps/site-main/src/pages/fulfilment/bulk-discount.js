import { Box, Container, Typography } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BulkDiscountList } from '../../components/fulfilment/bulk-discount/bulk-discount-list';

const BulkDiscount = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Bulk Discount | ${user?.organisation?.name}`}</title>
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
              Bulk Discount
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <BulkDiscountList />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BulkDiscount;
