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
import { fetchProductionLine } from '../../helpers/assetManagement';

export const ScheduleViewDialog = (props) => {

  const { 
    open, 
    selectedProductionLine,
    handleClose, 
  } = props;

  const [completedSchedules, setRowsCompleted] = useState([]);
  const [ongoingSchedules, setRowsOngoing] = useState([]);

  const scheduleResponse=[];

  const getSchedule = async () => {
    const response = await fetchProductionLine(selectedProductionLine?.id);
    const scheduleResponse = response?.schedules;
    const completedSchedules = scheduleResponse?.filter(schedule => schedule.status === 'completed');
     setRowsCompleted(completedSchedules);
     const ongoingSchedules = scheduleResponse?.filter(schedule => schedule.status === 'ongoing');
     setRowsOngoing(ongoingSchedules);

  };

  useEffect(() => {
    getSchedule();
  }, [open]);

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
        flex: 1,
      },
      {
        field: 'start',
        headerName: 'Start Date',
        flex: 1,
      },
      {
        field: 'end',
        headerName: 'End Date',
        flex: 1,
      },
      {
          field: 'status',
          headerName: 'status',
          flex: 1,
      },
      {
        field: 'productionLineId',
        headerName: 'Production Line Id',
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
              /> 
              ): (
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

              {completedSchedules?.length > 0 ? (
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
                    <Typography>{`No Completed Schedule Found`}</Typography>
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
