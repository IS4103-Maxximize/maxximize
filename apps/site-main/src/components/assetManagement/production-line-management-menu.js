import SearchIcon from "@mui/icons-material/Search";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DataUsageIcon from '@mui/icons-material/DataUsage';
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
    handleClickViewUtilization,
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
        <MenuItem onClick={() => {
          handleClickViewUtilization();
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DataUsageIcon />
          </ListItemIcon>
          <ListItemText>
            Utilization
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
