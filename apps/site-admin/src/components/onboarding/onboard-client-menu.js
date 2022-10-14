import SearchIcon from '@mui/icons-material/Search';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';

export const OnboardClientMenu = (props) => {
  const { anchorEl, menuOpen, handleMenuClose, handleDialogOpen } = props;
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
      </MenuList>
    </Menu>
  );
};
