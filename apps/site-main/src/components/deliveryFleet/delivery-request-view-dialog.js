import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
  } from '@mui/material';
  import { DataGrid, GridToolbar } from '@mui/x-data-grid';
  import { useEffect, useState } from 'react';
  import { fetchVehicle } from '../../helpers/deliveryFleet';
  
  export const DeliveryRequestViewDialog = (props) => {
  
    const { 
      open, 
      selectedVehicle,
      handleClose, 
    } = props;
  
    const [deliveryRequests, setRowsDeliveryRequests] = useState([]);
  
    const getDeliveryRequests = async () => {
      const response = await fetchVehicle(selectedVehicle?.id);
      const deliveryRequests = response?.deliveryRequests;
      setRowsDeliveryRequests(deliveryRequests);
    };
  
    useEffect(() => {
        getDeliveryRequests();
    }, [open]);
  
    useEffect(() => {
      console.log(deliveryRequests);
    }, [deliveryRequests]);
  
    const columns = [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
      },
      {
        field: 'addressTo',
        headerName: 'Address To',
        flex: 2,
      },
      {
        field: 'addressFrom',
        headerName: 'Address From',
        flex: 2,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
      },
      ];
    
    const onClose = () => {
        handleClose();
      };
  
    return (
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>{`Delivery Requests Overview`}</DialogTitle>
        <DialogContent>
        {deliveryRequests?.length > 0 ? (
          <Box
            sx={{ mt: 2 }}
          >
            <Typography>Delivery Requests</Typography>
            <DataGrid
              autoHeight
              rows={deliveryRequests}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              components={{
                Toolbar: GridToolbar,
              }}
              disableSelectionOnClick
            /> 
          </Box>
          ) : (
            <Card
              variant="outlined"
              sx={{
                textAlign: 'center',
              }}
            >
              <CardContent>
                <Typography>{`No Delivery Requests Found`}</Typography>
              </CardContent>
            </Card>
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Back</Button>
        </DialogActions>
      </Dialog>
    );
  };
  