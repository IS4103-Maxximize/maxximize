
import { useEffect, useState } from 'react';
import { Bar, Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, Grid, Icon, Stack, TextField, Typography, useTheme } from '@mui/material';
import { FilterCard } from '../../components/finance/filter-card';
import { Dayjs } from 'dayjs';

export const Chart = (props) => {
  const theme = useTheme();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // Date Helpers
  const [dataRange, setDataRange] = useState(false);
  const [dataType, setDataType] = useState('month');
  const [inDataDate, setInDataDate] = useState(new Date());
  const [fromDataDate, setFromDataDate] = useState(null);
  const [toDataDate, setToDataDate] = useState(new Date());

  const toggleDataRange = () => {
    setDataRange(!dataRange);
  }

  const handleDataType = (event, newType) => {
    if (newType !== null) {
      dataType(newType);
    }
  }

  const resetDataDates = () => {
    setInDataDate(new Date());
    setFromDataDate(null);
    setToDataDate(new Date());
  }

  useEffect(() => {
    resetDataDates();
  }, [dataRange, dataType]) 

    const results = [];
    for (let i = fromDataDate; i < toDataDate; i++) {
    results.push(Dayjs(i).format('MMM YYYY'));
    }

  const [revenue, setRevenue] = useState([]);
  const [cost, setCosts] = useState([]);

  const getData = async () => {
  const response = await fetch(``);
  const barChatData = await response.json();
  const revenue = barChatData(organisationId,'revenue', results[0], results[results.length - 1]);
  setRevenue(revenue);
  const cost = barChatData(organisationId,'cost', results[0], results[results.length - 1]);
  setCosts(cost);
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
          maxBarThickness: 10,
          data: revenue,
          label: 'Revenue',
        }, 
        {
          backgroundColor: '#F25941',
          barPercentage: 0.5,
          barThickness: 12,
          borderRadius: 4,
          categoryPercentage: 0.5,
          maxBarThickness: 10,
          data: cost,
          label: 'Cost',
        }
      ],
    labels: results,
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
                 <Grid item md={6} xs={12}>
                <FilterCard 
                  title='Date Filter'
                  range={dataRange}
                  toggleRange={toggleDataRange}
                  inDate={inDataDate}
                  setIn={setInDataDate}
                  from={fromDataDate}
                  to={toDataDate}
                  setFrom={setFromDataDate}
                  setTo={setToDataDate}
                  type={dataType}
                  handleType={handleDataType}
                  reset={resetDataDates}
                />
              </Grid>
      <CardContent>
      <CardHeader
          title="Revenue and Cost Graph"
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
