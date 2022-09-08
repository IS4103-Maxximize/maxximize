import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";


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
            View Details
          </ListItemText>
        </MenuItem>
        <MenuItem 
          disabled 
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>
            Delete Product
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
