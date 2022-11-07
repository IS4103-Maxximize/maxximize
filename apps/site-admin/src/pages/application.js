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
import { ApplicationMenu } from '../components/client/application/application-menu';
import MoreVert from '@mui/icons-material/MoreVert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ApplicationDialog } from '../components/client/application/application-dialog';
import { Toolbar } from '../components/toolbar';

const Application = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [applications, setApplications] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => retrieveAllApplications, []);

  //Retrieve all incoming sales inquiries
  const retrieveAllApplications = async () => {
    const response = await fetch(`http://localhost:3000/api/applications`);
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setApplications(result);
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
    return params.row.status === 'pending' ? (
      <IconButton
        // disabled={params.row.bins?.length == 0}
        onClick={(event) => {
          setSelectedRow(params.row);
          handleActionMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    ) : (
      <></>
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

  // Dialog helpers
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setApplicationDialogOpen(true);
  };

  const handleDialogClose = () => {
    setApplicationDialogOpen(false);
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
  //Rejecting a sales inquiry
  //Also alerts user of ourcome
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
      retrieveAllApplications();
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
        return params.row ? params.row.organisationName : '';
      },
    },
    {
      field: 'orgPhoneNumber',
      headerName: 'Contact',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.orgPhoneNumber : '';
      },
    },
    {
      field: 'orgEmail',
      headerName: 'Email',
      flex: 4,
      valueGetter: (params) => {
        return params.row ? params.row.orgEmail : '';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.status : '';
      },
      valueFormatter: (params) => {
        const valueFormatted =
          params.value[0].toUpperCase() + params.value.slice(1);
        return `${valueFormatted}`;
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
  const rows = applications;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Applications | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <ApplicationMenu
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        handleMenuClose={handleMenuClose}
        handleDialogOpen={handleDialogOpen}
      />
      <ApplicationDialog
        open={applicationDialogOpen}
        handleClose={handleDialogClose}
        application={selectedRow}
        handleAlertOpen={handleAlertOpen}
        retrieveAllApplications={retrieveAllApplications}
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
            key="application"
            name={'Application'}
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
                        row.organisationName.toLowerCase().includes(search) ||
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

export default Application;
