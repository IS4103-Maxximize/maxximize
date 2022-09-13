import Head from 'next/head';
import * as React from 'react';
import { Tab, Box, Container } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard-layout';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { SearchBusinessPartner } from '../../components/business-partners.js/search-business-partner';
import { SuppliersList } from '../../components/business-partners.js/suppliers-list';
import { RetailersList } from '../../components/business-partners.js/retailers-list';

const BusinessPartnerManagement = ({ props }) => {  
const [value, setValue] = React.useState('1');
const [search, setSearch] = React.useState("");


const [rows] = React.useState("");

const handleChange = (event, newValue) => {
  setValue(newValue);
};

  return (
    <>
      <Head>
        <title>Business Partners Management | Material Kit</title>
      </Head>
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt:4,
        py: 4,
      }}
    >

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
          <TabPanel value="1">
          <Container maxWidth={false}>
          <Box sx={{ mt: 3 }}>
           <SuppliersList />
          </Box>
        </Container>
          </TabPanel>
          <TabPanel value="2">
          <Container maxWidth={false}>
          <Box sx={{ mt: 3 }}>
           <RetailersList />
          </Box>

        </Container>
          </TabPanel>
      </TabContext>
      </Box>
    </>
  );
};


BusinessPartnerManagement.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default BusinessPartnerManagement;