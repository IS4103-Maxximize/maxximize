import { Box, Container, Typography } from '@mui/material';
// import { GoodReceiptList } from '../../components/procurement/receiving/good-receipt-list';

const ProcurementGoodReceipt = () => {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Typography sx={{ m: 1 }} variant="h4">
            Good Receipt
          </Typography>
          <Box sx={{ mt: 2 }}>{/* <GoodReceiptList /> */}</Box>
        </Container>
      </Box>
    </>
  );
};

export default ProcurementGoodReceipt;
