import {
  Box, Card, CardContent,
  Container, Typography
} from '@mui/material';
import Head from 'next/head';
// import { products } from '../__mocks__/products';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard-layout';
import { ProductListToolbar } from '../../components/product/product-list-toolbar';
import { products } from '../../__mocks__/organisation/products';
import { ProductDialog } from '../../__mocks__/organisation/products/productDialog';


// const rows = [];
const rows = products;

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
];

const Products = () => {
  const router = useRouter();
  const { organisation } = router.query;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          pb: 8,
        }}
      >
        <Container maxWidth={false}>
          <ProductDialog 
            open={open} 
            handleClose={handleClose}
          />
          <ProductListToolbar 
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            {rows.length > 0 ?
              <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                components={{
                  Toolbar: GridToolbar,
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
