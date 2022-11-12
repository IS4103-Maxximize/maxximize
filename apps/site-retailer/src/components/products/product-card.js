import {
  Collapse,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useShoppingCart } from '../context/shopping-cart-context';
import { ProductModal } from './product-modal';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { theme } from '../../theme';
import { TransitionGroup } from 'react-transition-group';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Container } from '@mui/system';

export const ProductCard = (props) => {
  const { supplier, product, handleAlertOpen } = props;

  const {
    isItemInCart,
    removeFromCart,
    getItemQuantity,
    updateCartLineItemFromProduct,
  } = useShoppingCart();

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const getCartQuantity = () => {
      return getItemQuantity(supplier.id, product.id);
    };

    const cartQuantity = getCartQuantity();
    setQuantity(cartQuantity);
  }, [product, isItemInCart]);

  const handleChange = (event) => {
    setQuantity(event.target.value);
  };

  return (
    <>
      <ProductModal
        supplier={supplier}
        product={product}
        open={open}
        handleClose={handleModalClose}
        handleAlertOpen={handleAlertOpen}
      />
      <ImageListItem
        style={{ transition: '0.5s' }}
        sx={
          isItemInCart(supplier.id, product.id)
            ? {
                borderLeft: 4,
                borderRadius: '1%',
                borderColor: 'primary.main',
                '&:hover': { transform: 'scale3d(1.005, 1.005, 1)' },
              }
            : {
                borderLeft: 0,
                '&:hover': { transform: 'scale3d(1.005, 1.005, 1)' },
              }
        }
      >
        <img
          style={{ border: '50%' }}
          src={`${'../../assets/img/apples.png'}?w=248&fit=crop&auto=format`}
          srcSet={`${'../../assets/img/apples.png'}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={product.name}
          title={product.name}
          loading="lazy"
        />

        <ImageListItemBar
          title={product.name}
          subtitle={`$ ${product.unitPrice}`}
          actionIcon={
            isItemInCart(supplier.id, product.id) ? (
              <TransitionGroup>
                <Collapse>
                  <Box display="flex" justifyContent="flex-end">
                    <Tooltip title="Remove">
                      <IconButton
                        sx={{
                          color: 'rgba(255, 255, 255, 0.54)',
                          //   paddingLeft: '39%',
                        }}
                        aria-label={`info about ${product.name}`}
                        onClick={() => {
                          removeFromCart(supplier.id, product.id);
                          handleAlertOpen(
                            'Removed product from cart',
                            'success'
                          );
                        }}
                      >
                        <RemoveCircleOutlineIcon
                          style={{ transition: '0.2s' }}
                          sx={{
                            '&:hover': {
                              color: 'primary.light',
                              transform: 'scale(1.2)',
                            },
                          }}
                          color="primary"
                        />
                      </IconButton>
                    </Tooltip>
                    <TextField
                      size="small"
                      value={quantity}
                      sx={{ width: '20%', input: { color: 'white' } }}
                      onChange={handleChange}
                    ></TextField>
                    <Tooltip title="Update">
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${product.name}`}
                        onClick={() => {
                          if (!isNaN(quantity) && quantity > 0) {
                            updateCartLineItemFromProduct(
                              supplier.id,
                              product.id,
                              quantity
                            );
                            handleAlertOpen(
                              'Updated cart line item quantity successfully',
                              'success'
                            );
                          } else {
                            handleAlertOpen(
                              'Quantity must be a positive whole number',
                              'error'
                            );
                          }
                        }}
                      >
                        <EditIcon
                          style={{ transition: '0.2s' }}
                          sx={{
                            '&:hover': {
                              color: 'secondary.light',
                              transform: 'scale(1.2)',
                            },
                          }}
                          color="secondary"
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Collapse>
              </TransitionGroup>
            ) : (
              <Tooltip title="Add to cart">
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${product.name}`}
                  onClick={handleModalOpen}
                >
                  <AddCircleOutlineRoundedIcon
                    style={{ transition: '0.2s' }}
                    sx={{
                      '&:hover': {
                        color: 'secondary.light',
                        transform: 'scale(1.2)',
                      },
                    }}
                    color="secondary"
                  />
                </IconButton>
              </Tooltip>
            )
          }
        />
      </ImageListItem>
    </>
  );
};

// export const ProductCard = (props) => {
//   const { product, style } = props;

//   return (
//     <>
//       <ListItem style={style} component="div" disablePadding>
//         <ListItemButton>
//           <ListItemAvatar>
//             <Avatar alt="Product" src="../../assets/img/apples.png" />
//           </ListItemAvatar>
//           <ListItemText
//             primary={`${product.name}`}
//             secondary={
//               <React.Fragment>
//                 <Typography
//                   sx={{ display: 'inline' }}
//                   component="span"
//                   variant="body2"
//                   color="text.primary"
//                 >
//                   {product.description}
//                 </Typography>
//               </React.Fragment>
//             }
//           />
//         </ListItemButton>
//       </ListItem>
//       <Divider />
//     </>
//   );
// };
