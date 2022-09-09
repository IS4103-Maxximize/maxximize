import { useState, useEffect } from 'react';
import { Card, Box, Alert, Collapse, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CreateWorkerDialog } from './create-worker-dialog';

export const WorkerListResults = () => {
  const [workers, setWorkers] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [successAlertContent, setSuccessAlertContent] = useState('');
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlertContent, setErrorAlertContent] = useState('');
  const [selectionModel, setSelectionModel] = useState([]);

  //Load in list of workers, initial
  useEffect(() => {
    retrieveAllWorkers();
  }, []);

  //Retrieve all workers
  const retrieveAllWorkers = async () => {
    const workersList = await fetch(
      'http://localhost:3000/api/users/findAllUsers'
    );
    const result = await workersList.json();

    setWorkers(result);
  };

  //Add a new worker entry to the list
  const addWorker = (worker) => {
    const updatedWorkers = [...workers, worker];
    setWorkers(updatedWorkers);
  };

  //Updating a worker entry, calling update API
  //Also alerts user of ourcome
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
      `http://localhost:3000/api/users/updateUser/${updatedRow.id}`,
      requestOptions
    )
      .then((response) => {
        setSuccessAlertContent(`Updated Worker ${updatedRow.id} successfully!`);
        setSuccessAlert(true);
      })
      .catch((error) => {
        setErrorAlertContent(`Update for Worker ${updatedRow.id} failed!`);
        setErrorAlert(true);
      });

    return updatedRow;
  };

  //Deleting a worker entry, calling update API
  //Also alerts user of ourcome
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
        `http://localhost:3000/api/users/deleteUser/${currentId}`,
        requestOptions
      )
        .then(() => {
          setSuccessAlertContent(`Deleted Worker successfully!`);
          setSuccessAlert(true);
        })
        .catch((error) => {
          setErrorAlertContent(`Delete Worker failed!`);
          setErrorAlert(true);
        });
    });

    setWorkers((result) =>
      result.filter((worker) => !selectedIds.has(worker.id))
    );
  };

  //Create worker dialog
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'Worker ID',
      width: 150,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 200,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'manager', 'factoryworker', 'driver'],
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      editable: true,
    },
    {
      field: 'phoneNumber',
      headerName: 'Contact',
      width: 150,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: true,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = workers;

  return (
    <>
      <Box mb={2} sx={{ m: 1 }}>
        <Tooltip title={'Delete Worker Entry (Single/Multiple)'}>
          <IconButton
            onClick={() => {
              const selectedIds = new Set(selectionModel);
              console.log(selectedIds);
              if (selectedIds.size == 0) {
                setErrorAlertContent(`No Worker selected`);
                setErrorAlert(true);
              } else {
                handleDelete(selectedIds);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={'Create Worker Entry'}>
          <IconButton onClick={handleOpenDialog}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>

        <CreateWorkerDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          addWorker={addWorker}
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
