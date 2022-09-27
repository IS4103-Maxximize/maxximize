import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import RelationsTabs from '../components/businessRelations/RelationsTabs';

function BusinessRelations() {
  const [orgId, setOrgId] = useState();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const userOrgId = JSON.parse(localStorage.getItem('user')).organisation.id;
    setOrgId(userOrgId);
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Business Relations | ${user?.organisation?.name}`}</title>
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
              Business Relations
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <RelationsTabs orgId={orgId} />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default BusinessRelations;
