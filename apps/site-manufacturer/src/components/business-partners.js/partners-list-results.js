import { useState, useEffect } from 'react';
import { Card, Box, Alert, Collapse, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export const PartnersListResults = () => {
  const [partners, setPartners] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [successAlertContent, setSuccessAlertContent] = useState('');
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlertContent, setErrorAlertContent] = useState('');
  const [selectionModel, setSelectionModel] = useState([]);

  useEffect(() => {
    retrieveAllPartners();
  }, []);

  const retrieveAllPartners = async () => {
    const partnersList = await fetch(
      'http://localhost:3000/api/organisations'
    );
    const result = await partnersList.json();

    setPartners(result);
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
      `http://localhost:3000/api/organisations/:id/${updatedRow.id}`,
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
        `http://localhost:3000/api/organisations/:id/${currentId}`,
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

    setPartners((result) =>
      result.filter((partner) => !selectedIds.has(partner.id))
    );
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Business Partner ID',
      width: 150,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    {
      field: 'isActive',
      headerName: 'Organisation Activity Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Active', 'Inactive'],
    },
    {
      field: 'type',
      headerName: 'Organisation Type',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Supplier', 'Retailer'],
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

  const rows = partners;

  return (
    <>
      <Box mb={2} sx={{ m: 1 }}>
        <Tooltip title={'Delete Business Partner (Single/Multiple)'}>
          <IconButton
            onClick={() => {
              const selectedIds = new Set(selectionModel);
              console.log(selectedIds);
              if (selectedIds.size == 0) {
                setErrorAlertContent(`No Business Partner selected`);
                setErrorAlert(true);
              } else {
                handleDelete(selectedIds);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>

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
