import { Box, Container, Typography } from '@mui/material';

const ProcurementOrdering = () => {
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
            Ordering
          </Typography>
          <Box sx={{ mt: 3 }}></Box>
        </Container>
      </Box>
    </>
  );
};

export default ProcurementOrdering;
