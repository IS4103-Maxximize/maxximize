import PlaceIcon from '@mui/icons-material/Place';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { Box, Card, CardContent, CardHeader, Divider, Step, StepLabel, Stepper, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { SeverityPill } from '../severity-pill';

export const TrackDelivery = (props) => {
  const {
    assigned,
    ...rest
  } = props;
  
  const theme = useTheme();

  const colorMap = {
    'readytodeliver': 'primary',
    'outfordelivery': 'warning'
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 2
    },
  ]

  return (
    <Card {...props}>
      <CardHeader 
        title="Track Current Delivery"
        action={
          assigned && 
          <SeverityPill color={colorMap[assigned.status]}>
            {assigned.status}
          </SeverityPill>
        }
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative',
            textAlign:'center'
          }}
        >
          {assigned ? 
          <>
            <Stepper 
              orientation='horizontal' 
              activeStep={assigned.status === 'readytodeliver' ? 0 : 1}
              sx={{ textAlign: 'center' }}
            >
              <Step key="from">
                <StepLabel 
                  StepIconComponent={WarehouseIcon}
                >
                  <Typography>Starting</Typography>
                </StepLabel>
              </Step>
              <Step key="to">
                <StepLabel 
                  StepIconComponent={PlaceIcon}
                >
                  <Typography>Destination</Typography>
                </StepLabel>
              </Step>
            </Stepper>
            <Typography sx={{ my: 2 }}>{`Deliver from: ${assigned.addressFrom}`}</Typography>
            <Typography sx={{ my: 2 }}>{`Destination: ${assigned.addressTo}`}</Typography>
            
            {assigned.deliveryRequestLineItems.length > 0 &&
            <>
              <Typography variant="h6" sx={{ mt: 5, mb: 1, textAlign: 'left' }}>Revenue Line Items</Typography>
              <DataGrid
                rows={assigned.deliveryRequestLineItems}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
              />
            </>}
          </>
          : <Typography>No Assigned Delivery Request</Typography>
          }
          {/* {assigned && <Progress />} */}
        </Box>
      </CardContent>
    </Card>
  );
};
