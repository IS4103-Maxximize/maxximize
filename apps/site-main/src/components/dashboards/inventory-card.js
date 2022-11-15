import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Slider,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FindInPageIcon from '@mui/icons-material/FindInPage';

export const InventoryCard = (props) => {
  const {
    defaultLevel,
    warningLevel,
    handleDrag,
    inventory,
    handleRefresh,
    sendProdRequests,
    handleAlertOpen,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation?.id;
  const theme = useTheme();

  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 2,
      valueGetter: (params) =>
        params.row
          ? `${params.row.finalGood.name} [${params.row.finalGood.skuCode}]`
          : '',
    },
    {
      field: 'remainingQuantity',
      headerName: 'Remaining',
      flex: 1,
      valueGetter: (params) =>
        params.row ? `${params.value} ${params.row.finalGood.unit}` : '',
    },
    {
      field: 'percentageCalc',
      headerName: '% Remaining',
      flex: 1,
      valueFormatter: (params) => (params.value ? `${params.value} %` : ''),
    },
  ];

  const marks = [
    {
      value: 20,
      label: '20',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 40,
      label: '40',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 60,
      label: '60',
    },
    {
      value: 70,
      label: '70',
    },
  ];

  return (
    <Card {...props}>
      <CardHeader
        title="Final Good Inventory"
        action={
          <Stack direction="row" alignItems="center">
            {inventory.length > 0 && (
              <IconButton
                sx={{ mr: 4 }}
                color="primary"
                onClick={sendProdRequests}
              >
                <Tooltip placement="top" title="Send bulk Production Requests">
                  <FindInPageIcon />
                </Tooltip>
              </IconButton>
            )}
            <Slider
              sx={{ minWidth: 300 }}
              marks={marks}
              step={10}
              min={20}
              max={70} // adjust to 70 for SR4
              value={warningLevel}
              valueLabelDisplay="off"
              valueLabelFormat={(value, index) => `${value}%`}
              onChange={handleDrag}
            />
            <Button
              sx={{ ml: 2 }}
              disabled={warningLevel === defaultLevel}
              onClick={handleRefresh}
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
            textAlign: 'center',
          }}
        >
          {inventory.length > 0 ? (
            <DataGrid
              autoHeight
              rows={inventory}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          ) : (
            <Typography variant="h6">
              {`No Final Goods Inventory below ${defaultLevel}%`}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
