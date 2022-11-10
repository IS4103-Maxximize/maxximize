
import { useEffect, useState } from 'react';
import { Bar, Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, Icon, Stack, TextField, Typography, useTheme } from '@mui/material';
import { FilterCard } from '../../components/finance/filter-card';

export const BarChart = (props) => {
  const theme = useTheme();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;
 
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];

  const [thisYear, setThisYear] = useState([]);
  const [lastYear, setLastYear] = useState([]);

  const year=new Date().getFullYear();
  const pastYear=year -1;

  //edit

  const getData = async () => {
  const response = await fetch(``);
  const barChatData = await response.json();
  const thisYear = barChatData();
  setThisYear(thisYear);
  const lastYear = barChatData();
  setLastYear(lastYear);
  }

  useEffect(() => {
    getData();
}, []);

const data ={   
    datasets: [
      {
          backgroundColor: '#3F51B5',
          barPercentage: 0.5,
          barThickness: 12,
          borderRadius: 4,
          categoryPercentage: 0.5,
          data: thisYear,
          maxBarThickness: 10,
          label: 'This year',
        }, 
        {
          backgroundColor: '#F25941',
          barPercentage: 0.5,
          barThickness: 12,
          borderRadius: 4,
          categoryPercentage: 0.5,
          maxBarThickness: 10,
          data: lastYear,
          label: 'Last Year',
        }
      ], 
    labels: labels,
  };

    const designs = {
        animation: false,
        cornerRadius: 20,
        layout: { padding: 0 },
        legend: { display: false },
        maintainAspectRatio: false,
        responsive: true,
        xAxes: [
          {
            ticks: {
              fontColor: theme.palette.text.secondary
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              fontColor: theme.palette.text.secondary,
              beginAtZero: true,
              min: 0
            },
            gridLines: {
              borderDash: [2],
              borderDashOffset: [2],
              color: theme.palette.divider,
              drawBorder: false,
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
              zeroLineColor: theme.palette.divider
            }
          }
        ],
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

  return (
    <Card {...props} >
      <CardContent>
      <CardHeader
          title="Total Sales Volume"
        />
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar
            data={data}
            options={designs}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
