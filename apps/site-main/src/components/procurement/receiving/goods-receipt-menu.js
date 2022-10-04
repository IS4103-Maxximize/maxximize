import SearchIcon from '@mui/icons-material/Search';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';

export const GoodsReceiptMenu = (props) => {
  const {
    goodsReceipt,
    anchorEl,
    menuOpen,
    setGoodsReceiptLineItems,
    handleMenuClose,
    handleClickView,
  } = props;
  return (
    <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
      <MenuList>
        <MenuItem
          onClick={() => {
            setGoodsReceiptLineItems(goodsReceipt.goodsReceiptLineItems);
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
