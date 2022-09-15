import TabList from '@mui/lab/TabList';
import { Tab, Box, Container } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import { SuppliersList } from './SupplierList';
import { RetailersList } from './RetailerList';


function RelationsTabs({orgId}) {
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
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
                <SuppliersList orgId={orgId}/>
              </Box>
            </Container>
          </TabPanel>
          <TabPanel value="2">
            <Container maxWidth={false}>
              <Box sx={{ mt: 3 }}>
                <RetailersList orgId={orgId}/>
              </Box>
            </Container>
          </TabPanel>
        </TabContext>
      </Box>
  )
}

export default RelationsTabs