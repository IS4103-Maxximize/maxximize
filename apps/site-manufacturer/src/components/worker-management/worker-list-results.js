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

  //Change this to retrieve local storage user organisation Id
  const organisationId = '1';

  //Load in list of workers, initial
  useEffect(() => {
    retrieveAllWorkers();
  }, []);

  //Retrieve all workers
  const retrieveAllWorkers = async () => {
    const workersList = await fetch(
      `http://localhost:3000/api/organisations/getWorkersByOrganisation/${organisationId}`
    );
    const result = await workersList.json();

    const flattenResult = result.map((r) => flattenObj(r));

    setWorkers(flattenResult);
  };

  //Add a new worker entry to the list
  const addWorker = (worker) => {
    try {
      const updatedWorkers = [...workers, worker];

      setWorkers(updatedWorkers);
    } catch {
      console.log('An erorr occured please try again later');
    }
  };

  //Updating a worker entry, calling update API
  //Also alerts user of ourcome
  const handleRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const updatedRowJSON = jsonStructure(updatedRow);

    const raw = JSON.stringify(updatedRowJSON);

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
        setErrorAlertContent(error);
        setErrorAlert(true);
      });

    return updatedRow;
  };

  //Deleting a worker entry, calling update API
  //Also alerts user of ourcome
  const handleDelete = (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    selectedIds.forEach((currentId) => {
      fetch(
        `http://localhost:3000/api/users/deleteUser/${currentId}`,
        requestOptions
      )
        .then(() => {
          setSuccessAlertContent(`Deleted Worker successfully!`);
          setSuccessAlert(true);
        })
        .catch((error) => {
          setErrorAlertContent(error);
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
      field: 'username',
      headerName: 'Username',
      width: 250,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Admin', 'Manager', 'FactoryWorker', 'Driver'],
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
    {
      field: 'address',
      headerName: 'Address',
      width: 500,
      editable: true,
    },
    {
      field: 'postalCode',
      headerName: 'Postal Code',
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

//Helper methods
//Flatten the worker record retrieved
const flattenObj = (obj, parent, res = {}) => {
  for (let key in obj) {
    let propName = key;
    if (typeof obj[key] == 'object') {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};

const jsonStructure = (worker) => {
  const updatedWorkerJSON = {
    id: worker.id,
    firstName: worker.firstName,
    lastName: worker.lastName,
    username: worker.username,
    role: worker.role,
    contact: {
      phoneNumber: worker.phoneNumber,
      email: worker.email,
      address: worker.address,
      postalCode: worker.postalCode,
    },
  };

  return updatedWorkerJSON;
};
