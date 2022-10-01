import SearchIcon from "@mui/icons-material/Search";
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";

export const MachineMenu = (props) => {
  const {
    anchorEl, 
    menuOpen, 
    handleClickOpen, 
    handleMenuClose, 
    handleClickViewEdit,
    ...rest
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
