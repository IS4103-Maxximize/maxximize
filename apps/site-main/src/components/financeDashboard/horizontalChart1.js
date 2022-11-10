// import { Bar } from 'react-chartjs-2';
// import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme} from '@mui/material';
// import { useEffect, useState } from 'react';
// import { fetchSales } from '../../helpers/dashboard';

// export const horizontalChart1 = (props) => {
//   const theme = useTheme();

//   const [sales, setSales] = useState([]);
//   const getSales = async () => {
//     const response = await fetchSales();
//     setSales(sales);
//   };

//   useEffect(() => {
//     getSales();
//   }, []);

  
//   const data ={
//     labels: sales.customer.name [sales.customer.uen],
//     datasets: [{
//     axis: 'y',
//     data: sales,
//     label: //sales range,
//     fill: false,
//     backgroundColor: [
//       'rgba(255, 99, 132, 0.2)',
//       'rgba(255, 159, 64, 0.2)',
//       'rgba(255, 205, 86, 0.2)',
//       'rgba(75, 192, 192, 0.2)',
//       'rgba(54, 162, 235, 0.2)',
//     ],
//     borderColor: [
//       'rgb(255, 99, 132)',
//       'rgb(255, 159, 64)',
//       'rgb(255, 205, 86)',
//       'rgb(75, 192, 192)',
//       'rgb(54, 162, 235)',
//     ],
//     borderWidth: 1
//       }]
//     };

//   const options = {
//     indexAxis: 'y',
//     animation: false,
//     cornerRadius: 20,
//     layout: { padding: 0 },
//     legend: { display: false },
//     maintainAspectRatio: false,
//     responsive: true,
//     xAxes: [
//       {
//         ticks: {
//           fontColor: theme.palette.text.secondary
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         }
//       }
//     ],
//     yAxes: [
//       {
//         ticks: {
//           fontColor: theme.palette.text.secondary,
//           beginAtZero: true,
//           min: 0
//         },
//         gridLines: {
//           borderDash: [2],
//           borderDashOffset: [2],
//           color: theme.palette.divider,
//           drawBorder: false,
//           zeroLineBorderDash: [2],
//           zeroLineBorderDashOffset: [2],
//           zeroLineColor: theme.palette.divider
//         }
//       }
//     ],
//     tooltips: {
//       backgroundColor: theme.palette.background.paper,
//       bodyFontColor: theme.palette.text.secondary,
//       borderColor: theme.palette.divider,
//       borderWidth: 1,
//       enabled: true,
//       footerFontColor: theme.palette.text.secondary,
//       intersect: false,
//       mode: 'index',
//       titleFontColor: theme.palette.text.primary
//     }
//   };

//   return (
//     <Card {...props}>
//       <CardHeader
//         title="Top 5 Customers By Revenue"
//       />
//       <Divider />
//       <CardContent>
//         <Box
//           sx={{
//             height: 400,
//             position: 'relative'
//           }}
//         >
//           <Bar
//             data={data}
//             options={options}
//           />
//         </Box>
//       </CardContent>
//       <Divider />
//     </Card>
//   );
// };