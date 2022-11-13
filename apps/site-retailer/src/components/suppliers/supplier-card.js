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

export const SupplierCard = (props) => {
  const { supplier, style } = props;

  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`${supplier.id}/products`);
  };

  return (
    <>
      <ListItem style={style} component="div" disablePadding>
        <ListItemButton onClick={handleRowClick}>
          <ListItemAvatar>
            <Avatar alt="Supplier" src="../../assets/img/default-avatar.png" />
          </ListItemAvatar>
          <ListItemText
            primary={`${supplier.name}`}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {supplier.contact.phoneNumber}
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
