import { 
  Box, 
  Button, 
  Card, 
  CardContent,
  Container, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText,
  DialogTitle,
  TextField, 
  Typography,
} from '@mui/material';
import Head from 'next/head';
// import { products } from '../__mocks__/products';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard-layout';
import { ProductListToolbar } from '../../components/product/product-list-toolbar';

const rows = [];
const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 200,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 200,
  },
  {
    field: 'skuCode',
    headerName: 'SKU',
    width: 200,
  },
  {
    field: 'unit',
    headerName: 'Measurement Unit',
    width: 200,
  },
  {
    field: 'unitPrice',
    headerName: 'Unit Price',
    width: 200,
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
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Dialog 
            open={open} 
            onClose={handleClose}
          >
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To subscribe to this website, please enter your email address here. We
                will send updates occasionally.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleClose}>Subscribe</Button>
            </DialogActions>
          </Dialog>
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
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
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
