import { Box, Container, Typography } from '@mui/material';
import { WorkerListResults } from '../components/worker-management/worker-list-results';

const WorkerManagement = () => {
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

export default WorkerManagement;
