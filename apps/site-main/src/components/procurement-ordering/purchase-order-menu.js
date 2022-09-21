import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const POMenu = (props) => {
  const {
    anchorEl, 
    menuOpen, 
    handleMenuClose, 
    handleClickViewEdit,
    handleFormDialogOpen
  } = props;
  return (
    <Menu 
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
      handleClickViewEdit={handleClickViewEdit}
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
            View/Edit Details
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
