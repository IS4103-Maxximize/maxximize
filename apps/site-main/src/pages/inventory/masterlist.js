import { Box, Card, Container, IconButton } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { NotificationAlert } from '../../components/notification-alert';
import { WarehouseToolbar } from '../../components/inventory/warehouse/warehouse-toolbar';
import { CreateWarehouseDialog } from '../../components/inventory/warehouse/create-warehouse-dialog';
import { WarehouseConfirmDialog } from '../../components/inventory/warehouse/warehouse-confirm-dialog';
import { useNavigate } from 'react-router-dom';
import { MasterlistToolbar } from '../../components/inventory/masterlist/masterlist-toolbar';

const Masterlist = () => {
  const [products, setProducts] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [disabled, setDisabled] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Load in list of products, initial
  useEffect(() => {
    retrieveAllProducts();
  }, []);

  //Keep track of selectedRows for deletion
  useEffect(() => {
    setDisabled(selectedRows.length === 0);
  }, [selectedRows]);

  //Retrieve all products
  const retrieveAllProducts = async () => {
    const response = await fetch(
      `http://localhost:3000/api/products/getMasterList/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
      result = Object.values(result);
    }

    setProducts(result);
  };

  //Search Function
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase().trim());
  };

  //Action Menu
  const [anchorElUpdate, setAnchorElUpdate] = useState(null);
  const actionMenuOpen = Boolean(anchorElUpdate);
  const handleActionMenuClick = (event) => {
    setAnchorElUpdate(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setAnchorElUpdate(null);
  };

  const menuButton = (params) => {
    return (
      <IconButton
        // disabled={params.row.bins?.length == 0}
        onClick={(event) => {
          setSelectedRow(params.row);
          handleActionMenuClick(event);
        }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  //Columns for datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.product.id : '';
      },
    },
    {
      field: 'skuCode',
      headerName: 'SKU Code',
      width: 200,
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.product.skuCode : '';
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 4,
      valueGetter: (params) => {
        return params.row ? params.row.product.name : '';
      },
    },
    {
      field: 'reservedQuantity',
      headerName: 'Reserved',
      width: 150,
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.reservedQuantity : '';
      },
    },
    {
      field: 'totalQuantity',
      headerName: 'Total',
      width: 150,
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.totalQuantity : '';
      },
    },
  ];

  //Row for datagrid, set the list returned from API
  const rows = products;

  //Navigate to the line items page
  const navigate = useNavigate();
  const handleRowClick = (rowData) => {
    navigate('lineItems', { state: { productId: rowData.product.id } });
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Masterlist | ${user?.organisation?.name}`}</title>
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
          <MasterlistToolbar handleSearch={handleSearch} />
          <Box sx={{ mt: 3 }}>
            <Card>
              <Box sx={{ minWidth: 1050 }}>
                <DataGrid
                  autoHeight
                  getRowId={(row) => row.product.id}
                  rows={rows.filter((row) => {
                    if (search === '') {
                      return row;
                    } else {
                      return (
                        row.product.name.toLowerCase().includes(search) ||
                        row.product.skuCode.toLowerCase().includes(search)
                      );
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
                  //   onSelectionModelChange={(ids) => {
                  //     setSelectedRows(ids);
                  //   }}
                  onRowClick={(rowData) => handleRowClick(rowData)}
                />
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Masterlist;
