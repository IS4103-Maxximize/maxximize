import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { apiHost, requestOptionsHelper } from '../../helpers/constants';

export const Deliveries = (props) => {
  const {
    assigned,
    deliveries,
    getDeliveries,
    handleAlertOpen,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'))
  const organisationId = user.organisation?.id;
  const theme = useTheme();

  const updateDelivery = async (newStatus) => {
    const url = `${apiHost}/delivery-requests/${assigned.id}`;
    const body = JSON.stringify({ status: newStatus });
    const requestOptions = requestOptionsHelper('PATCH', body);

    await fetch(url, requestOptions).then(res => res.json())
      .then(result => {
        handleAlertOpen('Successfully Updated Delivery!', 'success');
        getDeliveries();
      })
      .catch(err => handleAlertOpen('Failed to update Delivery', 'error'));
  }

  // Columns for Completed Delivery Requests
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1
    },
    {
      field: 'addressFrom',
      headerName: 'Deliver From',
      flex: 1
    },
    {
      field: 'addressTo',
      headerName: 'Destination Address',
      flex: 1
    },
  ]

  return (
    <Card>
      <CardHeader
        action={
          <Box>
            {assigned && assigned.status === 'readytodeliver' && 
            <Button
              endIcon={<PlayArrowIcon fontSize="small" />}
              size="small"
              variant="contained"
              onClick={() => updateDelivery('outfordelivery')}
            >
              Start Delivery
            </Button>}
            {assigned && assigned.status === 'outfordelivery' && 
            <Button
              endIcon={<CheckIcon fontSize="small" />}
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => updateDelivery('completed')}
            >
              Complete Delivery
            </Button>}
          </Box>}
        title="Pending Delivery Request"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative',
            textAlign: 'center'
          }}
        >
          {deliveries.length > 0 ?
          <DataGrid 
            rows={deliveries}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
          : 
          <Typography 
            variant="h6"
          >
            {`No Delivery Requests Found`}
          </Typography>}
        </Box>
      </CardContent>
    </Card>
  );
};
