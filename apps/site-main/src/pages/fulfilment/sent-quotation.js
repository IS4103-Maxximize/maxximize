import { Box, Card, Container, IconButton } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { NotificationAlert } from '../../components/notification-alert';
import { useNavigate } from 'react-router-dom';
import { SentQuotationConfirmDialog } from '../../components/fulfilment/sent-quotations/sent-quotation-confirm-dialog';
import DayJS from 'dayjs';
import { SentQuotationMenu } from '../../components/fulfilment/sent-quotations/sent-quotation-menu';
import { SentQuotationDialog } from '../../components/fulfilment/sent-quotations/sent-quotation-dialog';
import { Toolbar } from '../../components/toolbar';

const SentQuotation = () => {
  const [sentQuotations, setSentQuotations] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of sent quotations, initial
  useEffect(() => {
    retrieveAllSentQuotations();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all sent quotations
  const retrieveAllSentQuotations = async () => {
    const response = await fetch(
      `http://localhost:3000/api/quotations/sent/${organisationId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setSentQuotations(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  // Menu Helpers
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setSelectedRow(params.row);
          handleMenuClick(event);
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
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleFormDialogOpen = () => {
    setFormDialogOpen(true);
  };
  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
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
      field: 'receivingOrganisationId',
      headerName: 'Recipient ID',
      width: 200,
      flex: 2,
    },
    {
      field: 'recipientName',
      headerName: 'Recipient Name',
      flex: 3,
      valueGetter: (params) => {
        return params.row.receivingOrganisation?.name;
      },
    },
    {
      field: 'created',
      headerName: 'Date Sent',
      width: 200,
      flex: 3,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'leadTime',
      headerName: 'Lead Time',
      width: 150,
      flex: 1,
    },
    {
      field: 'totalPrice',
      headerName: 'Quotation Total Price',
      width: 150,
      flex: 2,
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
      <SentQuotationMenu
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        handleMenuClose={handleMenuClose}
        handleFormDialogOpen={handleFormDialogOpen}
      />
      <SentQuotationDialog
        open={formDialogOpen}
        handleClose={handleFormDialogClose}
        quotation={selectedRow}
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
          <Toolbar
            key="sent-quotation"
            name={'Sent Quotation'}
            numRows={selectedRows.length}
            deleteDisabled={null}
            handleSearch={handleSearch}
            handleAdd={null}
            handleFormDialogOpen={null}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
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
                        row.receivingOrganisation?.id
                          .toString()
                          .includes(search) ||
                        row.receivingOrganisation?.name
                          .toLowerCase()
                          .includes(search)
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
                  //   checkboxSelection
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
