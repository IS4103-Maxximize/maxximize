import { Box, Container } from "@mui/material";
import { Helmet, HelmetProvider } from 'react-helmet-async';


export const PricingPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Select Pricing`}</title>
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
        <Container maxWidth="sm">
          <stripe-pricing-table 
            pricing-table-id="prctbl_1LwLCPHs54DYkQ2IqyQDKICr"
            publishable-key="pk_test_51LwL0XHs54DYkQ2ILjRaKrnU3FXkovbczOh1dSQpw3JaKgtyfnv7UbWfurXKql4PpugECTEClDXrDiUGTfFl1Lju00QtpgjMkp">
          </stripe-pricing-table>
        </Container>
      </Box>
    </>
  )
}
