import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';
import { CssBaseline } from '@mui/material';
import { useShoppingCart } from './context/shopping-cart-context';
import { useEffect } from 'react';

const Layout = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user?.organisation.id;

  const { retrieveUserCarts } = useShoppingCart();

  // Retrieve carts everytime the page reloads
  useEffect(() => {
    retrieveUserCarts(organisationId);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className="App">
        <Outlet />
      </main>
    </ThemeProvider>
  );
};

export default Layout;
