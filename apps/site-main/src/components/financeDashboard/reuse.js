import { Card, CardContent, CardHeader, Divider, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";

export const Reuse = (props) => {
    const theme = useTheme();


const [graphData, setGraphData] = useState([]);

const getData = async () => {
    const response = await fetch().json();
    setGraphData(response);
    }
  
    useEffect(() => {
      getData();
  }, []);

  const [graphLabel, setGraphLabel] = useState([]);

  const getLabel = async () => {
    const response = await fetch().json();
    setGraphLabel(response);
    }
  
    useEffect(() => {
        getLabel();
  }, []);
  
  const data = {
    label: graphLabel,
    datasets: [{
        backgroundColor: '#3F51B5',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        maxBarThickness: 10,
        data: graphData,
   }],
};
   const options = {
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
    <Card {...props}>
      <CardHeader
        title='Bar Chart'
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
      
    </Card>
  );
};


