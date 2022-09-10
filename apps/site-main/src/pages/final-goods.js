import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box, Card, CardContent,
  Container, IconButton, Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/dashboard-layout';
import { ConfirmDialog } from '../components/product/confirm-dialog';
import { ProductDialog } from '../components/product/product-dialog';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductMenu } from '../components/product/product-menu';
import { fetchProducts, updateProduct } from '../helpers/products';
// import { products as mockProducts } from '../../__mocks__/organisation/products';


const FinalGoods = () => {
  const router = useRouter();
  const { organisation } = router.query;

  // Page View
  const type ='final-goods';

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
    const result = await fetchProducts(type);
    setRows(result)
  }

  const addProduct = (product) => {
    const updatedProducts = [...rows, product];
    setRows(updatedProducts);
  } 

  const handleRowUpdate = (newRow) => {
    const updatedRow = {...newRow};
    updateProduct(updatedRow.id, type, 'PATCH', updatedRow);
    return updatedRow;
  }

  useEffect(() => {
    getProducts();
  }, [rows]);

  // const data = mockProducts;
  // useEffect(() => {
  //   setRows(data.filter((el) => el.type === type ? el : null))
  // }, [data, type])

  useEffect(() => {
    setDisabled(selectedRows.length === 0)
  }, [selectedRows]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase())
  };

  const handleAddProductClick = () => {
    setAction('POST')
    setSelectedRow(null);
  }

  // Logging
  // useEffect(() => {
  //   console.log(selectedRow);
  // }, [selectedRow])

  // useEffect(() => {
  //   console.log(selectedRows)
  // }, [selectedRows]);
  
  const columns = [
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
      editable: true,
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
      headerName: 'Unit Price',
      editable: true,
    },
    {
      field: 'expiry',
      headerName: 'Expiry (days)',
      editable: true,
    },
    {
      field: 'actions',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: menuButton,
    },
  ];

  return (
    <>
      <Head>
        <title>
          {organisation ? 
            `Products | ${organisation.toUpperCase()}` :
            "Loading..."}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <ProductDialog 
            action={action}
            open={open} 
            handleClose={handleClose}
            product={selectedRow}
            type={type}
            addProduct={addProduct}
            updateProducts={handleRowUpdate}
          />
          <ConfirmDialog
            open={confirmDialogOpen} 
            handleClose={handleConfirmDialogClose}
            dialogTitle={"Delete Product(s)"}
            dialogContent={"Confirm deletion of product(s)?"}
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
            // handleType={handleType}
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
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                components={{
                  Toolbar: GridToolbar,
                }}
                onSelectionModelChange={(ids) => {
                  setSelectedRows(ids.map((id) => rows.find((row) => row.id === id)))
                }}
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={handleRowUpdate}
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
                    No Products Found
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

FinalGoods.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default FinalGoods;
