import SearchIcon from '@mui/icons-material/Search';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';

export const GoodReceiptMenu = (props) => {
  const {
    goodReceipt,
    anchorEl,
    menuOpen,
    setGoodReceiptLineItems,
    handleMenuClose,
    handleClickView,
  } = props;
  return (
    <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
      <MenuList>
        <MenuItem
          onClick={() => {
            setGoodReceiptLineItems(goodReceipt.goodsReceiptLineItems);
            handleMenuClose();
            handleClickView();
          }}
        >
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
