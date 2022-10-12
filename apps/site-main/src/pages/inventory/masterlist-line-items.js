import { Box, Button, Card, Container, Tooltip } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { MasterlistLineItemToolbar } from '../../components/inventory/masterlist/masterlist-line-item-toolbar';
import DayJS from 'dayjs';

const MasterlistLineItems = () => {
  const [bins, setBins] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Get the warehouse ID that was clicked
  const { state } = useLocation();
  const navigate = useNavigate();

  //Load in list of bins, initial
  useEffect(() => {
    console.log(state);
    // retrieveAllBins();
  }, []);

  //Retrieve all bins
  //   const retrieveAllBins = async () => {
  //     const response = await fetch(
  //       `http://localhost:3000/api/bins/findAllByOrgId/${organisationId}`
  //     );

  //     let result = [];

  //     if (response.status == 200 || response.status == 201) {
  //       result = await response.json();
  //     }
  //     if (state != null) {
  //       result = result.filter((bin) => bin.warehouse.id == state.warehouseId);
  //     }
  //     setBins(result);
  //   };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.id : '';
      },
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 200,
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.expiryDate : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'reservedQuantity',
      headerName: 'Reserved Quantity',
      width: 100,
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.reservedQuantity : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'rack',
      headerName: 'Rack ID',
      width: 100,
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.bin.rack.id : '';
      },
    },
    {
      field: 'bin',
      headerName: 'Bin Name',
      width: 100,
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.bin.name : '';
      },
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = state.batchLineItems;

  return state == null ? (
    <Navigate to="/inventory/masterlist" />
  ) : (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${state.productName} | ${user?.organisation?.name}`}</title>
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
        <Button
          onClick={() => navigate(-1)}
          size="small"
          startIcon={<ArrowBackIosNewIcon />}
          sx={{ marginLeft: 2 }}
        >
          Back
        </Button>
        <Container maxWidth={false}>
          <MasterlistLineItemToolbar
            handleSearch={handleSearch}
            productName={state.productName}
            overallReservedQuantity={state.overallReservedQuantity}
            overallTotalQuantity={state.overallTotalQuantity}
          />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box sx={{ minWidth: 1050 }}>
                <DataGrid
                  autoHeight
                  rows={rows.filter((row) => {
                    if (search === '') {
                      return row;
                    } else {
                      return row.id.toString().includes(search);
                    }
                  })}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  allowSorting={true}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  disableSelectionOnClick
                  checkboxSelection
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MasterlistLineItems;
