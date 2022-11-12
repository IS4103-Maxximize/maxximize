import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Checkbox,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CartDialog } from './cart-dialog';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';

export const CartCard = (props) => {
  const { checked, cart, handleToggle, handleAlertOpen, style } = props;

  // Dialog helpers
  const [cartDialogOpen, setCartDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setCartDialogOpen(true);
  };

  const handleDialogClose = () => {
    setCartDialogOpen(false);
  };

  return (
    <>
      <CartDialog
        open={cartDialogOpen}
        handleClose={handleDialogClose}
        cart={cart}
        handleAlertOpen={handleAlertOpen}
      />
      <ListItem
        style={style}
        component="div"
        disablePadding
        secondaryAction={
          <Box mr={3}>
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={handleDialogOpen}
            >
              <EditIcon />
            </IconButton>
          </Box>
        }
      >
        <ListItemButton onClick={handleToggle(cart.supplierId)}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked.indexOf(cart.supplierId) !== -1}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemAvatar>
            <Avatar alt="Supplier" src="../../assets/img/default-avatar.png" />
          </ListItemAvatar>
          <ListItemText
            primary={`${cart.supplier.name}`}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {`${cart.cartLineItems.length} item(s) in cart`}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
};
