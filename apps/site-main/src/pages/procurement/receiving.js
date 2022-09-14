import { Box, Container, Typography } from '@mui/material';

const ProcurementReceiving = () => {
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
            Receiving
          </Typography>
          <Box sx={{ mt: 3 }}></Box>
        </Container>
      </Box>
    </>
  );
};

export default ProcurementReceiving;
