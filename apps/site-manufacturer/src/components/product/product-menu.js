import SearchIcon from "@mui/icons-material/Search";
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";


export const ProductMenu = (props) => {
  const {anchorEl, menuOpen, handleClickOpen, handleMenuClose} = props;
  return (
    <Menu 
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
    >
      <MenuList>
        <MenuItem onClick={() => {
          handleClickOpen();
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
};
