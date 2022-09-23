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
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { apiHost, headers } from '../../helpers/constants';
import { fetchSchedule } from '../../helpers/assetManagement';

export const ScheduleViewDialog = (props) => {

// DataGrid Helpers
  const [completedSchedules, setRowsCompleted] = useState([]);
  const [ongoingSchedules, setRowsOngoing] = useState([]);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getSchedule = async () => {
    const schedules = fetchSchedule();
    const completedSchedules = schedules.filter(schedule => schedule.status =="Completed");
     setRowsCompleted(completedSchedules);
     const ongoingSchedules = schedules.filter(schedule => schedule.status =="Ongoing");
     setRowsOngoing(ongoingSchedules);

  };

  useEffect(() => {
    getSchedule();
  }, []);

  useEffect(() => {
    console.log(completedSchedules);
  }, [completedSchedules]);

  useEffect(() => {
    console.log(ongoingSchedules);
  }, [ongoingSchedules]);

  const columns = [
    {
        field: 'id',
        headerName: 'ID',
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        width: 300,
      },
      {
        field: 'endDate',
        headerName: 'End Date',
        width: 300,
      },
      {
          field: 'status',
          headerName: 'status',
          width: 300,
      },
      {
        field: 'productionOrderId',
        headerName: 'Production Order Id',
        width: 300,
        valueGetter: (params) => {
            return params.row.productionLine ? params.row.productionLine.id : ''
        },
      },
    ];
  
  const onClose = () => {
      handleClose();
    };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{`Schedule Overview`}</DialogTitle>
      <DialogContent>
      {ongoingSchedules.length > 0 ? (
              <DataGrid
                autoHeight
                rows={ongoingSchedules}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                components={{
                  Toolbar: GridToolbar,
                }}
                onSelectionModelChange={(ids) => {
                  setRowsOngoing(ids);
                }}
                experimentalFeatures={{ newEditingApi: true }}
              /> 
              ): (
                <Card
                  variant="outlined"
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <CardContent>
                    <Typography>{`No Schedule Found`}</Typography>
                  </CardContent>
                </Card>
              )}

              {completedSchedules.length > 0 ? (
                <DataGrid
                  autoHeight
                  rows={completedSchedules}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  onSelectionModelChange={(ids) => {
                    setRowsCompleted(ids);
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
                    <Typography>{`No Schedule Found`}</Typography>
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
