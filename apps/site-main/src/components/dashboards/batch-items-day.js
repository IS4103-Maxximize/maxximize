import { Box, Button, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { apiHost } from '../../helpers/constants';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link as RouterLink} from 'react-router-dom';

export const BatchItemsDay = (props) => {
  const {
    user,
    handleAlertOpen,
    ...rest
  } = props;

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
    if (user) {
      getBatchLineItems();
    }
  }, [user]);

  // Columns for Completed Delivery Requests
  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 1,
      valueGetter: (params) => `${params.row?.batchLineItem?.product?.name} [${params.row?.batchLineItem?.product?.skuCode}]` 
    },
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
        action={
          <Button 
            component={RouterLink} 
            to="/inventory/warehouse"
            target="_blank" // to open in new tab
            endIcon={<OpenInNewIcon />}
            variant="contained"
          >
            View Warehouses
          </Button>
        }
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
              rowsPerPageOptions={[10]}
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
