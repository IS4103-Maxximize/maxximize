import { useState, useEffect } from 'react';
import { Card, Box, Alert, Collapse, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CreateMachine } from './create-machine';

export const MachineListResults = () => {
  const [machines, setMachines] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [successAlertContent, setSuccessAlertContent] = useState('');
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlertContent, setErrorAlertContent] = useState('');
  const [selectionModel, setSelectionModel] = useState([]);

  useEffect(() => {
    retrieveAllMachines();
  }, []);

  //
  const retrieveAllMachines = async () => {
    const machinesList = await fetch(
      'http://localhost:3000/api/vehicles/findAllUsers'
    );
    const result = await machinesList.json();

    setMachines(result);
  };

  const addMachine = (machine) => {
    const updatedMachines = [...machines, machine];
    setMachines(updatedMachines);
  };


  const handleRowUpdate = (newRow) => {
    console.log(newRow);
    const updatedRow = { ...newRow };

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify(updatedRow);

    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `http://localhost:3000/api/vehicles/updateVehicle/${updatedRow.id}`,
      requestOptions
    )
      .then((response) => {
        setSuccessAlertContent(`Updated Machine ${updatedRow.id} successfully!`);
        setSuccessAlert(true);
      })
      .catch((error) => {
        setErrorAlertContent(`Update for Machine ${updatedRow.id} failed!`);
        setErrorAlert(true);
      });

    return updatedRow;
  };


  const handleDelete = (selectedIds) => {
    console.log('handling delete');
    console.log(selectedIds);

    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    selectedIds.forEach((currentId) => {
      console.log(currentId);
      fetch(
        `http://localhost:3000/api/users/deleteMachine/${currentId}`,
        requestOptions
      )
        .then(() => {
          setSuccessAlertContent(`Deleted Machine successfully!`);
          setSuccessAlert(true);
        })
        .catch((error) => {
          setErrorAlertContent(`Error in Deleting Machine!`);
          setErrorAlert(true);
        });
    });

    setMachines((result) =>
      result.filter((machine) => !selectedIds.has(machine.id))
    );
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };


  const columns = [
    {
      field: 'id',
      headerName: 'Machine ID',
      width: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
    },
    {
      field: 'make',
      headerName: 'Make',
      width: 150,
    },
    {
      field: 'lastServiced',
      headerName: 'Last Serviced',
      width: 200,
      editable: true,
    },
    {
      field: 'start',
      headerName: 'Start',
      width: 150,
      editable: true,
    },
    {
      field: 'end',
      headerName: 'End',
      width: 200,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Schedule Type',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['maintenance', 'available', 'reconfiguration', 'delivery'],
    },
    {
      field: 'temperature',
      headerName: 'Temperature',
      width: 150,
      editable: true,
    },
    {
      field: 'humidity',
      headerName: 'Humidity',
      width: 200,
      editable: true,
    },
  ];

  const rows = machines;

  return (
    <>
      <Box mb={2} sx={{ m: 1 }}>
        <Tooltip title={'Delete Machine Entry (Single/Multiple)'}>
          <IconButton
            onClick={() => {
              const selectedIds = new Set(selectionModel);
              console.log(selectedIds);
              if (selectedIds.size == 0) {
                setErrorAlertContent(`No Machine selected`);
                setErrorAlert(true);
              } else {
                handleDelete(selectedIds);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={'Create Machine Entry'}>
          <IconButton onClick={handleOpenDialog}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>

        <CreateMachine
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          addMachine={addMachine}
        />

        <Tooltip title={'Update entry by clicking on the field to be updated'}>
          <IconButton>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {successAlert ? (
        <Collapse in={successAlert}>
          <Alert
            severity="success"
            onClose={() => {
              setSuccessAlert(false);
            }}
          >
            {successAlertContent}
          </Alert>
        </Collapse>
      ) : (
        <Collapse in={successAlert}>
          <></>
        </Collapse>
      )}

      {errorAlert ? (
        <Collapse in={errorAlert}>
          <Alert
            severity="error"
            onClose={() => {
              setErrorAlert(false);
            }}
          >
            {errorAlertContent}
          </Alert>
        </Collapse>
      ) : (
        <Collapse in={errorAlert}>
          <></>
        </Collapse>
      )}

      <Card>
        <Box sx={{ minWidth: 1050 }}>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            allowSorting={true}
            components={{
              Toolbar: GridToolbar,
            }}
            disableSelectionOnClick
            checkboxSelection={true}
            onSelectionModelChange={(ids) => {
              setSelectionModel(ids);
            }}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={handleRowUpdate}
          />
        </Box>
      </Card>
    </>
  );
};
