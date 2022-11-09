import React from 'react';
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Slide,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const CartCard = (props) => {
  const { cart, style } = props;

  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`${cart.id}/products`);
  };

  return (
    <>
      <ListItem style={style} component="div" disablePadding>
        <ListItemButton onClick={handleRowClick}>
          <ListItemAvatar>
            <Avatar alt="Supplier" src="../../assets/img/default-avatar.png" />
          </ListItemAvatar>
          <ListItemText
            primary={`${cart.organisation.name}`}
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
