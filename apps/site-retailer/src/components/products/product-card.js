import {
  Collapse,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useShoppingCart } from '../context/shopping-cart-context';
import { ProductModal } from './product-modal';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { theme } from '../../theme';
import { TransitionGroup } from 'react-transition-group';

export const ProductCard = (props) => {
  const { supplier, product, handleAlertOpen } = props;

  const { isItemInCart, removeFromCart } = useShoppingCart();

  const [open, setOpen] = React.useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

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
                  <Tooltip title="Remove">
                    <IconButton
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      aria-label={`info about ${product.name}`}
                      onClick={() => {
                        removeFromCart(supplier.id, product.id);
                        handleAlertOpen('Removed product from cart', 'success');
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
