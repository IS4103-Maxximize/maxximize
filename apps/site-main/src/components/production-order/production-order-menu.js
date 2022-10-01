import SearchIcon from '@mui/icons-material/Search';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';

export const ProductionOrderMenu = (props) => {
  const { anchorEl, menuOpen, handleMenuClose, handleClickViewEdit, ...rest } =
    props;
  return (
    <Menu
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
      handleClickViewEdit={handleClickViewEdit}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            handleClickViewEdit();
            handleMenuClose();
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
