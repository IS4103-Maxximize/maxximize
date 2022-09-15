import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';

export const PurchasingOrder = ({ order, ...rest }) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    {...rest}
  >
    <CardContent>
      <Typography
        align="center"
        color="textPrimary"
        gutterBottom
        variant="h5"
      >
        {order.title}
      </Typography>
      <Typography
        align="center"
        color="textPrimary"
        variant="body1"
      >
        {order.description}
      </Typography>
    </CardContent>
  </Card>
);

PurchasingOrder.propTypes = {
  order: PropTypes.object.isRequired
};
