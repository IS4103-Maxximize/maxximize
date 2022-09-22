import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from '@mui/material';
  import { DataGrid } from '@mui/x-data-grid';
  import { useFormik } from 'formik';
  import { useEffect, useState } from 'react';
  import { fetchMachines } from '../../helpers/assetManagement';
  
  export const MachineViewDialog = (props) => {

// DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const getMachines = async () => {
    fetchMachines()
      .then((result) => setRows(result))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getMachines();
  }, []);

  useEffect(() => {
    console.log(rows);
  }, [rows]);


  
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
          },
          {
            field: 'serialNumber',
            headerName: 'Serial Number',
            width: 300,
          },
          {
              field: 'description',
              headerName: 'Description',
              width: 300,
            },
          {
              field: 'make',
              headerName: 'Make',
              width: 300,
            },
          {
              field: 'model',
              headerName: 'Model',
              width: 300,
            },
          {
              field: 'year',
              headerName: 'Year',
              width: 300,
            },
          {
              field: 'lastServiced',
              headerName: 'Last Serviced',
              width: 300,
            },
          {
            field: 'isOperating',
            headerName: 'Status',
            width: 300,
          },
          {
            field: 'remarks',
            headerName: 'Remarks',
            width: 300,
          },
      
      ];
  
    return (
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>{`Machine Overview`}</DialogTitle>
        <DialogContent>
                <DataGrid
                  autoHeight
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                /> 
                    <CardContent>
                      <Typography>{`No Machines Found`}</Typography>
                    </CardContent>
                  <Card/>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Back</Button>
        </DialogActions>
      </Dialog>
    );
  };
  