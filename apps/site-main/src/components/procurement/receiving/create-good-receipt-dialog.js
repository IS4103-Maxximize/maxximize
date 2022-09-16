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
import { useEffect, useState } from 'react';
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
  const userId = user.id;

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpen(false);
    setProductInput('');
    formik.resetForm();
  };

  //Handle Formik submission
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/api/goods-receipts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: userId,
        createdDateTime: formik.values.dateReceived,
        goodsReceiptLineItemsDtos: products,
      }),
    });

    const result = await response.json();

    //Rerender parent data grid compoennt
    addGoodReceipt(result);

    handleDialogClose();
  };

  //Products for testing, TODO useEffect to import PO line items and populate this
  const [products, setProducts] = useState([]);

  //TODO Options to be replaced with fetching all products/from the PO
  const [rawMaterials, setRawMaterials] = useState([
    {
      name: 'apple',
      description: 'apple',
      unit: 'kilogram',
      unitPrice: 1,
      expiry: 1,
    },
    {
      name: 'orange',
      description: 'orange',
      unit: 'kilogram',
      unitPrice: 2,
      expiry: 1,
    },
    {
      name: 'pear',
      description: 'pear',
      unit: 'kilogram',
      unitPrice: 3,
      expiry: 1,
    },
    {
      name: 'pineapple',
      description: 'pineapple',
      unit: 'kilogram',
      unitPrice: 5,
      expiry: 1,
    },
    {
      name: 'dragonfruit',
      description: 'dragonfruit',
      unit: 'kilogram',
      unitPrice: 10,
      expiry: 1,
    },
  ]);

  //Load in list of raw material, initial
  useEffect(() => {
    retrieveAllRawMaterial();
  }, []);

  //Retrieve all raw material [TODO]
  const retrieveAllRawMaterial = async () => {
    // const rawMaterialList = await fetch(
    //   `http://localhost:3000/api/raw-materials`
    // );
    // const result = await rawMaterialList.json();
    // setRawMaterial(result);
  };

  const selectedProducts = products.map((product) => product.name);
  const options = rawMaterials
    .map((rawMaterial) => rawMaterial.name)
    .filter((name) => !selectedProducts.includes(name));

  //Columns for datagrid
  const columns = [
    {
      field: 'name',
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
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 120,
      flex: 1,
    },
  ];

  //New Product input to add product to the list
  const [productInput, setProductInput] = useState('');

  const handleAddButtonClick = () => {
    const newProduct = {
      id: products.length + 1,
      name: productInput,
      quantity: 1,
      unitPrice: rawMaterials
        .filter((rawMaterial) => rawMaterial.name === productInput)
        .map((rawMaterial) => rawMaterial.unitPrice),
      subtotal: 0,
      isSelected: false,
    };

    newProduct.subtotal =
      Number(newProduct.quantity) * Number(newProduct.unitPrice);

    const newProducts = [...products, newProduct];

    setProducts(newProducts);
    setProductInput('');
  };

  //Updating a good receipt line item entry, calling update API
  //Also alerts user of ourcome
  const handleRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };

    updatedRow.subtotal = updatedRow.quantity * updatedRow.unitPrice;

    const newProducts = [...products];
    newProducts[updatedRow.id - 1] = updatedRow;
    setProducts(newProducts);

    //handleQuantityIncrease();

    return updatedRow;
  };

  //Select Line Item for deletion
  const [selectionModel, setSelectionModel] = useState([]);

  const handleDelete = (selectedIds) => {
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
            disabled={formik.isSubmitting || products.length == 0}
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
                    !products.map((product) => product.name).includes(option)
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
