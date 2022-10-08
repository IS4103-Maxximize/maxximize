import { Box, Card, Container, IconButton } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { NotificationAlert } from '../../components/notification-alert';
import { useNavigate } from 'react-router-dom';
import { SentQuotationToolbar } from '../../components/fulfilment/sent-quotations/sent-quotation-toolbar';
import { SentQuotationConfirmDialog } from '../../components/fulfilment/sent-quotations/sent-quotation-confirm-dialog';

const SentQuotation = () => {
  const [sentQuotations, setSentQuotations] = useState([
    {
      id: 1,
      dateSent: '06/10/2022 12:20PM',
      recipient: 'Testing Manufacturer',
      quotationTotalPrice: '$2000',
    },
  ]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of warehouses, initial
  useEffect(() => {
    retrieveAllSentQuotations();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all sent quotations
  const retrieveAllSentQuotations = async () => {
    // const response = await fetch(
    //   `http://localhost:3000/api/warehouses/all/${organisationId}`
    // );
    // let result = [];
    // if (response.status == 200 || response.status == 201) {
    //   result = await response.json();
    // }
    // setWarehouses(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Action Menu
  const [anchorElUpdate, setAnchorElUpdate] = useState(null);
  const actionMenuOpen = Boolean(anchorElUpdate);
  const handleActionMenuClick = (event) => {
    setAnchorElUpdate(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setAnchorElUpdate(null);
  };

  const menuButton = (params) => {
    return (
      <IconButton
        // disabled={params.row.bins?.length == 0}
        onClick={(event) => {
          setSelectedRow(params.row);
          handleActionMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  //Alert Notification
  // NotificationAlert helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState();
  const [alertSeverity, setAlertSeverity] = useState('success');
  const handleAlertOpen = (text, severity) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertText(null);
    setAlertSeverity('success');
  };

  // Dialog helpers
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  //Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  //Handle Delete
  //Deleting a sent quotation
  //Also alerts user of ourcome
  const handleDelete = async (selectedIds) => {
    // const requestOptions = {
    //   method: 'DELETE',
    // };
    // selectedIds.forEach((currentId) => {
    //   fetch(`http://localhost:3000/api/warehouses/${currentId}`, requestOptions)
    //     .then(() => {
    //       handleAlertOpen(`Successfully deleted warehouse(s)`, 'success');
    //     })
    //     .catch((error) => {
    //       handleAlertOpen(`Failed to delete warehouse(s):${error}`, 'error');
    //     });
    // });
    // setWarehouses(
    //   warehouses.filter((warehouse) => !selectedIds.includes(warehouse.id))
    // );
  };

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,
    },
    {
      field: 'dateSent',
      headerName: 'Date Sent',
      width: 200,
      flex: 3,
    },
    {
      field: 'recipient',
      headerName: 'Recipient',
      width: 200,
      flex: 4,
    },
    {
      field: 'quotationTotalPrice',
      headerName: 'Quotation Total Price',
      width: 150,
      flex: 4,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      flex: 1,
      renderCell: menuButton,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = sentQuotations;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Sent Quotations | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <SentQuotationConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Delete quotation(s)`}
        dialogContent={`Confirm deletion of quotation(s)?`}
        dialogAction={() => {
          handleDelete(selectedRows);
        }}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <SentQuotationToolbar
            disabled={disabled}
            numSentQuotations={selectedRows.length}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
            handleSearch={handleSearch}
          />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box sx={{ minWidth: 1050 }}>
                <DataGrid
                  autoHeight
                  rows={rows.filter((row) => {
                    if (search === '') {
                      return row;
                    } else {
                      return (
                        row.id.toString().includes(search) ||
                        row.recipient.toLowerCase().includes(search)
                      );
                    }
                  })}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  allowSorting={true}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  disableSelectionOnClick
                  checkboxSelection
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SentQuotation;
