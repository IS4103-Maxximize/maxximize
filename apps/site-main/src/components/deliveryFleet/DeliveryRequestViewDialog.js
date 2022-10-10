import {
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
    const { open, selectedVehicle, handleClose } = props;
  
    const user = JSON.parse(localStorage.getItem('user'));
  
    const onClose = () => {
      handleClose();
    };
    // DataGrid Helpers
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
  
    const getDeliveryRequests = async () => {
      const vehicle = await fetchVehicle(
        selectedVehicle?.id
      );
      const deliveryRequests = vehicle.deliveryRequests;
      setRows(deliveryRequests);
    };
  
    useEffect(() => {
      getDeliveryRequests();
    }, [open]);
  
    useEffect(() => {
      console.log(rows);
    }, [rows]);
  
    const columns = [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
      },
      {
        field: 'addressFrom',
        headerName: 'Address From: ',
        flex: 1,
      },
      {
        field: 'addressTo',
        headerName: 'Address To:',
        flex: 1,
      },
      {
        field: 'dateCreated',
        headerName: 'DateCreated',
        flex: 1,
        valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
      },
    ];
  
    return (
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>{`Delivery Request Overview`}</DialogTitle>
        <DialogContent>
          {rows?.length > 0 ? (
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              components={{
                Toolbar: GridToolbar,
              }}
              onSelectionModelChange={(ids) => {
                setSelectedRows(ids);
              }}
            />
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
          <Card />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Back</Button>
        </DialogActions>
      </Dialog>
    );
  };
  