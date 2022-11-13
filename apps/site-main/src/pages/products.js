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
import { DashboardLayout } from '../components/dashboard-layout';
import { NotificationAlert } from '../components/notification-alert';
import { ConfirmDialog } from '../components/product/confirm-dialog';
import { ProductDialog } from '../components/product/product-dialog';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductMenu } from '../components/product/product-menu';
import { deleteProducts, fetchProducts } from '../helpers/products';

const Products = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // Page View
  const { type } = props;
  const typeString = type === 'raw-materials' ? 'Raw Material' : 'Final Good';

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
  const [action, setAction] = useState();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Menu helpers
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
          handleMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();
  const [search, setSearch] = useState('');

  const getProducts = async () => {
    fetchProducts(type, organisationId)
      .then((result) => setRows(result))
      .catch((err) =>
        handleAlertOpen(`Failed to fetch ${typeString}s`, 'error')
      );
  };

  const addProduct = (product) => {
    console.log(rows);
    const updatedProducts = [...rows, product];
    setRows(updatedProducts);
    handleAlertOpen(
      `Added ${typeString} ${product.id} successfully!`,
      'success'
    );
  };

  const updateRow = (updatedProduct) => {
    const currentIndex = rows.findIndex((row) => row.id === updatedProduct.id);
    const newRows = [...rows];
    newRows[currentIndex] = updatedProduct;
    setRows(newRows);
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  const handleAddProductClick = () => {
    setAction('POST');
    setSelectedRow(null);
  };

  const handleDelete = async (ids) => {
    const newRows = rows.filter((row) => !ids.includes(row.id));
    setRows(newRows);
    setSelectedRows([]);
    deleteProducts(type, ids)
      .then(() => {
        handleAlertOpen(`Successfully deleted ${typeString}(s)`, 'success');
      })
      .then(() => getProducts());
  };

  const unitMap = {
    kilogram: 'kg',
    litre: 'litre',
  };

  const columns = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   flex: 1,
    // },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
    },
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 1,
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'expiry',
      headerName: 'Expiry (days)',
      flex: 1,
    },
    {
      field: 'lotQuantity',
      headerName: 'Lot Quantity',
      flex: 1,
      valueGetter: (params) =>
        params.row
          ? `${params.row.lotQuantity} ${unitMap[params.row.unit]}`
          : '',
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
            {`${typeString}s`}
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
          <ProductDialog
            organisationId={organisationId}
            action={action}
            open={open}
            handleClose={handleClose}
            product={selectedRow}
            type={type}
            typeString={typeString}
            addProduct={addProduct}
            updateProducts={updateRow}
            handleAlertOpen={handleAlertOpen}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete ${typeString}(s)`}
            dialogContent={`Confirm deletion of ${typeString}(s)?`}
            dialogAction={() => {
              handleDelete(selectedRows);
            }}
          />
          <ProductMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleClickOpen}
            handleMenuClose={handleMenuClose}
            handleClickViewEdit={handleClickViewEdit}
          />
          <ProductListToolbar
            disabled={disabled}
            numProducts={selectedRows.length}
            type={type}
            handleClickOpen={handleClickOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
            handleSearch={handleSearch}
            handleAddProductClick={handleAddProductClick}
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
                      row.name.toLowerCase().includes(search) ||
                      row.description.toLowerCase().includes(search)
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
                disableSelectionOnClick
                isRowSelectable={(params) => {
                  if (type === 'raw-materials') {
                    // disable selection and prevent deletion if used in bomLineItems
                    return params.row.bomLineItems.length === 0;
                  }
                  if (type === 'final-goods') {
                    // disable selection and prevent deletion if used in BOM
                    return !params.row.billOfMaterial;
                  }
                }}
              />
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No ${typeString}s Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

Products.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Products;
