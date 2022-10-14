import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';

export const SalesInquiryMenu = (props) => {
  const {
    canSend,
    anchorEl,
    menuOpen,
    handleClickOpen,
    handleMenuClose,
    handleEdit,
    handleSupplierDialogOpen,
  } = props;

  return (
    <>
      {canSend ? (
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          <MenuList>
            <MenuItem
              onClick={() => {
                handleEdit();
                handleClickOpen();
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText>View/Edit Details</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSupplierDialogOpen();
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText>Send Suppliers</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          <MenuList>
            <MenuItem
              onClick={() => {
                handleEdit();
                handleClickOpen();
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText>View/Edit Details</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
};
