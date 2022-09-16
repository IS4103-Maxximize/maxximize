import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box, Card, CardContent,
  Container, IconButton, Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { DashboardLayout } from '../components/dashboard-layout';
import { NotificationAlert } from '../components/notification-alert';
import { ConfirmDialog } from '../components/product/confirm-dialog';
import { ProductDialog } from '../components/product/product-dialog';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductMenu } from '../components/product/product-menu';
import { deleteProducts, fetchProducts, updateProduct } from '../helpers/products';


const Products = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id

  // Page View
  const { type } = props;
  const typeString = type ==='raw-materials' ? 'Raw Material' : 'Final Good'

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
  }
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  }

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
      <IconButton onClick={(event) => {
        setSelectedRow(params.row);
        handleMenuClick(event);
        }}>
        <MoreVert/>
      </IconButton>
    );
  };
  
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();
  const [search, setSearch] = useState("");

  const getProducts = async () => {
    fetchProducts(type, organisationId)
      .then((result) => setRows(result))
      .catch((err) => handleAlertOpen(`Failed to fetch ${typeString}s`, 'error'));
  }

  const addProduct = (product) => {
    const updatedProducts = [...rows, product];
    setRows(updatedProducts);
    handleAlertOpen(`Added ${typeString} ${product.id} successfully!`, 'success');
  } 

  const updateRow = (updatedProduct) => {
    const currentIndex = rows.findIndex(row => row.id === updatedProduct.id)
    const newRows = [...rows]
    newRows[currentIndex] = updatedProduct
    console.log(newRows)
    setRows(newRows)
  }

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setDisabled(selectedRows.length === 0)
  }, [selectedRows]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase())
  };

  const handleAddProductClick = () => {
    setAction('POST')
    setSelectedRow(null);
  };

  const handleDelete = async (ids) => {
    const newRows = rows.filter(row => !ids.includes(row.id))
    setRows(newRows)
    deleteProducts(type, ids)
      .then(() => {
        handleAlertOpen(`Successfully deleted ${typeString}(s)`, 'success');
      })
  };

  // Logging
  // useEffect(() => {
  //   console.log(selectedRow);
  // }, [selectedRow])

  // useEffect(() => {
  //   console.log(selectedRows)
  // }, [selectedRows]);
  
  let columnsForFinalGoods = [
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 300,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
    },
    {
      field: 'skuCode',
      headerName: 'SKU',
      width: 200,
    },
    {
      field: 'unit',
      headerName: 'Unit',
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price'
    },
    {
      field: 'expiry',
      headerName: 'Expiry (days)'
    }, 
    {
      field: 'lotQuantity',
      headerName: 'Lot Quantity'
    },
    {
      field: 'actions',
      headerName: 'actions',
      width: 100,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  let columnsForRawMaterials = [
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 300,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
    },
    {
      field: 'skuCode',
      headerName: 'SKU',
      width: 200,
    },
    {
      field: 'unit',
      headerName: 'Unit',
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price'
    },
    {
      field: 'expiry',
      headerName: 'Expiry (days)'
    }, 
    {
      field: 'actions',
      headerName: 'actions',
      width: 100,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          {`${typeString}s`}
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
            {rows.length > 0 ?
              <DataGrid
                autoHeight
                rows={rows.filter((row) => {
                  if (search === "") {
                    return row;
                  } else {
                    return row.name.toLowerCase().includes(search);
                  }
                })}
                columns={type === 'raw-materials' ? columnsForRawMaterials : columnsForFinalGoods}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                components={{
                  Toolbar: GridToolbar,
                }}
                onSelectionModelChange={(ids) => {
                  setSelectedRows(ids);
                  // setSelectedRows(ids.map((id) => rows.find((row) => row.id === id)));
                }}
                experimentalFeatures={{ newEditingApi: true }}
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
                    {`No ${typeString}s Found` }
                  </Typography>
                </CardContent>
              </Card>
            }
          </Box>
        </Container>
      </Box>
    </>
  )
};

Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Products;
