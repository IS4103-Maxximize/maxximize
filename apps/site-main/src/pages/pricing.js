import { Box, Container, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { apiHost } from '../helpers/constants';

export const PricingPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const checkMembership = async () => {
    const updatedUser = await fetch(
      `${apiHost}/users/finduser/${user.id}`
    ).then((res) => res.json());
    // If Organisation has ACTIVE membership, go to dashboard
    if (
      updatedUser.organisation.membership ||
      updatedUser.organisation.membership?.status === 'active'
    ) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (updatedUser.organisation.membership !== null) {
        navigate('/');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkMembership();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Pricing`}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '85vh',
        }}
      >
        {loading && <Skeleton />}
        {!loading && (
          <Container maxWidth="sm">
            <stripe-pricing-table
              customer-email={user.organisation.contact.email}
              pricing-table-id="prctbl_1LwLCPHs54DYkQ2IqyQDKICr"
              publishable-key="pk_test_51LwL0XHs54DYkQ2ILjRaKrnU3FXkovbczOh1dSQpw3JaKgtyfnv7UbWfurXKql4PpugECTEClDXrDiUGTfFl1Lju00QtpgjMkp"
            ></stripe-pricing-table>
          </Container>
        )}
      </Box>
    </>
  );
};
