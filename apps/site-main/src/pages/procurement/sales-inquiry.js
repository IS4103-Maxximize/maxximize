import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../../components/dashboard-layout';
import { NotificationAlert } from '../../components/notification-alert';
import { SalesInquiryDialog } from '../../components/procurement-ordering/sales-inquiry-dialog';
import { SalesInquiryMenu } from '../../components/procurement-ordering/sales-inquiry.menu';
import { SupplierDialog } from '../../components/procurement-ordering/supplier-dialog';
import { ConfirmDialog } from '../../components/product/confirm-dialog';
import { Toolbar } from '../../components/toolbar';
import {
  deleteSalesInquiries,
  fetchSalesInquiries,
  fetchSentSalesInquiries,
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
    setSupplierDialogOpen(true);
  };
  const handleSupplierDialogClose = () => {
    setSupplierDialogOpen(false);
  };

  // Fetch again after sending SI out to
  // refresh updated status
  useEffect(() => {
    if (!supplierDialogOpen) {
      setRows(getSalesInquiries());
    }
  }, [supplierDialogOpen]);

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
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  //   Form Dialog, list of registered suppliers
  const [orgOptions, setOrgOptions] = useState([]);

  useEffect(() => {
    const fetchOrg = async () => {
      const shellOrganisations = await fetch(
        `http://localhost:3000/api/shell-organisations/orgId/${user.organisation.id}`
      );
      const shellOrganisationsResult = await shellOrganisations.json();

      const response = await fetch(
        'http://localhost:3000/api/organisations/getOrgByShellUen',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shellOrganisations: shellOrganisationsResult,
          }),
        }
      );

      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        setOrgOptions(result);
      }
    };

    fetchOrg();
  }, [formDialogOpen]);

  // DataGrid Rows & Columns
  const [rows, setRows] = useState([]);

  const getSalesInquiries = async () => {
    const response = await fetch(
      `http://localhost:3000/api/sales-inquiry/sent/${user.organisation.id}`
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      setRows(result);
    } else {
      handleAlertOpen(`Failed to fetch Sales Inquiries`, 'error');
    }
  };

  const addSalesInquiry = (inquiry) => {
    const updatedProducts = [...rows, inquiry];
    setRows(updatedProducts);
    handleAlertOpen(
      `Added Sales Inquiry ${inquiry.id} successfully!`,
      'success'
    );
  };

  const handleRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow };

    const inquiry = await newRow.json();

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

  useEffect(() => {
    // reset selectedRows to [] upon updating rows
    setSelectedRows([]);
  }, [rows]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'totalPrice',
      headerName: 'Total Price',
      flex: 2,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
    },
    {
      field: 'hasPRs',
      headerName: 'Purchase Requistions?',
      flex: 2,
      renderCell: (params) => {
        return params.row.purchaseRequisitions.length === 0 ? (
          <CancelIcon color="error" />
        ) : (
          <CheckCircleIcon color="success" />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Sales Inquiry
            {user && ` | ${user?.organisation?.name}`}
          </title>
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
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <SalesInquiryMenu
            canSend={selectedRow?.status === 'draft'}
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
            orgOptions={orgOptions}
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
            orgOptions={orgOptions}
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
                      row.id.toString().includes(search) ||
                      row.status.toLowerCase().includes(search)
                    );
                  }
                })}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                isRowSelectable={(params) =>
                  params.row.status === 'draft' &&
                  params.row.purchaseRequisitions.length === 0
                }
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
