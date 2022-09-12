import Head from 'next/head';
import NextLink from 'next/link';
import { DashboardLayout } from '../components/dashboard-layout';
import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Link,
  Typography,
  TextField,
  InputAdornment,
  SvgIcon
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Partner_Onboard = ({ props }) => {
  const [setAction] = useState();
  const [setSearch] = useState("");
  const [setSelectedRow] = useState();
  const [setOpen] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase())
  };

  const handleAddProductClick = () => {
    setAction('POST')
    setSelectedRow(null);
  }

  return (
    <Box {...props}>
    <Head>
      <title>
        Onboard Business Partners 
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="sm">
        <NextLink
          href="/business-partner-management"
          passHref
        >
          <Button
            component="a"
            startIcon={<ArrowBackIcon fontSize="small" />}
          >
            Business Partner Management
          </Button>

        </NextLink>
        <form onSubmit={handleSearch}>
        <TextField
                sx={{ width: 500 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search for existing organisations"
                variant="outlined"
                type="search"
                onChange={handleSearch}
              />
          
          <Box sx={{ m: 1 }}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      handleAddProductClick();
                      handleClickOpen();
                    }}
                    sx={{ mr: 1}}
                  >
                    Confirm to Link Business Partner 
                </Button>

              </Box>
           
          <Typography
            color="textSecondary"
            variant="body2"
          >
            
            {' '}
            <NextLink
              href="/partners-register"
              passHref
            >
              <Link
                variant="subtitle2"
                underline="hover"
              >
                   New business partner?
              </Link>
            </NextLink>
          </Typography>
        </form>
      </Container>
    </Box>
    </Box>
  );
};

Partner_Onboard.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Partner_Onboard;
