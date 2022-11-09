import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Masonry from '@mui/lab/Masonry';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { NotificationAlert } from '../components/notification-alert';
import { ProductCard } from '../components/products/product-card';
import { Toolbar } from '../components/toolbar';

const Products = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const location = useLocation();
  const currentSupplierId = location.pathname.split('/')[2];
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState('');

  //Retrieve supplier
  const retrieveSupplier = async () => {
    const response = await fetch(
      `http://localhost:3000/api/organisations/${currentSupplierId}`
    );

    if (response.status == 200 || response.status == 201) {
      const result = await response.json();

      setSupplier(result);
    }
  };

  const retrieveFinalGoods = async () => {
    const res = await fetch(
      `http://localhost:3000/api/final-goods/orgId/${currentSupplierId}`
    );

    let result = [];
    if (res.status === 200 || res.status === 201) {
      result = await res.json();

      setProducts(result);
      setSearchResults(result);
    }
  };

  useEffect(() => {
    retrieveFinalGoods();
    retrieveSupplier();
  }, []);

  //Search Function
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  useEffect(() => {
    const results = products.filter((product) =>
      product?.name.toLowerCase().includes(search)
    );
    setSearchResults(results);
  }, [search]);

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

  const navigate = useNavigate();

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Supplier Products | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            key="toolbar"
            name={`${supplier?.name} Products`}
            handleSearch={handleSearch}
          />
          <Box sx={{ mt: 3 }}>
            <Card sx={{ overflow: 'auto', padding: 2 }}>
              {searchResults.length !== 0 ? (
                <Masonry
                  columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
                  spacing={{ xs: 1, sm: 2 }}
                >
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      supplier={supplier}
                      product={product}
                      handleAlertOpen={handleAlertOpen}
                    />
                  ))}
                </Masonry>
              ) : (
                <Box display="flex" justifyContent="center" m={1}>
                  <Typography variant="body1">
                    No product matching search term found
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>
          <Button
            onClick={() => navigate(-1)}
            size="small"
            startIcon={<ArrowBackIosNewIcon />}
            sx={{ marginTop: 2 }}
          >
            Back
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Products;
