import SearchIcon from "@mui/icons-material/Search";
// import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";

export const VehicleManagementMenu = (props) => {
  const {
    anchorEl, 
    menuOpen, 
    handleClickOpen, 
    handleMenuClose, 
    handleClickViewEdit,
    // handleClickViewSensor,
  } = props;
  return (
    <Menu 
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
      handleClickViewEdit={handleClickViewEdit}
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
          // handleClickViewSensor();
          handleMenuClose();
        }}>
          {/* <ListItemIcon>
            <DeviceThermostatIcon />
          </ListItemIcon>
          <ListItemText>
            Sensor
          </ListItemText> */}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
