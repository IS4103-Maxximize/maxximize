import SearchIcon from "@mui/icons-material/Search";
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";


export const InvoiceMenu = (props) => {
  const {
    anchorEl, 
    menuOpen, 
    handleClickOpen, 
    handleMenuClose, 
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
          handleClickOpen();
          handleMenuClose();
        }}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>
            View Invoice
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
