import { React, useState, useEffect } from 'react';
import { Card, Box, Alert, Collapse, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import GroupsIcon from '@mui/icons-material/Groups';
import { OnboardBusinessPartner } from './onboard-business-partner-dialog';

export const RetailersList = () => {
  const [retailers, setRetailers] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [successAlertContent, setSuccessAlertContent] = useState('');
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlertContent, setErrorAlertContent] = useState('');
  const [selectionModel, setSelectionModel] = useState([]);

  useEffect(() => {
    retrieveRetailers();
  }, []);

  const retrieveRetailers = async () => {
    const retailersList = await fetch(
      'http://localhost:3000/api/shell-organisations'
      
    );
    const queries = await retailersList.json();
    const result = queries.filter( query => query.type === 'supplier');
    const flattenResult = result.map((r) => flattenObj(r));
    setRetailers(flattenResult);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const addOrganisation = (retailer) => {
    try {
      const updatedRetailers = [...retailers, retailer];

      setRetailers(updatedRetailers);
    } catch {
      console.log('An erorr occured please try again later');
    }
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
      `http://localhost:3000/api/shell-organisations/:id/${updatedRow.id}`,
      requestOptions
    )
      .then((response) => {
        setSuccessAlertContent(`Updated Business Partner Details ${updatedRow.id} successfully!`);
        setSuccessAlert(true);
      })
      .catch((error) => {
        setErrorAlertContent(`Update for Business Partner ${updatedRow.id} failed!`);
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
        `http://localhost:3000/api/shell-organisations/:id/${currentId}`,
        requestOptions
      )
        .then(() => {
          setSuccessAlertContent(`Deleted Business Partner successfully!`);
          setSuccessAlert(true);
        })
        .catch((error) => {
          setErrorAlertContent(`Error in Deleting Business Partner!`);
          setErrorAlert(true);
        });
    });

    setRetailers((result) =>
      result.filter((retailer) => !selectedIds.has(retailer.id))
    );
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Retailer ID',
      width: 150,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    {
        field: 'uen',
        headerName: 'UEN',
        width: 200,
      },
    {
      field: 'isActive',
      headerName: 'Activity Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Active', 'Inactive'],
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
    {
      field: 'postalCode',
      headerName: 'Postal Code',
      width: 200,
      editable: true,
    },

  ];

  const rows = retailers;

  return (
    <>
      <Box mb={2} sx={{ m: 1 }} display="flex" justifyContent="space-between">
      
      </Box>
        <Tooltip title={'Delete Retailer (Single/Multiple)'}>
          <IconButton
            onClick={() => {
              const selectedIds = new Set(selectionModel);
              console.log(selectedIds);
              if (selectedIds.size == 0) {
                setErrorAlertContent(`No Supplier selected`);
                setErrorAlert(true);
              } else {
                handleDelete(selectedIds);
              }
            }}
          />
        </Tooltip>
        
        <Box>
          <Tooltip title={'Add new retailer'}>
            <IconButton onClick={handleOpenDialog}>
              <GroupsIcon />
            </IconButton>
          </Tooltip>

          <OnboardBusinessPartner
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            addOrganisation={addOrganisation}
            type='retailer'
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
  )};

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