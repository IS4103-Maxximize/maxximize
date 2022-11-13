import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useShoppingCart } from '../context/shopping-cart-context';

export const ProductModal = (props) => {
  const { supplier, product, open, handleClose, handleAlertOpen } = props;

  const { getItemQuantity, setItemQuantity } = useShoppingCart();

  const onClose = () => {
    handleClose();
    formik.resetForm();
  };

  // Add item to cart or update its quantity
  const handleOnSubmit = (values) => {
    setItemQuantity(supplier, product.id, values.quantity);
    handleAlertOpen('Successfully updated quantity of item in cart', 'success');
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validationSchema: Yup.object({
      quantity: Yup.number()
        .typeError('Quantity must be a number')
        .integer('Quantity must be a whole number')
        .positive('Quantity must be positive')
        .required('Quantity is required'),
    }),
    onSubmit: handleOnSubmit,
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.default',
    boxShadow: 24,
    padding: 1,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-product-title"
      aria-describedby="modal-product-description"
    >
      <form onSubmit={formik.handleSubmit}>
        <Box sx={style}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="20%"
              image="../../assets/img/apples.png"
              alt="green iguana"
            />
            <CardContent sx={{ margin: -1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {product.name}
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body1" color="text.secondary">
                  ${product.unitPrice}
                </Typography>
              </Box>
            </CardContent>
            {/* <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions> */}
          </Card>
          <Card
            sx={{
              marginTop: 1,
              padding: 1,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              error={Boolean(formik.touched.quantity && formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
              label="Quantity"
              name="quantity"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.quantity}
              variant="outlined"
              size="small"
            ></TextField>
            <Box>
              <IconButton
                aria-label={`info about ${product.name}`}
                onClick={formik.handleSubmit}
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
            </Box>
          </Card>
        </Box>
      </form>
    </Modal>
  );
};
