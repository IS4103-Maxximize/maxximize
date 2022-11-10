import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { fetchCostBreakdown } from '../../helpers/dashboard';

export const CostBreakdown = (props) => {
  const {
    type,
  } = props;
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const getCostBreakdown = async () => {
    const response = await fetchCostBreakdown();
    return response;
  };

  const data = {
    datasets: [
      {
        data: [getCostBreakdown(organisationId,type==='supplies'),getCostBreakdown(organisationId,type==='operations'),getCostBreakdown(organisationId,type==='subscriptions')],
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: ['Supplies', 'Operations', 'Subscriptions']
  };

  const costs = [
    
    {
      title: 'Supplies',
      icon: RestaurantIcon,
      color: '#3F51B5'
    },
    {
      title: 'Operations',
      icon: PrecisionManufacturingIcon,
      color: '#E53935'
    },
    {
      title: 'Subscriptions',
      icon: ReceiptLongIcon,
      color: '#FB8C00'
    }
  ];

  return (
    <Card {...props}>
      <CardHeader title="Costs Breakdown" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {costs.map(({
            color,
            icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};