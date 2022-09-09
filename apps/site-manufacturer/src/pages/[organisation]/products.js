import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box, Card, CardContent,
  Container, IconButton, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/dashboard-layout';
import { ConfirmDialog } from '../../components/product/confirm-dialog';
import { ProductDialog } from '../../components/product/product-dialog';
import { ProductListToolbar } from '../../components/product/product-list-toolbar';
import { ProductMenu } from '../../components/product/product-menu';
import { products } from '../../__mocks__/organisation/products';


const Products = () => {
  const router = useRouter();
  const { organisation } = router.query;

  // Page View
  const [type, setType] = useState('raw');

  const handleType = (event, newType) => {
    if (newType !== null) {
      setType(newType);
    }
  }

  // Dialog helpers
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
  
  const data = products;
  const [rows, setRows] = useState(data);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setRows(data.filter((el) => el.type === type ? el : null))
  }, [data, type])

  useEffect(() => {
    setDisabled(selectedRows.length === 0)
  }, [selectedRows]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase())
  };

  const handleAddProductClick = () => {
    setSelectedRow(null);
  }

  // Logging
  useEffect(() => {
    console.log(selectedRow);
  }, [selectedRow])

  useEffect(() => {
    console.log(selectedRows)
  }, [selectedRows]);
  
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      // width: 200,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 300,
      editable: true,
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
      // width: 200,
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      editable: true,
      // width: 200,
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
            open={open} 
            handleClose={handleClose}
            product={selectedRow}
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
          />
          <ProductListToolbar 
            disabled={disabled}
            numProducts={selectedRows.length}
            type={type}
            handleClickOpen={handleClickOpen}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
            handleSearch={handleSearch}
            handleAddProductClick={handleAddProductClick}
            handleType={handleType}
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
                editMode="row"
                onEditRowsModelChange={(model) => {
                  console.log(model[Object.keys(model)[0]])
                }}
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

Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Products;
