import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CheckIcon from '@mui/icons-material/Check';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from 'react';
import DayJS from 'dayjs'
import { apiHost } from '../../helpers/constants';

export const BatchItemsDay = (props) => {
  const {
    user,
    handleAlertOpen,
    ...rest
  } = props;

  const theme = useTheme();

  const [rows, setRows] = useState([]);

  const getBatchLineItems = async () => {
    const apiUrl = `${apiHost}/production-orders/retrieveBatchLineItemsForProduction/`;
    await fetch(apiUrl)
      .then(response => response.json())
      .then(result => setRows(result.map((item, index) => {
        return {
          id: index,
          ...item
        }
      })))
      // .catch(err => handleAlertOpen('Failed to Retrieve Batch'))
  }

  useEffect(() => {
    getBatchLineItems();
  });

  // Columns for Completed Delivery Requests
  const columns = [
    {
      field: 'code',
      headerName: 'Batch Line Item Code',
      flex: 2,
      valueGetter: (params) => params.row?.batchLineItem?.code
    },
    {
      field: 'batchNumber',
      headerName: 'Batch Number',
      flex: 2,
      valueGetter: (params) => params.row?.batchLineItem?.batch?.batchNumber
    },
    {
      field: 'quantityToTake',
      headerName: 'Retrieve Quantity',
      flex: 1
    },
  ]

  return (
    <Card>
      <CardHeader
        title={`Batch Line Items to Retrieve for Today - ${DayJS(new Date()).format('DD MMMM YYYY')}`}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            m: -1,
            height: 500,
            position: 'relative',
          }}
        >
          {rows.length > 0 ? 
            <DataGrid 
              rows={rows}
              columns={columns}
              pageSize={10}
              components={{
                Toolbar: GridToolbar,
              }}
              disableSelectionOnClick
            /> : 
            <Typography>No Batch Line Items to Retrieve</Typography>
          }
        </Box>
      </CardContent>
    </Card>
  );
};
