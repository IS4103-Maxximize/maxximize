import {
  Box,
  Button,
  Card,
  Collapse,
  Container,
  IconButton,
  List,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { NotificationAlert } from '../components/notification-alert';
import MoreVert from '@mui/icons-material/MoreVert';
import { SupplierCard } from '../components/suppliers/supplier-card';
import { TransitionGroup } from 'react-transition-group';
import { Toolbar } from '../components/toolbar';

const Suppliers = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => retrieveAllSuppliers, []);

  //Retrieve all suppliers
  const retrieveAllSuppliers = async () => {
    const response = await fetch(`http://localhost:3000/api/organisations`);
    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
      result = result.filter(
        (supplier) =>
          supplier.uen !== '999999999' &&
          (supplier.type === 'manufacturer' || supplier.type === 'supplier')
      );
    }

    setSuppliers(result);
    setSearchResults(result);
  };

  //Search Function
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  useEffect(() => {
    const results = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(search)
    );
    setSearchResults(results);
  }, [search]);

  //Action Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleActionMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // NotificationAlert helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState();
  const [alertSeverity, setAlertSeverity] = useState('success');
  const handleAlertOpen = (text, severity) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertText(null);
    setAlertSeverity('success');
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Suppliers | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            key="toolbar"
            name={'Supplier'}
            handleSearch={handleSearch}
          />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box>
                <List>
                  {searchResults.length !== 0 ? (
                    <TransitionGroup>
                      {searchResults.map((supplier) => (
                        <Collapse key={supplier.id}>
                          <SupplierCard supplier={supplier} />
                        </Collapse>
                      ))}
                    </TransitionGroup>
                  ) : (
                    <Box display="flex" justifyContent="center" m={1}>
                      <Typography variant="body1">
                        No supplier matching search term found
                      </Typography>
                    </Box>
                  )}
                </List>
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Suppliers;
