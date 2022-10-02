import {
  Box,
  Card,
  CardContent,
  Container,
  Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../../components/dashboard-layout';
import { NotificationAlert } from '../../components/notification-alert';
import { CreatePRSalesInquiryDialog } from '../../components/procurement-ordering/create-pr-sales-inquiry-dialog';
import { PurchaseRequisitionToolbar } from '../../components/procurement-ordering/purchase-requisition-toolbar';
import { fetchPurchaseRequistions } from '../../helpers/procurement-ordering/purchase-requisition';
import { mock_prs } from '../../__mocks__/purchase-requisitions';

export const PurchaseRequisition = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Purchase Requisition';

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Selected Row IDs
  const [selectedPRs, setSelectedPRs] = useState([]);

  const getPurchaseRequisitions = async () => {
    fetchPurchaseRequistions(organisationId)
      .then(res => setRows(res))
      .catch(err => handleAlertOpen('Failed to fetch Purchase Requisitions', 'error'))
  };

  useEffect(() => {
    // get Purchase Requisitions
    setLoading(true);
    getPurchaseRequisitions();
  }, []);

  useEffect(() => {
	console.log(rows)
  }, [rows] )

  useEffect(() => {
    // show page after fetching data
    // console.log(rows);
    setLoading(false);
  }, [rows]);


  // Alert Helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error'); // success || error
  const [alertText, setAlertText] = useState('');
  const handleAlertOpen = (text, severity) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };


  // Toolbar Helpers
  // Searchbar
  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };
  // Add Button
  const handleAddClick = () => {
    setSelectedPRs(rows.filter(row => selectedRows.includes(row.id)));
  };
  // Delete Button
  const deleteDisabled = Boolean(selectedRows.length === 0);


  // Create Dialog Helpers
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  useEffect(() => {
    if (!createDialogOpen) {
      setLoading(true);
      getPurchaseRequisitions();
    }
    if (createDialogOpen) {
      // console.log(selectedRow);
      // setSelectedPRs([]);
    }
  }, [createDialogOpen]);


  // ConfirmDialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // CRUD handlerss
  const handleDelete = async (ids) => {
    setSelectedRows([]);
    // deleteProductionOrders(ids)
    //   .then(() => handleAlertOpen('Successfully deleted Production Order(s)!', 'success'))
    //   .then(() => getProdOrders());
  };

  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'prodOrderId',
      headerName: 'Prod. Order ID',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.productionLineItem?.productionOrder.id : '';
      }
    },
    {
      field: 'createdDateTime',
      headerName: 'Date Created',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? dayjs(params.row.created).format('DD MMM YYYY') : '';
      }
    },
    {
      field: 'rawMaterial',
      headerName: 'Raw Material',
      flex: 2,
      valueGetter: (params) => {
        return params.row.rawMaterial ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}]` : '';
      }
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row.rawMaterial ? params.row.rawMaterial.unit : '';
      }
    },
    {
      field: 'expectedQuantity',
      headerName: 'Expected Qty',
      flex: 1,
    },
    {
      field: 'quantityToFulfill',
      headerName: 'To Fulfill',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    // {
    //   field: 'actions',
    //   headerName: '',
    //   flex: 1,
    //   renderCell: menuButton,
    // },
  ];

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${name} | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <NotificationAlert
            key="notification-alert"
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <PurchaseRequisitionToolbar
            key="toolbar"
            name={name}
            numRows={selectedRows.length}
            deleteDisabled={deleteDisabled}
            handleSearch={handleSearch}
            handleAdd={handleAddClick}
            handleFormDialogOpen={handleCreateDialogOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <CreatePRSalesInquiryDialog
            key="create-pr-si-dialog"
            open={createDialogOpen}
            handleClose={handleCreateDialogClose}
            // string={name}
            purchaseRequisitions={selectedPRs}
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            {rows.length > 0 ? (
              <DataGrid
                autoHeight
                rows={rows.filter((row) => {
                  return row.id.toString().includes(search);
                })}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                disableSelectionOnClick
                isRowSelectable={(params) => !params.row.salesInquiry}
                components={{
                  Toolbar: GridToolbar,
                }}
                onSelectionModelChange={(ids) => {
                  setSelectedRows(ids);
                }}
                experimentalFeatures={{ newEditingApi: true }}
              />
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No ${name}s Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

PurchaseRequisition.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PurchaseRequisition;
