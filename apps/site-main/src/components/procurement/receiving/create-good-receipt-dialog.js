import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Box,
  IconButton,
  Autocomplete,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

export const CreateGoodReceiptDialog = ({
  open,
  setOpen,
  addGoodReceipt,
  handleAlertOpen,
}) => {
  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpen(false);
    setProducts(originalProducts); //TODO clear the products, this is just to revert back to a backup
    setProductInput('');
    formik.resetForm();
  };

  //Handle Formik submission
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    // const response = await fetch('http://localhost:3000/api/users/createUser', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     firstName: formik.values.firstName,
    //     lastName: formik.values.lastName,
    //     username: formik.values.username,
    //     password: formik.values.password,
    //     role: formik.values.role,
    //     organisationId: organisationId,
    //     contact: {
    //       address: formik.values.address,
    //       email: formik.values.email,
    //       phoneNumber: formik.values.phoneNumber,
    //       postalCode: formik.values.postalCode,
    //     },
    //   }),
    // });

    // const result = await response.json();

    // const flattenResult = flattenObj(result);

    // //Rerender parent data grid compoennt
    // addGoodReceipt(flattenResult);

    handleDialogClose();
  };

  //Products for testing, TODO useEffect to import PO line items and populate this
  const [products, setProducts] = useState([
    { id: 1, productName: 'Product 1', quantity: 1 },
    { id: 2, productName: 'Product 2', quantity: 3 },
    { id: 3, productName: 'Product 3', quantity: 2 },
  ]);

  //TODO Remove, not needed when there is API call to get the products
  const originalProducts = [
    { id: 1, productName: 'Product 1', quantity: 1 },
    { id: 2, productName: 'Product 2', quantity: 3 },
    { id: 3, productName: 'Product 3', quantity: 2 },
  ];

  //TODO Options to be replaced with fetching all products/from the PO
  const options = [
    'Product 1',
    'Product 2',
    'Product 3',
    'Product 4',
    'Product 5',
  ];

  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 300,
      flex: 4,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      editable: true,
      flex: 1,
    },
  ];

  //New Product input
  const [productInput, setProductInput] = useState('');

  const handleAddButtonClick = () => {
    const newProduct = {
      id: products.length + 1,
      productName: productInput,
      quantity: 1,
      isSelected: false,
    };

    const newProducts = [...products, newProduct];

    setProducts(newProducts);
    setProductInput('');
  };

  //Updating a good receipt line item entry, calling update API
  //Also alerts user of ourcome
  const handleRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };

    console.log(updatedRow);
    const newProducts = [...products];
    newProducts[updatedRow.id - 1] = updatedRow;
    setProducts(newProducts);
    console.log(newProducts);
    console.log(products);

    //handleQuantityIncrease();

    return updatedRow;
  };

  //Select Line Item for deletion
  const [selectionModel, setSelectionModel] = useState([]);

  const handleDelete = (selectedIds) => {
    // const requestOptions = {
    //   method: 'DELETE',
    //   redirect: 'follow',
    // };

    // selectedIds.forEach((currentId) => {
    //     fetch(
    //       `http://localhost:3000/api/users/deleteUser/${currentId}`,
    //       requestOptions
    //     )
    //       .then(() => {
    //         setSuccessAlertContent(`Deleted Good Receipt successfully!`);
    //         setSuccessAlert(true);
    //       })
    //       .catch((error) => {
    //         setErrorAlertContent(error);
    //         setErrorAlert(true);
    //       });
    // });

    setProducts((result) =>
      result.filter((product) => !selectedIds.has(product.id))
    );
  };

  const formik = useFormik({
    initialValues: {
      purchaseOrderId: '',
      dateReceived: new Date(),
    },
    validationSchema: Yup.object({
      purchaseOrderId: Yup.string().required('Purchase Order ID is required'),
    }),
  });

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDialogClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Create Good Receipt
          </Typography>
          <Button
            autoFocus
            color="inherit"
            disabled={formik.isSubmitting}
            size="medium"
            type="submit"
            variant="outlined"
          >
            Create
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <form onSubmit={handleOnSubmit}>
          <TextField
            error={Boolean(
              formik.touched.purchaseOrderId && formik.errors.purchaseOrderId
            )}
            fullWidth
            helperText={
              formik.touched.purchaseOrderId && formik.errors.purchaseOrderId
            }
            label="Purchase Order ID"
            margin="normal"
            name="purchaseOrderId"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.purchaseOrderId}
            variant="outlined"
            size="small"
          />

          <Box mt={2} mb={2} display="flex" justifyContent="space-between">
            <Box display="flex">
              <Autocomplete
                id="purchase-order-products"
                size="small"
                sx={{ width: 300, marginRight: 1 }}
                renderInput={(params) => (
                  <TextField {...params} label="Products" />
                )}
                options={options.filter(
                  (option) =>
                    !products
                      .map((product) => product.productName)
                      .includes(option)
                )}
                value={productInput}
                onChange={(e, data) => {
                  setProductInput(data);
                }}
              />
              <IconButton
                disabled={!productInput}
                onClick={() => handleAddButtonClick()}
              >
                <AddIcon />
              </IconButton>
            </Box>

            <IconButton
              disabled={selectionModel.length === 0}
              onClick={() => {
                const selectedIds = new Set(selectionModel);
                handleDelete(selectedIds);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>

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
              checkboxSelection={true}
              onSelectionModelChange={(ids) => {
                setSelectionModel(ids);
              }}
              experimentalFeatures={{ newEditingApi: true }}
              processRowUpdate={handleRowUpdate}
            />
          </Box>
        </form>
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
