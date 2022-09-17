import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DashboardLayout } from '../../components/dashboard-layout';
import { NotificationAlert } from '../../components/notification-alert';
import { SalesInquiryDialog } from '../../components/procurement-ordering/sales-inquiry-dialog';
import { SalesInquiryMenu } from '../../components/procurement-ordering/sales-inquiry.menu';
import { SupplierDialog } from '../../components/procurement-ordering/supplier-dialog';
import { Toolbar } from '../../components/procurement-ordering/toolbar';
import { ConfirmDialog } from '../../components/product/confirm-dialog';
import {
  deleteSalesInquiries,
  fetchSalesInquiries,
  updateSalesInquiry,
} from '../../helpers/procurement-ordering';

export const SalesInquiry = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

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

  // Search Helpers
  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  // DataGrid Row and Toolbar helpers
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteDisabled, setDeleteDisabled] = useState();

  useEffect(() => {
    setDeleteDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  // Confirm Dialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Form Dialog Helpers
  const [action, setAction] = useState();
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleAdd = () => {
    setAction('POST');
    setSelectedRow(null);
  };
  const handleFormDialogOpen = () => {
    setFormDialogOpen(true);
  };
  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
  };

  // Supplier Dialog Helpers
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const handleSupplierDialogOpen = () => {
    console.log(selectedRow);
    setSupplierDialogOpen(true);
  };
  const handleSupplierDialogClose = () => {
    setSupplierDialogOpen(false);
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
  const handleEdit = () => {
    setAction('PATCH');
  };

  const menuButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setSelectedRow(params.row);
          console.log(params.row);
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  // DataGrid Rows & Columns
  const [rows, setRows] = useState([]);

  const getSalesInquiries = async () => {
    fetchSalesInquiries(user.organisation.id)
      .then((result) => setRows(result))
      .catch((err) =>
        handleAlertOpen(`Failed to fetch Sales Inquiries`, 'error')
      );
  };

  const addSalesInquiry = (inquiry) => {
    const updatedProducts = [...rows, inquiry];
    console.log(updatedProducts);
    setRows(updatedProducts);
    console.log(inquiry);
    handleAlertOpen(
      `Added Sales Inquiry ${inquiry.id} successfully!`,
      'success'
    );
  };

  const handleRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow };

    const inquiry = await newRow.json();
    console.log(inquiry);

    getSalesInquiries();
    handleAlertOpen(
      `Updated Sales Inquiry ${inquiry.id} successfully!`,
      'success'
    );
    return updatedRow;
  };

  const handleDelete = (ids) => {
    deleteSalesInquiries(ids)
      .then(() => {
        handleAlertOpen(`Successfully deleted Sales Inquiry(s)`, 'success');
      })
      .then(() => getSalesInquiries());
  };

  useEffect(() => {
    getSalesInquiries();
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Sales Inquiry
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
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <SalesInquiryMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleFormDialogOpen}
            handleMenuClose={handleMenuClose}
            handleEdit={handleEdit}
            handleSupplierDialogOpen={handleSupplierDialogOpen}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete Sales Inquiry(s)`}
            dialogContent={`Confirm deletion of Sales Inquiry(s)?`}
            dialogAction={() => {
              handleDelete(selectedRows);
            }}
          />
          <SalesInquiryDialog
            action={action}
            open={formDialogOpen}
            string={'Sales Inquiry'}
            inquiry={selectedRow}
            addSalesInquiry={addSalesInquiry}
            updateInquiry={handleRowUpdate}
            handleClose={handleFormDialogClose}
            handleAlertOpen={handleAlertOpen}
          />
          <SupplierDialog
            open={supplierDialogOpen}
            inquiry={selectedRow}
            handleClose={handleSupplierDialogClose}
            handleAlertOpen={handleAlertOpen}
          />
          <Toolbar
            name="Sales Inquiry"
            numRows={selectedRows.length}
            deleteDisabled={deleteDisabled}
            handleSearch={handleSearch}
            handleAdd={handleAdd}
            handleFormDialogOpen={handleFormDialogOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
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
                  if (search === '') {
                    return row;
                  } else {
                    return (
                      row.id.includes(search) ||
                      row.status.toLowerCase().includes(search)
                    );
                  }
                })}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                components={{
                  Toolbar: GridToolbar,
                }}
                onSelectionModelChange={(ids) => {
                  setSelectedRows(ids);
                }}
                // experimentalFeatures={{ newEditingApi: true }}
                // processRowUpdate={handleRowUpdate}
              />
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No Sales Inquiries Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

SalesInquiry.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SalesInquiry;
