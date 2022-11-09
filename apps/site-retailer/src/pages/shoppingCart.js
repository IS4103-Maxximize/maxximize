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
import { useShoppingCart } from '../components/context/shopping-cart-context';
import { CartCard } from '../components/carts/cart-card';
import { Link } from 'react-router-dom';

const ShoppingCart = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { carts } = useShoppingCart();

  //Search Function
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  useEffect(() => {
    setSearchResults(carts);
  }, []);

  useEffect(() => {
    const results = carts.filter((cart) =>
      cart.organisation.name.toLowerCase().includes(search)
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
          <title>{`Shopping Carts | ${user?.organisation?.name}`}</title>
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
            name={'Shopping Carts'}
            handleSearch={handleSearch}
          />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box>
                {carts.length !== 0 ? (
                  <List>
                    <TransitionGroup>
                      {searchResults.length !== 0 ? (
                        searchResults.map((cart) => (
                          <Collapse key={cart.id}>
                            <CartCard cart={cart} />
                          </Collapse>
                        ))
                      ) : (
                        <Typography variant="body1">
                          No cart matching search term found
                        </Typography>
                      )}
                    </TransitionGroup>
                  </List>
                ) : (
                  <Box display="flex" justifyContent="center" m={2}>
                    <Typography variant="body1">
                      You have no shopping carts, start ordering{' '}
                      {
                        <Link
                          to={'/suppliers'}
                          style={{
                            textDecoration: 'none',
                            fontWeight: '2.25rem',
                            color: '#FE2472',
                          }}
                        >
                          here
                        </Link>
                      }
                      !
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ShoppingCart;
