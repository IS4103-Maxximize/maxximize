import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  AppBar,
  Autocomplete,
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { formatRelative } from 'date-fns';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import {
  createSalesInquiry,
  updateSalesInquiry,
} from '../../helpers/procurement-ordering';
import { fetchProducts } from '../../helpers/products';

export const SalesInquiryDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    action, // POST || PATCH
    open,
    handleClose,
    string,
    inquiry,
    addSalesInquiry,
    updateInquiry,
    handleAlertOpen,
  } = props;

  const [updateTotalPrice, setUpdateTotalPrice] = useState(0);

  useEffect(() => {
    if (inquiry && inquiry.totalPrice) {
      console.log(inquiry.totalPrice);
      setUpdateTotalPrice(Number(inquiry.totalPrice));
    }
  });

  // Formik Helpers and Variables
  let initialValues = {
    id: inquiry ? inquiry.id : null,
    status: inquiry ? inquiry.status : 'draft',
    lineItems: inquiry ? inquiry.salesInquiryLineItems : [],
    totalPrice: inquiry ? inquiry.totalPrice : 0,
    numProd: 1,
  };

  // const lineItem = Yup.object().shape({
  //   quantity: Yup.number(),
  //   rawMaterial: Yup.object().shape({
  //     name: Yup.string(),
  //     description: Yup.string(),
  //     skuCode: Yup.string(),
  //     unit: Yup.string(),
  //     unitPrice: Yup.number().positive(),
  //     expiry: Yup.number().positive(),
  //   })
  // });

  let schema = {
    status: Yup.string().required('Inquiry status is required'),
    // lineItems: Yup.array(lineItem),
    numProd: Yup.number().integer().positive(),
  };

  const handleOnSubmit = async (values) => {
    if (action === 'POST') {
      const newLineItems = values.lineItems;
      let totalPrice = 0;

      const lineItems = [];

      for (const newLineItem of newLineItems) {
        let lineItem = {
          quantity: newLineItem.quantity,
          indicativePrice: newLineItem.rawMaterial.unitPrice,
          rawMaterialId: newLineItem.rawMaterial.id,
        };
        totalPrice += lineItem.quantity * lineItem.indicativePrice;

        lineItems.push(lineItem);
      }
      const user = JSON.parse(localStorage.getItem('user'));
      const currentOrganisationId = user.organisation.id;

      const salesInquiry = {
        totalPrice: totalPrice,
        currentOrganisationId: currentOrganisationId,
        salesInquiryLineItemsDtos: lineItems,
      };

      const lineItemJSON = JSON.stringify(salesInquiry);

      const response = await fetch('http://localhost:3000/api/sales-inquiry', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: lineItemJSON,
      }).then((res) => res.json());

      //   // create
      //   const result = await createSalesInquiry(
      //     user.organisation.id,
      //     values.lineItems
      //   ).catch((err) => handleAlertOpen(`Error creating ${string}`, 'error'));

      const result = await response.json();

      addSalesInquiry(result);
    } else if (action === 'PATCH') {
      // update
      const result = await updateSalesInquiry(inquiry, values);
      updateInquiry(result);
    }
    onClose();
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object(schema),
    onSubmit: handleOnSubmit,
  });

  // Autocomplete Helpers
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchProducts('raw-materials', user.organisation.id);
      // console.log(formik.values.lineItems)
      const data = result.filter((el) =>
        formik.values.lineItems
          .map((item) => item.rawMaterial.skuCode)
          .includes(el.skuCode)
          ? null
          : el
      );
      setOptions(data);
    };
    fetchData();

    // // Update Total Price
    // formik.setFieldValue(
    //   'totalPrice',
    //   calculateTotalPrice(formik.values.lineItems)
    // );
  }, [open, formik.values.lineItems]);

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const addLineItem = (quantity, inputValue) => {
    const rawMaterial = options.find((option) => option.skuCode === inputValue);
    const newItem = {
      id: uuid(),
      quantity: quantity,
      rawMaterial: rawMaterial,
    };
    formik.setFieldValue('lineItems', [...formik.values.lineItems, newItem]);
    setInputValue('');
    formik.setFieldValue('numProd', 1);
  };

  const deleteLineItems = (ids) => {
    const updatedLineItems = formik.values.lineItems.filter(
      (el) => !ids.includes(el.id)
    );
    formik.setFieldValue('lineItems', [...updatedLineItems]);
  };

  const updateLineItems = (newRow) => {
    const updatedRow = { ...newRow };
    let totalPrice = 0;
    for (const lineItem of formik.values.lineItems) {
      if (lineItem.id == updatedRow.id) {
        lineItem.quantity = updatedRow.quantity;
      }

      console.log(lineItem);

      setUpdateTotalPrice(
        (totalPrice +=
          Number(lineItem.indicativePrice) * Number(lineItem.quantity))
      );

      inquiry.totalPrice = totalPrice;
    }
    console.log(updateTotalPrice);
    return updatedRow;
  };

  const columns = [
    {
      field: 'skuCode',
      headerName: 'SKU',
      minWidth: 150,
      flex: 2,
      valueGetter: (params) => {
        return params.row.rawMaterial.skuCode;
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      editable: formik.values.status === 'draft',
    },
    {
      field: 'name',
      headerName: 'Product Name',
      minWidth: 150,
      flex: 2,
      valueGetter: (params) => {
        return params.row.rawMaterial.name;
      },
    },
    {
      field: 'description',
      headerName: 'Product Description',
      minWidth: 300,
      flex: 3,
      valueGetter: (params) => {
        return params.row.rawMaterial.description;
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row.rawMaterial.unit;
      },
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 1,
      valueGetter: (params) => {
        return params.row.rawMaterial.unitPrice;
      },
    },
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog fullScreen open={open} onClose={onClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {action === 'POST' && 'Add '}
              {action === 'PATCH' && formik.values.status !== 'sent' && 'Edit '}
              {formik.values.status === 'sent' && 'View Sent '}
              {string}
            </Typography>
            {formik.values.status !== 'sent' && (
              <Button
                variant="contained"
                disabled={!formik.isValid || formik.isSubmitting}
                onClick={formik.handleSubmit}
              >
                Save
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent>
          {inquiry && (
            <TextField
              fullWidth
              error={Boolean(formik.touched.id && formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
              label="Sales Inquiry ID"
              margin="normal"
              name="id"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.id}
              variant="outlined"
              disabled
            />
          )}
          <TextField
            fullWidth
            error={Boolean(formik.touched.status && formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
            label="Status"
            margin="normal"
            name="status"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.status}
            variant="outlined"
            disabled
          />
          {inquiry && (
            <TextField
              fullWidth
              error={Boolean(
                formik.touched.totalPrice && formik.errors.totalPrice
              )}
              helperText={formik.touched.totalPrice && formik.errors.totalPrice}
              label="Total Price"
              margin="normal"
              name="totalPrice"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={updateTotalPrice}
              variant="outlined"
              disabled
            />
          )}
          {formik.values.status !== 'sent' && (
            <Box my={2} display="flex" justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                <Autocomplete
                  sx={{ width: 300 }}
                  options={options.map((option) => option.skuCode)}
                  renderInput={(params) => (
                    <TextField {...params} label="Raw Materials" />
                  )}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                />
                <TextField
                  error={Boolean(
                    formik.touched.numProd && formik.errors.numProd
                  )}
                  helperText={formik.touched.numProd && formik.errors.numProd}
                  label="Enter Number of Raw Materials"
                  margin="normal"
                  name="numProd"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.numProd}
                  variant="outlined"
                />
                <IconButton
                  disabled={
                    !inputValue ||
                    formik.values.numProd <= 0 ||
                    formik.values.numProd === null
                  }
                  color="primary"
                  onClick={() => {
                    addLineItem(formik.values.numProd, inputValue);
                  }}
                >
                  <AddBoxIcon />
                </IconButton>
              </Stack>
              <IconButton
                disabled={selectedRows.length === 0}
                color="error"
                onClick={() => deleteLineItems(selectedRows)}
              >
                <Badge badgeContent={selectedRows.length} color="error">
                  <DeleteIcon />
                </Badge>
              </IconButton>
            </Box>
          )}
          <DataGrid
            autoHeight
            rows={formik.values.lineItems}
            columns={columns}
            checkboxSelection={formik.values.status !== 'sent'}
            disableSelectionOnClick
            pageSize={5}
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={updateLineItems}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};
