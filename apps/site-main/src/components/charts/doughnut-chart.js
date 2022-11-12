import { Skeleton, useTheme } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

export const DoughnutChart = (props) => {
  const theme = useTheme();

  const {
    data,
    labels,
    ...rest
  } = props;

  const chartData = {
    datasets: [
      {
        data: data,
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: labels
  };

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

  return (data && labels) ?
    <Doughnut
      data={chartData}
      options={options}
    /> 
    : <Skeleton />
};
