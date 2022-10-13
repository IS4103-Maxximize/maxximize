import SearchIcon from "@mui/icons-material/Search";
// import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";

export const VehicleManagementMenu = (props) => {
  const {
    anchorEl, 
    menuOpen, 
    handleClickOpen, 
    handleMenuClose, 
    handleClickViewEdit,
    handleClickViewDeliveryRequest
    // handleClickViewSensor,
  } = props;
  return (
    <Menu 
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
      handleClickViewEdit={handleClickViewEdit}
      handleClickViewDeliveryRequest={handleClickViewDeliveryRequest}
      // handleClickViewSensor={handleClickViewSensor}
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
        <MenuItem onClick={() => {
          handleClickViewDeliveryRequest;
          handleMenuClose();
        }}>
         <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText>
            Delivery Request 
          </ListItemText> 
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
