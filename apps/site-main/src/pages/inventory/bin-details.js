import { Box, Button, Card, Container } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { NotificationAlert } from '../../components/notification-alert';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import DayJS from 'dayjs';
import { BinDetailsToolbar } from '../../components/inventory/bin/bin-details-toolbar';
import { UpdateBin } from '../../components/inventory/bin/update-bin';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const BinDetails = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Get the bin ID that was clicked
  const location = useLocation();
  const { state } = location;

  //Current Bin
  const [bin, setBin] = useState('');

  //Batch line items from the bin
  const [batchLineItems, setBatchLineItems] = useState([]);

  //Load in list of bins, initial
  useEffect(() => {
    if (state != null) {
      setBin(state.bin);
      setBatchLineItems(state.bin.batchLineItems);
    }
  }, [location]);

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Alert Notification
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

  //Update bin
  const updateBin = (bin) => {
    setBin(bin);
  };

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 3,
      width: 300,
      valueGetter: (params) => {
        console.log(params.row);
        if (params.row.product?.name) {
          return params.row.product?.name;
        } else {
          return '';
        }
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      width: 120,
      editable: false,
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      flex: 2,
      width: 120,
      editable: false,
      valueFormatter: (params) => DayJS(params?.value).format('DD MMM YYYY'),
    },
  ];

  //Row for datagrid, set the list
  const rows = batchLineItems;

  //Navigate to the bin page
  const navigate = useNavigate();

  return state == null ? (
    <Navigate to="/warehouse" />
  ) : (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${bin.name} | ${user?.organisation?.name}`}</title>
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
        <Button
          onClick={() => navigate(-1)}
          size="small"
          startIcon={<ArrowBackIosNewIcon />}
          sx={{ marginLeft: 2 }}
        >
          Back
        </Button>
        <Container maxWidth={false}>
          <UpdateBin
            bin={bin}
            updateBin={updateBin}
            handleAlertOpen={handleAlertOpen}
          />
          <BinDetailsToolbar handleSearch={handleSearch} />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box sx={{ minWidth: 1050 }}>
                <DataGrid
                  autoHeight
                  minHeight="500"
                  rows={rows.filter((row) => {
                    if (search === '') {
                      return row;
                    } else {
                      return row.product.name.toLowerCase().includes(search);
                    }
                  })}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  allowSorting={true}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  disableSelectionOnClick
                />
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BinDetails;
