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
import { DatePicker } from '@mui/x-date-pickers';
import { isSameDateError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import {
  updateSalesInquiry,
  fetchSalesInquiry,
} from '../../helpers/procurement-ordering';
import { fetchProducts } from '../../helpers/products';

export const SalesInquiryDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    orgOptions,
    action, // POST || PATCH
    open,
    handleClose,
    string,
    inquiry,
    addSalesInquiry,
    updateInquiry,
    handleAlertOpen,
    ...rest
  } = props;

  const [updateTotalPrice, setUpdateTotalPrice] = useState(0);

  useEffect(() => {
    const retrieveSalesInquiry = async () => {
      if (action === 'POST') {
        setUpdateTotalPrice(0);
        formik.setFieldValue('lineItems', []);
      }
      if (inquiry) {
        const response = await fetch(
          `http://localhost:3000/api/sales-inquiry/${inquiry.id}`
        );
        const result = await response.json();
        setUpdateTotalPrice(result.totalPrice);
        formik.setFieldValue('lineItems', result.salesInquiryLineItems);
      }
    };
    retrieveSalesInquiry();
  }, [open, inquiry]);

  // Formik Helpers and Variables
  let initialValues = {
    id: inquiry ? inquiry.id : null,
    receivingOrg: inquiry ? inquiry.receivingOrganisationId : '',
    status: inquiry ? inquiry.status : 'draft',
    expiryDate: inquiry ? inquiry.expiryDate : null,
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
    expiryDate: Yup.string().required('Expiry Date is require'),
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
          finalGoodId: newLineItem.finalGood?.id,
        };
        totalPrice += lineItem.quantity * lineItem.indicativePrice;

        lineItems.push(lineItem);
      }
      const user = JSON.parse(localStorage.getItem('user'));
      const currentOrganisationId = user.organisation.id;
      const expiryDuration = new Date(values.expiryDate) - new Date();

      const salesInquiry = {
        receivingOrganisationId: values.receivingOrg ? values.receivingOrg : '', // check for null orgId
        expiryDuration: expiryDuration,
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

      // newly created SI doesn't return relations
      // fetch SI with relations
      const result = await response;
      const inquiry = await fetchSalesInquiry(result.id);

      addSalesInquiry(inquiry);
    } else if (action === 'PATCH') {
      // update
      const result = await updateSalesInquiry(updateTotalPrice, values);
      updateInquiry(result);
    }
    onClose();
  };

  const onClose = () => {
    setUpdateTotalPrice(0);
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

  // Autocomplete for registered suppliers final goods
  const [finalGoods, setFinalGoods] = useState([]);
  const [selectedFinalGood, setSelectedFinalGood] = useState('');

  useEffect(() => {
    if (formik.values.receivingOrg) {
      console.log(formik.values.receivingOrg);
      const fetchFinalGoods = async () => {
        const response = await fetch(
          `http://localhost:3000/api/products/all/${formik.values.receivingOrg.id}`
        );

        if (response.status === 200 || response.status === 201) {
          const result = await response.json();

          const data = result.filter((product) => product.type === 'FinalGood');

          console.log(data);
          setFinalGoods(data);
        }
      };

      fetchFinalGoods();
    }
    formik.setFieldValue('lineItems', []);
    setSelectedFinalGood('');
  }, [formik.values.receivingOrg]);

  useEffect(() => {
    if (formik.values.receivingOrg) {
      const fetchFinalGoods = async () => {
        const response = await fetch(
          `http://localhost:3000/api/final-goods/orgId/${formik.values.receivingOrg.id}`
        );

        if (response.status === 200 || response.status === 201) {
          const result = await response.json();

          const response2 = await fetch(
            `http://localhost:3000/api/bill-of-materials/all/${formik.values.receivingOrg.id}`
          );

          if (response2.status === 200 || response2.status === 201) {
            const result2 = await response2.json();

            console.log(result2);

            let dataWithBOM = [];

            if (result2.length !== 0) {
              const data = result.filter((el) =>
                formik.values.lineItems
                  .map((item) => item.finalGood.skuCode)
                  .includes(el.skuCode)
                  ? null
                  : el
              );

              dataWithBOM = data.filter((finalGood) =>
                result2.map((bom) => bom.finalGood.id).includes(finalGood.id)
              );
            }

            setFinalGoods(dataWithBOM);
          }
        }
      };

      fetchFinalGoods();
    }
  }, [formik.values.lineItems]);

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const addLineItem = (quantity, inputValue) => {
    const rawMaterial = options.find(
      (option) => option.skuCode === inputValue.skuCode
    );
    let finalGood;
    let newItem;

    if (selectedFinalGood) {
      finalGood = finalGoods.find(
        (finalGood) => finalGood.skuCode === selectedFinalGood.skuCode
      );
      newItem = {
        id: uuid(),
        quantity: quantity,
        rawMaterial: rawMaterial,
        indicativePrice: rawMaterial.unitPrice,
        finalGood: finalGood,
      };
    } else {
      newItem = {
        id: uuid(),
        quantity: quantity,
        rawMaterial: rawMaterial,
        indicativePrice: rawMaterial.unitPrice,
      };
    }

    const updatedLineItems = [...formik.values.lineItems, newItem];
    formik.setFieldValue('lineItems', updatedLineItems);
    setUpdateTotalPrice(
      updatedLineItems.reduce((a, b) => {
        return a + b.quantity * b.indicativePrice;
      }, 0)
    );
    setInputValue('');
    setSelectedFinalGood('');
    formik.setFieldValue('numProd', 1);
  };

  const deleteLineItems = (ids) => {
    const updatedLineItems = formik.values.lineItems.filter(
      (el) => !ids.includes(el.id)
    );
    console.log(updatedLineItems);
    formik.setFieldValue('lineItems', updatedLineItems);
    const updatedTotalPrice = updatedLineItems.reduce((a, b) => {
      return a + b.quantity * b.indicativePrice;
    }, 0);
    setUpdateTotalPrice(updatedTotalPrice);
    setInputValue('');
    inquiry
      ? (inquiry.total = updatedTotalPrice)
      : formik.setFieldValue('totalPrice', updatedTotalPrice);
  };

  const updateLineItems = (newRow, oldRow) => {
    const updatedRow = { ...newRow };

    if (
      newRow.quantity === oldRow.quantity &&
      newRow.matchingFinalGood === oldRow.matchingFinalGood
    ) {
      return oldRow;
    }

    // Open error alert if orice is < 1
    if (newRow.quantity < 1) {
      const message = 'Quantity must be positive!';
      handleAlertOpen(message, 'error');
      throw new Error(message);
    }

    let totalPrice = 0;
    for (const lineItem of formik.values.lineItems) {
      if (lineItem.id == updatedRow.id) {
        lineItem.quantity = updatedRow.quantity;
        lineItem.matchingFinalGood = updatedRow.matchingFinalGood;
      }

      totalPrice += lineItem.indicativePrice * lineItem.quantity;
    }
    setUpdateTotalPrice(totalPrice);

    return updatedRow;
  };

  // Check if SI has no PRs ==> Normal SI
  const noPRs = inquiry ? inquiry.purchaseRequisitions?.length === 0 : true;

  // Value getter for final good
  const finalGoodValueGetter = (params) => {
    return params.row.finalGood
      ? params.row.finalGood.name + ' [' + params.row.finalGood.skuCode + ']'
      : '';
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
      field: 'quantity',
      headerName: 'Quantity *',
      flex: 1,
      editable: formik.values.status === 'draft' && noPRs,
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 1,
      valueGetter: (params) => {
        return params.row.rawMaterial.unitPrice;
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        console.log(params);
        return params.row.rawMaterial.unitPrice * params.row.quantity;
      },
    },
    {
      field: 'finalGood',
      headerName: 'Matching Final Good',
      flex: 1.5,
      valueGetter: finalGoodValueGetter,
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
                disabled={
                  !formik.isValid ||
                  formik.isSubmitting ||
                  formik.values.lineItems.length === 0
                }
                onClick={formik.handleSubmit}
              >
                Save
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent>
          {inquiry && (
            <>
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
              <TextField
                fullWidth
                error={Boolean(formik.touched.id && formik.errors.id)}
                helperText={formik.touched.id && formik.errors.id}
                label="Receiving Organisation [Blank for non registered organisation]"
                margin="normal"
                name="id"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.receivingOrg}
                variant="outlined"
                disabled
              />
            </>
          )}
          {!inquiry && (
            <Autocomplete
              disabled={Boolean(inquiry)}
              filterSelectedOptions
              fullWidth
              options={orgOptions}
              getOptionLabel={(option) => `[${option.uen}] ${option.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Receiving Organisation [Blank for non registered organisation]"
                />
              )}
              onChange={(event, newInputValue) => {
                formik.setFieldValue('receivingOrg', newInputValue);
              }}
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
          <DatePicker
            disabled={Boolean(inquiry)}
            renderInput={(props) => (
              <TextField sx={{ marginTop: 2 }} {...props} />
            )}
            label="Expiry Date"
            value={formik.values.expiryDate}
            minDate={new Date()}
            onChange={(newValue) => {
              formik.setFieldValue('expiryDate', newValue);
            }}
            inputFormat="dd/MM/yyyy"
          />
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
          {/* Adding and Removing of SI Line Items
          Only available if draft SI and not linked to PRs */}
          {formik.values.status === 'draft' && noPRs && (
            <Box my={2} display="flex" justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                <Autocomplete
                  sx={{ width: 300 }}
                  options={options}
                  getOptionLabel={(option) =>
                    `${option.name} - ${option.skuCode}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Raw Materials" />
                  )}
                  onChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                />
                {formik.values.receivingOrg ? (
                  <Autocomplete
                    sx={{ width: 300 }}
                    options={finalGoods}
                    renderInput={(params) => (
                      <TextField {...params} label="Supplier Final Good" />
                    )}
                    getOptionLabel={(option) =>
                      `${option.name} - ${option.skuCode}`
                    }
                    onChange={(event, newInputValue) => {
                      setSelectedFinalGood(newInputValue);
                    }}
                  />
                ) : (
                  <></>
                )}
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
                    formik.values.numProd === null ||
                    (Boolean(formik.values.receivingOrg) && !selectedFinalGood)
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
            checkboxSelection={formik.values.status !== 'sent' && noPRs}
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
