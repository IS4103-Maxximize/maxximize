import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import { useShoppingCart } from './context/shopping-cart-context';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const navigate = useNavigate();
  const { onSidebarOpen, ...other } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const toggleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type) => {
    setAnchorEl(null);
    switch (type) {
      case 'logout':
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        break;
      case 'profile':
        //do nothing yet
        break;
    }
  };

  const { cartsQuantity } = useShoppingCart();

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: 'calc(100% - 280px)',
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none',
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Badge badgeContent={cartsQuantity} color="primary">
            <Tooltip title="Shopping Carts">
              <IconButton onClick={() => navigate('/shopping-cart')}>
                <ShoppingCartIcon color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
          </Badge>
          <Tooltip title="Settings">
            <IconButton onClick={toggleMenu} sx={{ marginLeft: 1 }}>
              <SettingsIcon color="primary" fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => handleClose('profile')}>Profile</MenuItem>
            <MenuItem onClick={() => handleClose('logout')}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
