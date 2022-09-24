import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const BinActionMenu = (props) => {
  const {
    anchorElUpdate,
    actionMenuOpen,
    handleActionMenuClose,
    handleClickUpdate,
  } = props;

  return (
    <Menu
      anchorEl={anchorElUpdate}
      open={actionMenuOpen}
      onClose={handleActionMenuClose}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            handleActionMenuClose();
            handleClickUpdate();
          }}
        >
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>View/Update Details</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
