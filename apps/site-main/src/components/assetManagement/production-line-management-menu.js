import SearchIcon from "@mui/icons-material/Search";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";

export const ProductionLineManagementMenu = (props) => {
  const {
    anchorEl, 
    menuOpen, 
    handleClickOpen, 
    handleMenuClose, 
    handleClickViewEdit,
    handleClickViewMachine,
    handleClickViewSchedule,
  } = props;
  return (
    <Menu 
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
      handleClickViewEdit={handleClickViewEdit}
      handleClickViewMachine={handleClickViewMachine}
      handleClickViewSchedule={handleClickViewSchedule}
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
          handleClickViewMachine();
          handleMenuClose();
        }}>
          <ListItemIcon>
            <PrecisionManufacturingIcon />
          </ListItemIcon>
          <ListItemText>
            Machine
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleClickViewSchedule();
          handleMenuClose();
        }}>
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText>
            Schedule
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
