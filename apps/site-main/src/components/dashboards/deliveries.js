import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CheckIcon from '@mui/icons-material/Check';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from 'react';

export const Deliveries = (props) => {
  const {
    user,
    ...rest
  } = props;

  const theme = useTheme();

  const startButton = (
    <Button
      endIcon={<PlayArrowIcon fontSize="small" />}
      size="small"
      variant="contained"
      // onClick
    >
      Start Delivery
    </Button>
  )

  const completeButton = (
    <Button
      endIcon={<CheckIcon fontSize="small" />}
      size="small"
      variant="contained"
      color="secondary"
      // onClick
    >
      Complete Delivery
    </Button>
  )

  // Delivery Request TODO
  const [todoDelivery, setTodoDelivery] = useState();

  // Completed Delivery Requests
  const [deliveryRequests, setDeliveryRequests] = useState([]);

  // Columns for Completed Delivery Requests
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1
    },
    {
      field: 'addressFrom',
      headerName: 'From',
      flex: 1
    },
    {
      field: 'addressTo',
      headerName: 'To',
      flex: 1
    },
  ]

  return (
    <Card>
      <CardHeader
        // action={startButton}
        action={completeButton}
        title="Pending Delivery Request"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            m: -1,
            height: 500,
            position: 'relative'
          }}
        >
          <DataGrid 
            rows={deliveryRequests}
            columns={columns}
            pageSize={10}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
