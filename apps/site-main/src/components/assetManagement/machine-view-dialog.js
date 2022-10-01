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
  
  const user = JSON.parse(localStorage.getItem('user'));
  export const MachineViewDialog = (props) => {
   
    const {
    open,
    selectedProductionLine,
    handleClose,
  } = props;

  const onClose = () => {
    handleClose();
  }
    // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const getMachines = async () => {
    const productionLine = await fetchProductionLine(selectedProductionLine?.id);
    const machines = productionLine.machines;
    setRows(machines);
  };

  useEffect(() => {
    getMachines();
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
            field: 'serialNumber',
            headerName: 'Serial Number',
            flex: 1,
          },
          {
              field: 'description',
              headerName: 'Description',
              flex: 1,
            },
          {
              field: 'make',
              headerName: 'Make',
              flex: 1,
            },
          {
              field: 'model',
              headerName: 'Model',
              flex: 1,
            },
          {
              field: 'year',
              headerName: 'Year',
              flex: 1,
            },
          {
              field: 'lastServiced',
              headerName: 'Last Serviced',
              flex: 1,
            },
          {
            field: 'isOperating',
            headerName: 'Status',
            flex: 1,
          },
          {
            field: 'remarks',
            headerName: 'Remarks',
            flex: 1,
          },
      
      ];
  
    return (
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>{`Machine Overview`}</DialogTitle>
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
                /> ): (
                  <Card
                    variant="outlined"
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    <CardContent>
                      <Typography>{`No Machine Found`}</Typography>
                    </CardContent>
                  </Card>
                )}
                  <Card/>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Back</Button>
        </DialogActions>
      </Dialog>
    );
  };
  