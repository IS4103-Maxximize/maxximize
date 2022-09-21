import MoreVert from "@mui/icons-material/MoreVert";
import { Box, Card, CardContent, Container, IconButton, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { DashboardLayout } from "../../components/dashboard-layout";
import { NotificationAlert } from "../../components/notification-alert";
import { PODialog } from "../../components/procurement-ordering/purchase-order-dialog";
import { POMenu } from "../../components/procurement-ordering/purchase-order-menu";
import { Toolbar } from "../../components/procurement-ordering/toolbar";
import { ConfirmDialog } from "../../components/product/confirm-dialog";
import { purchaseOrders } from "../../__mocks__/purchase-orders";

export const PurchaseOrder = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

  const [loading, setLoading] = useState(true); // loading upon entering page


  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Selected Row IDs
  const [selectedRow, setSelectedRow] = useState();

  const getPOs = () => {
    return purchaseOrders; // API call TBD
  }

  useEffect(() => {
    // get Purchase Orders
    setLoading(true);
    setRows(getPOs());
    // setRows(fetchPurchaseOrders(organisationId));
  }, []);

  useEffect(() => {
    // show page after fetching data
    setLoading(false);
  }, [rows]);


  // Alert Helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error'); // success || error
  const [alertText, setAlertText] = useState('');
  const handleAlertOpen = () => {
    setAlertOpen(true);
  }
  const handleAlertClose = () => {
    setAlertOpen(false);
  }


  // Toolbar Helpers
  // Searchbar
  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };
  // Add Button
  const handleAddClick = () => {
    setAction('POST');
    setSelectedRow(null);
  }
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
          setSelectedRow(params.row);
          // setSelectedRows([params.row]);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };


  // FormDialog Helpers
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const handleFormDialogOpen = () => {
    setFormDialogOpen(true);
  };
  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
  };

  useEffect(() => {
    if (!formDialogOpen) {
      setLoading(true);
      setRows(getPOs());
    }
  }, [formDialogOpen]);


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
    const newRows = rows.filter(row => !ids.includes(row.id));
    // API deletePurchaseOrders
    setRows(newRows);
    setSelectedRows([]);
  }

  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'Purchase Order ID',
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Date Created',
      flex: 1,
      valueGetter: (params) => {
        return format(params.row.created, 'dd MMMM yyyy');
      }
    },
    {
      field: 'deliveryAddress',
      headerName: 'Delivery Address',
      flex: 3,
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      renderCell: menuButton
    },
  ];


  return (
    <>
      <Helmet>
        <title>
          Purchase Orders
          {user && ` | ${user?.organisation?.name}`}
        </title>
      </Helmet>
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
            name={'Purchase Order'}
            numRows={selectedRows.length}
            deleteDisabled={deleteDisabled}
            handleSearch={handleSearch}
            handleAdd={handleAddClick}
            handleFormDialogOpen={handleFormDialogOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <POMenu 
            key="po-menu"
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleClickViewEdit}
            handleFormDialogOpen={handleFormDialogOpen}
          />
          <PODialog
            key="po-dialog"
            action={action}
            open={formDialogOpen}
            handleClose={handleFormDialogClose}
            string={'Purchase Order'}
            purchaseOrder={selectedRow}
            // addPO
            // updatePO
            handleAlertOpen={handleAlertOpen}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete Purchase Order(s)`}
            dialogContent={`Confirm deletion of Purchase Order(s)?`}
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
                  <Typography>{`No Purchase Orders Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

PurchaseOrder.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PurchaseOrder;
