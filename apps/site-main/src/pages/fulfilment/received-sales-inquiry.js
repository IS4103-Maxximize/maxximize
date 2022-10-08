import { Box, Card, Container, IconButton } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { NotificationAlert } from '../../components/notification-alert';
import { ReceivedSalesInquiryToolbar } from '../../components/fulfilment/received-sales-inquiry/received-si-toolbar';
import { ReceivedSalesInquiryConfirmDialog } from '../../components/fulfilment/received-sales-inquiry/received-si-confirm-dialog';
import { ReplyQuotationDialog } from '../../components/fulfilment/received-sales-inquiry/reply-quotation-dialog';
import DayJS from 'dayjs';

const ReceivedSalesInquiry = () => {
  const [receivedSalesInquiry, setReceivedSalesInquiry] = useState([
    {
      id: 1,
      dateReceived: '05/10/2022 03:00PM',
      inquirer: 'Testing Manufacturer',
      totalPrice: '$1500',
      status: 'Awaiting Response',
    },
    {
      id: 2,
      dateReceived: '06/10/2022 11:27AM',
      inquirer: 'Testing Manufacturer 2',
      totalPrice: '$10000',
      status: 'Awaiting Response',
    },
  ]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of sales inquiries, initial
  useEffect(() => {
    retrieveAllReceivedSalesInquiry();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all incoming sales inquiries
  const retrieveAllReceivedSalesInquiry = async () => {
    const response = await fetch(
      `http://localhost:3000/api/sales-inquiry/all/${organisationId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setReceivedSalesInquiry(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Action Menu
  //   const [anchorElUpdate, setAnchorElUpdate] = useState(null);
  //   const actionMenuOpen = Boolean(anchorElUpdate);
  //   const handleActionMenuClick = (event) => {
  //     setAnchorElUpdate(event.currentTarget);
  //   };
  //   const handleActionMenuClose = () => {
  //     setAnchorElUpdate(null);
  //   };

  //   const menuButton = (params) => {
  //     return (
  //       <IconButton
  //         // disabled={params.row.bins?.length == 0}
  //         onClick={(event) => {
  //           setSelectedRow(params.row);
  //           handleActionMenuClick(event);
  //         }}
  //       >
  //         <MoreVert />
  //       </IconButton>
  //     );
  //   };

  // Reply button
  const replyButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setSelectedRow(params.row);
          handleClickOpen();
        }}
      >
        <SendIcon color="primary" />
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
  const [replyQuotationDialogOpen, setReplyQuotationDialogOpen] =
    useState(false);

  const handleClickOpen = () => {
    setReplyQuotationDialogOpen(true);
  };

  const handleReplyQuotationDialogClose = () => {
    setReplyQuotationDialogOpen(false);
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
  const handleDelete = async (selectedIds) => {
    const requestOptions = {
      method: 'DELETE',
    };

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
      field: 'created',
      headerName: 'Date Received',
      width: 70,
      flex: 3,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'inquirer',
      headerName: 'Inquirer',
      width: 200,
      flex: 4,
      //TODO
      valueGetter: (params) => {
        return params.row ? params.row.currentOrganisation?.name : '';
      },
    },
    {
      field: 'totalPrice',
      headerName: 'Total Price',
      width: 200,
      flex: 2,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      flex: 2,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      flex: 1,
      renderCell: replyButton,
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = receivedSalesInquiry;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Received Sales Inquiry | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <ReceivedSalesInquiryConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Reject Sales Inquiry(s)`}
        dialogContent={`Confirm rejection of sales inquiry(s)?`}
        dialogAction={() => {
          handleDelete(selectedRows);
        }}
      />
      <ReplyQuotationDialog
        open={replyQuotationDialogOpen}
        handleClose={handleReplyQuotationDialogClose}
        salesInquiry={selectedRow}
        handleAlertOpen={handleAlertOpen}
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
          <ReceivedSalesInquiryToolbar
            disabled={disabled}
            numSalesInquiry={selectedRows.length}
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
                        row.inquirer.toLowerCase().includes(search)
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

export default ReceivedSalesInquiry;
