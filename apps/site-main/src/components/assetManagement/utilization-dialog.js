import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { fetchUtilizationRates } from '../../helpers/assetManagement';
import { perc2color } from '../../helpers/constants';

export const UtilizationDialog = (props) => {
  const { 
    open,
    productionLine,
    handleClose,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));

  const onClose = () => {
    handleClose();
  };

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const getUtilizationRates = async () => {
    await fetchUtilizationRates(productionLine?.id)
      .then(res => {
        const utilizationRates = Object.entries(res).map((value, index) => {
          return {
            id: index,
            date: value[0],
            utilization: value[1]
          };
        })
        setRows(utilizationRates);
      })
      .catch((err) => handleAlertOpen('Failed to fetch Utilization Rates', 'error'))
  };

  useEffect(() => {
    if (open) {
      getUtilizationRates();
    }
  }, [open]);

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
    },
    {
      field: 'utilization',
      headerName: 'Utilization',
      flex: 1,
      // valueFormatter: (params) => {
      //   return params.value?.toFixed(2);
      // },
      renderCell: (params) => (
        <Stack 
          direction="row"
          spacing={2}
        >
          <Typography>{`${params.value?.toFixed(2)}%`}</Typography>
          <ViewTimelineIcon
            sx={{ color: perc2color('production-line', params.row) }}
          />
        </Stack>
      )
    },
  ];

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{`Production Line Utilization Rate`}</DialogTitle>
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
              <Typography>{`No Utilizations Found`}</Typography>
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
