import {
  Box,
  Card,
  Collapse,
  Container,
  List,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { CartCard } from '../components/carts/cart-card';
import { CartConfirmDialog } from '../components/carts/cart-confirm-dialog';
import { CartToolbar } from '../components/carts/cart-toolbar';
import { useShoppingCart } from '../components/context/shopping-cart-context';
import { NotificationAlert } from '../components/notification-alert';

const ShoppingCart = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { carts, retrieveUserCarts, removeCart } = useShoppingCart();

  //Search Function
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  // Check
  useEffect(() => {
    const getCarts = async () => {
      //   await retrieveUserCarts();
      await setSearchResults([...carts]);
    };

    getCarts();
  }, [carts]);

  useEffect(() => {
    const results = carts?.filter(
      (cart) => cart.supplierId.toString().includes(search)
      //   cart.supplier.name.toLowerCase().includes(search)
    );
    setSearchResults(results);
  }, [search]);

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

  // Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // For list checkboxes
  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    // console.log([...checked]);
    const newChecked = [...checked];

    console.log(newChecked);

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    // console.log(newChecked);

    setChecked(newChecked);
  };

  // Handle Cart deletion
  const handleDelete = async (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
    };

    selectedIds.forEach((currentId) => {
      removeCart(currentId)
        .then(() => {
          handleAlertOpen(`Successfully removed cart(s)`, 'success');
        })
        .catch((error) => {
          handleAlertOpen(`Failed to remove cart(s):${error}`, 'error');
        });
    });

    setChecked([]);
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
      <CartConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Delete address record(s)`}
        dialogContent={`Confirm deletion of addresss record(s)?`}
        dialogAction={() => {
          handleDelete(checked);
        }}
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
          <CartToolbar
            key="toolbar"
            checked={checked}
            name={'Shopping Carts'}
            handleSearch={handleSearch}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box>
                {carts?.length !== 0 ? (
                  <List>
                    {searchResults && searchResults.length !== 0 ? (
                      <TransitionGroup>
                        {searchResults?.map((cart) => (
                          <Collapse key={cart.id}>
                            <CartCard
                              cart={cart}
                              checked={checked}
                              handleToggle={handleToggle}
                              handleAlertOpen={handleAlertOpen}
                            />
                          </Collapse>
                        ))}
                      </TransitionGroup>
                    ) : (
                      <Box display="flex" justifyContent="center" m={1}>
                        <Typography variant="body1">
                          No cart matching search term found
                        </Typography>
                      </Box>
                    )}
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
