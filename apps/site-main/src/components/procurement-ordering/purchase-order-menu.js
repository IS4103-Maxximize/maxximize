import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const POMenu = (props) => {
  const {
    anchorEl, 
    menuOpen, 
    handleMenuClose, 
    handleClickViewEdit,
    handleFormDialogOpen,
    ...rest
  } = props;
  return (
    <Menu 
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
    >
      <MenuList>
        <MenuItem onClick={() => {
          handleClickViewEdit();
          handleFormDialogOpen();
          handleMenuClose();
        }}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>
            View Details
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
