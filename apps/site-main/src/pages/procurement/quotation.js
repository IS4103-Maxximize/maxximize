import MoreVert from '@mui/icons-material/MoreVert';
import { Box, Card, CardContent, Container, IconButton, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DashboardLayout } from '../../components/dashboard-layout';
import { NotificationAlert } from '../../components/notification-alert';
import { QuotationDialog } from '../../components/procurement-ordering/quotation-dialog';
import { Toolbar } from '../../components/procurement-ordering/toolbar';
import { ConfirmDialog } from '../../components/product/confirm-dialog';
import { ProductMenu } from '../../components/product/product-menu';
import { quotations } from '../../__mocks__/quotations';

const Quotation = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Search Helpers
  const [search, setSearch] = useState("");
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase())
  };

  // DataGrid Row and Toolbar helpers
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteDisabled, setDeleteDisabled] = useState();

  useEffect(() => {
    setDeleteDisabled(selectedRows.length === 0)
  }, [selectedRows]);

  // Confirm Dialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  }
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  }

  // Form Dialog Helpers
  const [action, setAction] = useState();
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleAdd = () => {
    setAction('POST');
    setSelectedRow(null);
  };
  const handleFormDialogOpen = () => {
    setFormDialogOpen(true);
  }
  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
  }

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
      <IconButton onClick={(event) => {
        setSelectedRow(params.row);
        handleMenuClick(event);
        }}>
        <MoreVert/>
      </IconButton>
    );
  };

  // CRUD helpers
  const handleDelete = async (ids) => {
    // delete rows
  }

  // DataGrid Rows & Columns
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(quotations);
  }, [])

  const columns = [
    {
      field: "id",
      headerName: "Quotation ID",
      flex: 1,
    },
    {
      field: "supplierName",
      headerName: "Supplier Name",
      flex: 3,
      valueGetter: ((params) => {
        return params.row.shellOrganisation.name;
      })
    },
    {
      field: "skuCode",
      headerName: "Product SKU",
      flex: 2,
      valueGetter: ((params) => {
        return params.row.product.skuCode;
      })
    },
    {
      field: "lotQuantity",
      headerName: "Lot Quantity",
      flex: 1,
    },
    {
      field: "lotPrice",
      headerName: "Lot Price",
      flex: 1,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      sortable: false,
      renderCell: menuButton,
    }
  ]

  return (
    <>
      <Helmet>
        <title>
          Quotation
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
            // open={alertOpen}
            // severity={alertSeverity}
            // text={alertText}
            // handleClose={handleAlertClose}
          />
          {/* <ProductDialog 
            action={action}
            open={open} 
            handleClose={handleClose}
            product={selectedRow}
            type={type}
            typeString={typeString}
            addProduct={addProduct}
            updateProducts={handleRowUpdate}
            handleAlertOpen={handleAlertOpen}
          />*/}
          <ProductMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleFormDialogOpen} 
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleEdit}
          />
          <ConfirmDialog
            open={confirmDialogOpen} 
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete Quotation(s)`}
            dialogContent={`Confirm deletion of Quotation(s)?`}
            dialogAction={() => {
              handleDelete(selectedRows);
            }}
          />
          <QuotationDialog
            action={action}
            open={formDialogOpen}
            handleClose={handleFormDialogClose}
            string={'Quotation'}
            quotation={selectedRow}
            // add
            // update
            // handleAlertOpen
          />
          <Toolbar 
            name="Quotation"
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
            {rows.length > 0 ?
              <DataGrid
                autoHeight
                rows={rows.filter((row) => {
                  if (search === "") {
                    return row;
                  } else {
                    return row.id.toLowerCase().includes(search) ||
                      row.shellOrganisation.name.toLowerCase().includes(search) ||
                      row.product.skuCode.toLowerCase().includes(search);
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
              :
              <Card 
                variant="outlined"
                sx={{
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Typography>
                    {`No Quotations Found` }
                  </Typography>
                </CardContent>
              </Card>
            }
          </Box>
        </Container>
      </Box>
    </>
  );
};

Quotation.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Quotation;
