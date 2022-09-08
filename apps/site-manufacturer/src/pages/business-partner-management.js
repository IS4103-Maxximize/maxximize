import Head from 'next/head';
import * as React from 'react';
import { Button, Tab, Box, Container, Typography } from '@mui/material';
import { PartnersListResults } from '../components/business-partners/partners-list-results';
import { DashboardLayout } from '../components/dashboard-layout';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const BusinessPartnerManagement = ({ props }) => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Business Partners Management</title>
      </Head>

      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} 
        aria-label="Business partners tabs">
          <Tab label="Supplier" 
          value="1"/>
          <Tab label="Retailer" 
          value="2" />
        </TabList>
        </Box>
          <TabPanel value="1">Supplier</TabPanel>
          <TabPanel value="2">Retailer</TabPanel>
      </TabContext>

      <Button href="partners-onboard"
      variant="contained">
        Add Business Partner
      </Button>
      </Box>
          
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >

        <Container maxWidth={false}>
          <Typography sx={{ m: 1 }} 
          variant="h4">
            Results
          </Typography>
          <Box sx={{ mt: 3 }}>
           <PartnersListResults />
          </Box>
        </Container>  
      </Box>
    </>
  );
};


BusinessPartnerManagement.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default BusinessPartnerManagement;