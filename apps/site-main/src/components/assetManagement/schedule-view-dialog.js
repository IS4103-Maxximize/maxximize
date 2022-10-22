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
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { fetchProductionLine } from '../../helpers/assetManagement';

export const ScheduleViewDialog = (props) => {

  const { 
    open, 
    selectedProductionLine,
    handleClose, 
  } = props;

  const [plannedSchedules, setRowsPlanned] = useState([]);
  const [ongoingSchedules, setRowsOngoing] = useState([]);


  const getSchedule = async () => {
    const response = await fetchProductionLine(selectedProductionLine?.id);
    const scheduleResponse = response?.schedules;
    const plannedSchedules = scheduleResponse?.filter(schedule => schedule.status === 'planned');
    setRowsPlanned(plannedSchedules);
     const ongoingSchedules = scheduleResponse?.filter(schedule => schedule.status === 'ongoing');
     setRowsOngoing(ongoingSchedules);

  };

  useEffect(() => {
    getSchedule();
  }, [open]);

  useEffect(() => {
    console.log(plannedSchedules);
  }, [plannedSchedules]);

  useEffect(() => {
    console.log(ongoingSchedules);
  }, [ongoingSchedules]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'start',
      headerName: 'Start',
      flex: 2,
      valueFormatter: (params) => {
        return DayJS(params.value).format('DD MMM YYYY hh:mm a')
      }
    },
    {
      field: 'end',
      headerName: 'End',
      flex: 2,
      valueFormatter: (params) => {
        return DayJS(params.value).format('DD MMM YYYY hh:mm a')
      }
    },
    {
      field: 'status',
      headerName: 'status',
      flex: 1,
    },
    {
      field: 'productionLineId',
      headerName: 'Prod. Line Id',
      flex: 1,
    },
    ];
  
  const onClose = () => {
      handleClose();
    };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{`Schedule Overview`}</DialogTitle>
      <DialogContent>
      {ongoingSchedules?.length > 0 ? (
        <Box
          sx={{ mt: 2 }}
        >
          <Typography>Ongoing Schedules</Typography>
          <DataGrid
            autoHeight
            rows={ongoingSchedules}
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
              <Typography>{`No Ongoing Schedule Found`}</Typography>
            </CardContent>
          </Card>
        )}

        {plannedSchedules?.length > 0 ? (
          <Box
            sx={{ mt: 2 }}
          >
            <Typography>Planned Schedules</Typography>
            <DataGrid
              autoHeight
              rows={plannedSchedules}
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
              <Typography>{`No Planned Schedule Found`}</Typography>
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
