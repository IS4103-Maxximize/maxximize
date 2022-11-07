import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';

export const OrganisationManagementMenu = (props) => {
  const {
    anchorEl,
    menuOpen,
    handleMenuClose,
    handleDialogOpen,
    handleSubscriptionDialogOpen,
    handleInvoiceDialogOpen,
  } = props;
  return (
    <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
      <MenuList>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleDialogOpen();
          }}
        >
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleSubscriptionDialogOpen();
          }}
        >
          <ListItemIcon>
            <CardMembershipIcon />
          </ListItemIcon>
          <ListItemText>View Subscriptions</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleInvoiceDialogOpen();
          }}
        >
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText>View Invoices</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
