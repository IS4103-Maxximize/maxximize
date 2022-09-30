import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../../components/dashboard-layout';
import { NotificationAlert } from '../../components/notification-alert';
import { CreatePRSalesInquiryDialog } from '../../components/procurement-ordering/create-pr-sales-inquiry-dialog';
import { ConfirmDialog } from '../../components/product/confirm-dialog';
import { ProductMenu } from '../../components/product/product-menu';
import { Toolbar } from '../../components/toolbar';
import { PurchaseRequisitionNew } from './purchase-requisition-new';

export const PurchaseRequisition = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Purchase Requisition';

  const [loading, setLoading] = useState(true); // loading upon entering page

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Selected Row IDs
  const [selectedRow, setSelectedRow] = useState();

  const getPurchaseRequisitions = async () => {
    setRows(mock_prs); // mock for now
    // fetchProdOrders(organisationId)
    //   .then(res => setRows(res))
    //   .catch(err => handleAlertOpen('Failed to fetch Production Orders', 'error'))
  };

  useEffect(() => {
    // get Prod Orders
    setLoading(true);
    getPurchaseRequisitions();
  }, []);

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
    // setAction('POST');
    setSelectedRow(null);
  };
  // Delete Button
  const deleteDisabled = Boolean(selectedRows.length === 0);

  // Menu Helpers
  const [action, setAction] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClickViewEdit = () => {
    setAction('PATCH');
  };

  const menuButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          // console.log(params.row)
          setSelectedRow(params.row);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

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
    }
  }, [createDialogOpen]);

  // Update Dialog Helpers
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const handleUpdateDialogOpen = () => {
    setUpdateDialogOpen(true);
  };
  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
  };

  useEffect(() => {
    console.log(updateDialogOpen);
    if (!updateDialogOpen) {
      setLoading(true);
      getPurchaseRequisitions();
    }
    if (updateDialogOpen) {
      console.log(selectedRow);
    }
  }, [updateDialogOpen]);

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
        return params.row ? params.row.productionOrder.id : '';
      }
    },
    {
      field: 'created',
      headerName: 'Date Created',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? format(params.row.created, 'dd MMM yyyy') : '';
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
      field: 'quantity',
      headerName: 'Expected Qty',
      flex: 1,
    },
    {
      field: 'fulfilled',
      headerName: 'Fulfilled Qty',
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

  const mock_prodLineItems = [
    {
      id: 1,
      quantity: 10,
      sufficient: false,
      rawMaterial: {
        "id": 1,
        "name": "Tomato",
        "description": "from Italy bestest farm ever",
        "skuCode": "1-TOM",
        "unit": "kilogram",
        "unitPrice": 10,
        "lotQuantity": 50,
        "type": "RawMaterial",
        "expiry": 30,
      },
      productionOrder: {
        id: 1
      }
    },
    {
      id: 2,
      quantity: 5,
      sufficient: false,
      rawMaterial: {
        "id": 2,
        "name": "Olive Oil",
        "description": "From Italy, A2.1 quality",
        "skuCode": "2-OLI",
        "unit": "litre",
        "unitPrice": 30,
        "lotQuantity": 10,
        "type": "RawMaterial",
        "expiry": 150,
      },
      productionOrder: {
        id: 1
      }
    },
  ]

  // pr.rawMaterial.id
  // pr.prodO.prLineItem.rawMaterial.id

  const mock_prs = [
    {
      id: 1,
      quantity: 10, // expected
      fulfilled: 0,
      status: 'pending',
      created: new Date('2022-09-29'),
      rawMaterial : {
        "id": 1,
        "name": "Tomato",
        "description": "from Italy bestest farm ever",
        "skuCode": "1-TOM",
        "unit": "kilogram",
        "unitPrice": 10,
        "lotQuantity": 50,
        "type": "RawMaterial",
        "expiry": 30,
      },
      productionOrder: {
        id: 1
      },
      salesInquiry: null
    },
    {
      id: 2,
      quantity: 5, // expected
      fulfilled: 0,
      status: 'pending',
      created: new Date('2022-09-29'),
      rawMaterial : {
        "id": 2,
        "name": "Olive Oil",
        "description": "From Italy, A2.1 quality",
        "skuCode": "2-OLI",
        "unit": "litre",
        "unitPrice": 30,
        "lotQuantity": 10,
        "type": "RawMaterial",
        "expiry": 150,
      },
      productionOrder: {
        id: 1
      },
      salesInquiry: null
    },
    {
      id: 3,
      quantity: 15, // expected
      fulfilled: 0,
      status: 'pending',
      created: new Date('2022-09-29'),
      rawMaterial : {
        "id": 2,
        "name": "Olive Oil",
        "description": "From Italy, A2.1 quality",
        "skuCode": "2-OLI",
        "unit": "litre",
        "unitPrice": 30,
        "lotQuantity": 10,
        "type": "RawMaterial",
        "expiry": 150,
      },
      productionOrder: {
        id: 2
      },
      salesInquiry: null
    }
  ]

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
          <Toolbar
            key="toolbar"
            name={name}
            numRows={selectedRows.length}
            deleteDisabled={deleteDisabled}
            handleSearch={handleSearch}
            handleAdd={handleAddClick}
            handleFormDialogOpen={handleCreateDialogOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          {/* Should be triggered on ProductionOrder View
          Temporary location for testing */}
          {/* <PurchaseRequisitionNew
            key="purchase-req-new"
            open={createDialogOpen}
            handleClose={handleCreateDialogClose}
            string={name}
            prodOrderId={1} // temp
            prodLineItems={mock_prodLineItems} // mock for now
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          /> */}
          <CreatePRSalesInquiryDialog
            key="create-pr-si-dialog"
            open={createDialogOpen}
            handleClose={handleCreateDialogClose}
            // string={name}
            purchaseRequisitions={mock_prs} // mock for now
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          />
          {/* <ProductionOrderCreateDialog
            key="prod-order-create-dialog"
            open={createDialogOpen}
            handleClose={handleCreateDialogClose}
            string={name}
            handleAlertOpen={handleAlertOpen}
          /> */}
          {/* <BOMUpdateDialog
            key="bom-update-dialog"
            open={updateDialogOpen}
            handleClose={handleUpdateDialogClose}
            string={'Bill Of Material'}
            bom={selectedRow}
            handleAlertOpen={handleAlertOpen}
          /> */}
          <ProductMenu
            key="purchase-req-menu"
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleUpdateDialogOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleClickViewEdit}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete ${name}(s)`}
            dialogContent={`Confirm deletion of ${name}(s)?`}
            dialogAction={() => {
              handleDelete(selectedRows);
            }}
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
