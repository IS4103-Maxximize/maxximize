import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KitchenIcon from '@mui/icons-material/Kitchen';

import { useEffect, useState } from 'react';

export const WarehouseActionMenu = (props) => {
  const {
    bins,
    setSelectedBin,
    setBatchLineItems,
    anchorElUpdate,
    actionMenuOpen,
    handleActionMenuClose,
    handleClickUpdate,
    handleClickView,
  } = props;

  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  // License: MIT - https://opensource.org/licenses/MIT
  // Author: Michele Locati <michele@locati.it>
  // Source: https://gist.github.com/mlocati/7210513
  //Edited for darker shade, better constrast
  const perc2color = (bin) => {
    let perc = ((bin.capacity - bin.currentCapacity) / bin.capacity) * 100;
    let r,
      g,
      b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    } else {
      g = 255;
      r = Math.round(510 - 5.1 * perc);
    }
    let h = r * 0x10000 + g * 0x100 + b * 0x1;
    h = h.toString(16);

    let newString = '';

    for (let i = 0; i < h.length; i++) {
      if (i % 2 != 0) {
        newString += '0';
      } else {
        newString += h.charAt(i);
      }
    }

    return '#' + ('000000' + newString).slice(-6);
  };

  return (
    <Menu
      anchorEl={anchorElUpdate}
      open={actionMenuOpen}
      onClose={handleActionMenuClose}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            handleActionMenuClose();
            handleClickUpdate();
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Update Details</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={bins?.length == 0}
          onClick={() => {
            handleClick();
            if (open) {
              handleActionMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <KitchenIcon />
          </ListItemIcon>
          <ListItemText>Bins</ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </MenuItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {bins?.map((bin) => (
            <MenuItem
              key={bin.id}
              onClick={() => {
                handleActionMenuClose();
                handleClickView();
                setSelectedBin(bin);
                setBatchLineItems(bin.batchLineItems);
              }}
            >
              <ListItemIcon>
                <KitchenIcon sx={{ color: perc2color(bin) }} />
              </ListItemIcon>
              <ListItemText>{bin.name}</ListItemText>
            </MenuItem>
          ))}
        </Collapse>
      </MenuList>
    </Menu>
  );
};
