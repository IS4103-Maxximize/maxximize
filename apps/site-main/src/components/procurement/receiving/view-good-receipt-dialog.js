import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  Box,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export const ViewGoodReceiptDialog = ({
  openViewDialog,
  setOpenViewDialog,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpenViewDialog(false);
  };

  //Change this to retrieve local storage user organisation Id
  const organisationId = '1';

  //Products for testing, TODO useEffect to import GR line items and populate this
  const [products, setProducts] = useState([
    { id: 1, productName: 'Product 1', quantity: 1 },
    { id: 2, productName: 'Product 2', quantity: 3 },
    { id: 3, productName: 'Product 3', quantity: 2 },
  ]);

  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 300,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      editable: true,
    },
  ];

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openViewDialog}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'View Good Receipt'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 500 }}>
          <DataGrid
            autoHeight
            rows={products}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            allowSorting={true}
            components={{
              Toolbar: GridToolbar,
            }}
            disableSelectionOnClick
          />
        </Box>

        <Box
          mt={1}
          mb={1}
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button autoFocus onClick={handleDialogClose}>
            Back
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

//Helper method TODO, remove if not needed
//Flatten the good receipt record retrieved, difficult to update with an inner object
const flattenObj = (obj, parent, res = {}) => {
  for (let key in obj) {
    let propName = key;
    if (typeof obj[key] == 'object' && key != 'organisation') {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};
