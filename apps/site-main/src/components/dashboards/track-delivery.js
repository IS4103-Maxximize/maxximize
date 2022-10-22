import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhoneIcon from '@mui/icons-material/Phone';
import TabletIcon from '@mui/icons-material/Tablet';

export const TrackDelivery = (props) => {
  const theme = useTheme();

    return (
    <Card {...props}>
      <CardHeader title="Track Current Delivery" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Typography>Current Delivery</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
