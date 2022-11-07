import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { NotificationAlert } from '../components/notification-alert';
import MoreVert from '@mui/icons-material/MoreVert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Toolbar } from '../components/toolbar';
import { OrganisationManagementMenu } from '../components/client/organisation-management/organisation-management-menu';
import { OrganisationDetailsDialog } from '../components/client/organisation-management/organisation-details-dialog';
import { SubscriptionDialog } from '../components/client/organisation-management/subscription-dialog';
import { InvoiceDialog } from '../components/client/organisation-management/invoice-dialog';

const OrganisationManagement = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [organisations, setOrganisations] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => retrieveAllOrganisations, []);

  //Retrieve all incoming sales inquiries
  const retrieveAllOrganisations = async () => {
    const response = await fetch(`http://localhost:3000/api/organisations`);
    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
      result = result.filter(
        (organisation) => organisation.uen !== '999999999'
      );
    }

    setOrganisations(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Action Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleActionMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
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

  // Org Details Dialog helpers
  const [organisationDialogOpen, setOrganisationDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setOrganisationDialogOpen(true);
  };

  const handleDialogClose = () => {
    setOrganisationDialogOpen(false);
  };

  // Subscription Dialog helpers
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);

  const handleSubscriptionDialogOpen = () => {
    setSubscriptionDialogOpen(true);
  };

  const handleSubscriptionDialogClose = () => {
    setSubscriptionDialogOpen(false);
  };

  // Invoice Dialog helpers
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const handleInvoiceDialogOpen = () => {
    setInvoiceDialogOpen(true);
  };

  const handleInvoiceDialogClose = () => {
    setInvoiceDialogOpen(false);
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
  const handleReject = async (selectedRow) => {
    const requestOptions = {
      method: 'PATCH',
    };

    console.log(selectedRow);

    const response = await fetch(
      `http://localhost:3000/api/sales-inquiry/${selectedRow.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      handleAlertOpen(`Rejected Sales Inquiry ${result.id}`);
      retrieveAllOrganisations();
    } else {
      const result = await response.json();
      handleAlertOpen(
        `Error rejecting Sales Inquiry ${result.id}. ${result.message}`,
        'error'
      );
    }
  };

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'uen',
      headerName: 'UEN',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.uen : '';
      },
    },
    {
      field: 'organisationName',
      headerName: 'Company',
      flex: 4,
      valueGetter: (params) => {
        return params.row ? params.row.name : '';
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.type : '';
      },
      valueFormatter: (params) => {
        const valueFormatted =
          params.value[0].toUpperCase() + params.value.slice(1);
        return `${valueFormatted}`;
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 2,
      valueGetter: (params) => {
        return params.row.isActive ? 'Active' : 'Inactive';
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1.5,
      renderCell: menuButton,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = organisations;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Organisations Management | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <OrganisationManagementMenu
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        handleMenuClose={handleMenuClose}
        handleDialogOpen={handleDialogOpen}
        handleSubscriptionDialogOpen={handleSubscriptionDialogOpen}
        handleInvoiceDialogOpen={handleInvoiceDialogOpen}
      />
      <OrganisationDetailsDialog
        open={organisationDialogOpen}
        handleClose={handleDialogClose}
        organisation={selectedRow}
        handleAlertOpen={handleAlertOpen}
        retrieveAllOrganisations={retrieveAllOrganisations}
      />
      <SubscriptionDialog
        open={subscriptionDialogOpen}
        handleClose={handleSubscriptionDialogClose}
        organisation={selectedRow}
      />
      <InvoiceDialog
        open={invoiceDialogOpen}
        handleClose={handleInvoiceDialogClose}
        organisation={selectedRow}
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
            key="organisation-management"
            name={'Organisation Management'}
            numRows={null}
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
                        row.name.toLowerCase().includes(search) ||
                        row.uen.toLowerCase().includes(search)
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
                  //   bulkActionButtons={false}
                  //   onSelectionModelChange={(ids) => {
                  //     setSelectedRows(ids);
                  //   }}
                />
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OrganisationManagement;
