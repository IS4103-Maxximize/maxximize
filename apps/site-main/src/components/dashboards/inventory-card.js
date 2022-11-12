import { Box, Button, Card, CardContent, CardHeader, Divider, Slider, Stack, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { apiHost } from '../../helpers/constants';

export const InventoryCard = (props) => {
  const {
    handleAlertOpen,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'))
  const organisationId = user.organisation?.id;
  const theme = useTheme();

  // Slider Helpers
  const [defaultLevel, setDefaultLevel] = useState(20)
  const [warningLevel, setWarningLevel] = useState(defaultLevel);

  const handleDrag = (event, newValue) => {
    setWarningLevel(newValue);
  }


  const [inventory, setInventory] = useState([]);

  const getInventory = async () => {
    const url = `${apiHost}/batch-line-items/inventoryLevel/${organisationId}/${warningLevel}`
    await fetch(url).then(res => res.json())
      .then(result => {
        const mapped = result.map((item, index) => {return {id: index, ...item }});
        setInventory(mapped);
        // handleAlertOpen()
      })
  }

  useEffect(() => {
    getInventory();
  }, [])

  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 2,
      valueGetter: (params) => 
        params.row ? `${params.row.finalGood.name} [${params.row.finalGood.skuCode}]` : ''
    },
    {
      field: 'remainingQuantity',
      headerName: 'Remaining',
      flex: 1,
      valueGetter: (params) => 
        params.row ? `${params.value} ${params.row.finalGood.unit}` : ''
    },
    {
      field: 'percentageCalc',
      headerName: '% Remaining',
      flex: 1,
      valueFormatter: (params) => params.value ? `${params.value} %` : ''
    },
  ]
  
  return (
    <Card {...props}>
      <CardHeader
        title='Final Good Inventory'
        action={
          <Stack direction="row" alignItems="center">
            <Slider 
              sx={{ minWidth: 400 }}
              marks
              step={5}
              min={20}
              max={70}
              value={warningLevel}
              valueLabelDisplay="auto"
              valueLabelFormat={(value, index) => `${value}%`}
              onChange={handleDrag}
            />
            <Button
              sx={{ ml: 2 }}
              disabled={warningLevel === defaultLevel}
              onClick={() => {
                getInventory()
                .then(() => setDefaultLevel(warningLevel));
              }}
            >
              Refresh
            </Button>
          </Stack>
        }
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            position: 'relative',
            textAlign: "center",
          }}
        >
          {inventory.length > 0 ?
          <DataGrid
            autoHeight
            rows={inventory}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
          : 
          <Typography 
            variant="h6"
          >
            {`No Final Goods Inventory below ${defaultLevel}%`}
          </Typography>
          }
        </Box>
      </CardContent>
    </Card>
  );
};
