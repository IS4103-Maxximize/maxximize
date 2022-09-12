import SearchIcon from "@mui/icons-material/Search";
import SendIcon from '@mui/icons-material/Send';
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";


export const SalesInquiryMenu = (props) => {
  const {
    anchorEl, 
    menuOpen, 
    handleClickOpen, 
    handleMenuClose,
    handleEdit
    // ... handle supplier form open
  } = props;

  return (
    <Menu 
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
    >
      <MenuList>
        <MenuItem onClick={() => {
          handleEdit();
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
        <MenuItem onClick={() => {
          // handle supplier form open
        }}>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText>
            Send
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
