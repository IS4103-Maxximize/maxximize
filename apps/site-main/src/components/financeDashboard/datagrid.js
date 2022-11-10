// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Typography,
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import DayJS from 'dayjs';
// import { useEffect, useState } from 'react';
// import { fetchProducts } from "../../helpers/products";


// export const Datagrid = (props) => {

//   const user = JSON.parse(localStorage.getItem('user'));
//   const organisationId = user.organisation.id;

//   const [finalGoods, setFinalGoods] = useState([]);

//   const getProducts = async () => {
//     const final = await fetchProducts('final-goods', organisationId)    
//     setFinalGoods(final.filter(finalGood => !finalGood.billOfMaterial));
//   }

//   useEffect(() => {
//     getProducts();
//   }, []);


//   const columns = [
//     {
//       field: 'id',
//       headerName: 'ID',
//       flex: 1,
//     },
//     {
//       field: 'name',
//       headerName: 'Product Name',
//       flex: 2,
//       valueGetter: (params) => {
//         return params.row ? params.row.name : '';
//       }
//     },
//     ];
  

//   return (
//     <Box sx={{ mt: 2 }}>
//     <Typography>Top Products by Sales</Typography>
//           <DataGrid
//             autoHeight
//             rows={finalGoods}
//             columns={columns}
//             pageSize={5}
//             rowsPerPageOptions={[5]}
//             components={{
//               Toolbar: GridToolbar,
//             }}
//           /> 
//           </Box>
//   );
// };
