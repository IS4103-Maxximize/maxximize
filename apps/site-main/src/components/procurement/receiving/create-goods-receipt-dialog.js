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
  Badge,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ListItemText,
  List,
  ListItem,
  useTheme,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { CreateGoodsReceiptDataGrid } from './goods-receipt-data-grid';
import { GoodsReceiptConfirmDialog } from './goods-receipt-confirm-dialog';
import useMediaQuery from '@mui/material/useMediaQuery';

export const CreateGoodsReceiptDialog = ({
  open,
  setOpen,
  addGoodsReceipt,
  handleAlertOpen,
}) => {
  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;
  const organisationId = user.organisation.id;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  //Error handling
  const [error, setError] = useState('');

  //Handle dialog close from child dialog
  const handleCreateDialogClose = () => {
    setOpen(false);
    setError('');
    setInputValue('');
    setAcceptedProducts([]);
    setFollowUpProducts([]);
    setCurrentQARules([]);
    formik.resetForm();
  };

  //Dialog Helpers
  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirm = () => {
    setOpenDialog(true);
  };

  const handleConfirmClose = () => {
    setOpenDialog(false);
  };

  //Create goods receipt, handle Formik submission
  const handleOnSubmit = async () => {
    const processedAcceptedProducts = acceptedProducts.map(
      (acceptedProduct) => ({
        quantity: Number(acceptedProduct.quantity),
        rawMaterialId: acceptedProduct.rawMaterial.id,
        volumetricSpace: Number(acceptedProduct.volume),
      })
    );

    console.log(followUpProducts);

    const processedFollowUpProducts = followUpProducts.map(
      (followUpProduct) => ({
        quantity: Number(followUpProduct.quantity),
        rawMaterialId: followUpProduct.rawMaterial.id,
        finalGoodId: followUpProduct.finalGood.id,
        unitPrice: Number(followUpProduct.price),
      })
    );

    console.log(processedFollowUpProducts);

    console.log(
      JSON.stringify({
        organisationId: organisationId,
        purchaseOrderId: formik.values.purchaseOrderId,
        recipientId: userId,
        createdDateTime: formik.values.dateReceived,
        goodsReceiptLineItemsDtos: processedAcceptedProducts,
        followUpLineItemsDtos: processedFollowUpProducts,
        description: formik.values.description,
      })
    );

    const response = await fetch('http://localhost:3000/api/goods-receipts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organisationId: organisationId,
        purchaseOrderId: formik.values.purchaseOrderId,
        recipientId: userId,
        createdDateTime: formik.values.dateReceived,
        goodsReceiptLineItemsDtos: processedAcceptedProducts,
        followUpLineItemsDtos: processedFollowUpProducts,
        description: formik.values.description,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      //Rerender parent data grid compoennt
      addGoodsReceipt(result);
      handleAlertOpen(`Created Goods Receipt ${result.id} successfully`);
      setError('');
      handleCreateDialogClose();
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  //Products
  const [acceptedProducts, setAcceptedProducts] = useState([]);
  const [followUpProducts, setFollowUpProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  //For PO number
  const [inputValue, setInputValue] = useState('');

  //Retrieve all PO
  const retrievePurchaseOrders = async () => {
    const response = await fetch(
      `http://localhost:3000/api/purchase-orders/all/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
      result = result.filter(
        (purchaseOrder) =>
          purchaseOrder.status !== 'fulfilled' &&
          purchaseOrder.status !== 'rejected'
      );
    }

    setPurchaseOrders(result);
  };

  //Retrieve all PO Line Items
  const retrievePOLineItems = async () => {
    if (
      purchaseOrders
        .map((purchaseOrder) => purchaseOrder.id.toString())
        .includes(formik.values.purchaseOrderId)
    ) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/purchase-orders/${formik.values.purchaseOrderId}`
        );

        if (response.status === 200 || response.status === 201) {
          const result = await response.json();

          console.log(result);

          //TOCHECK if something is wrong
          if (result.followUpLineItems.length !== 0) {
            setLineItems(result.followUpLineItems);
            setAcceptedProducts(
              result.followUpLineItems.map((followUpLineItem) => ({
                ...followUpLineItem,
                volume: 1,
              }))
            );
            setFollowUpProducts([]);
            setError('');
          } else if (result.status == 'fulfilled') {
            setError('Purchase Order already fulfilled!');
            setAcceptedProducts([]);
            setFollowUpProducts([]);
          } else {
            setLineItems(result.poLineItems);

            setAcceptedProducts(
              result.poLineItems.map((poLineItem) => ({
                ...poLineItem,
                volume: 1,
              }))
            );

            setFollowUpProducts([]);
            setError('');
          }
        } else {
          const result = await response.json();
          setError(result.message);
        }
      } catch (error) {
        setError(error);
      }
    } else {
      setError('No such purchase order within organisation');
      setAcceptedProducts([]);
      setFollowUpProducts([]);
    }
  };

  //Columns for datagrid
  const columnsForAccepted = [
    {
      field: 'name',
      headerName: 'Product Name',
      width: 300,
      flex: 3,
      valueGetter: (params) => {
        if (params.row.rawMaterial.name) {
          return params.row.rawMaterial.name;
        } else {
          return '';
        }
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      editable: true,
      flex: 1,
      preProcessEditCellProps: (params) => {
        const hasError =
          params.props.value <= 0 ||
          params.props.value >
            lineItems.find(
              (lineItem) =>
                lineItem.rawMaterial.name == params.row.rawMaterial.name
            ).quantity;
        if (hasError) {
          handleAlertOpen(
            'Quantity must be more than 0 and less than procured quantity, not updated. Press Esc to exit editing mode',
            'error'
          );
        }
        return { error: hasError };
      },
    },
    {
      field: 'volume',
      headerName: 'Volume',
      width: 120,
      editable: true,
      flex: 1,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value <= 0;
        if (hasError) {
          handleAlertOpen(
            'Volume must be more than 0, not updated. Press Esc to exit editing mode',
            'error'
          );
        }
        return { error: hasError };
      },
    },
  ];

  //Columns for datagrid
  const columnsForFollowUp = [
    {
      field: 'name',
      headerName: 'Product Name',
      width: 300,
      flex: 3,
      valueGetter: (params) => {
        if (params.row.rawMaterial.name) {
          return params.row.rawMaterial.name;
        } else {
          return '';
        }
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      editable: false,
      flex: 1,
    },
  ];

  //Updating a goods receipt line item entry, calling update API
  //Also alerts user of ourcome
  const handleRowUpdate = (newRow, type) => {
    const updatedRow = { ...newRow };

    if (type == 'accepted') {
      const originalQuantity = lineItems.filter(
        (lineItem) => lineItem.rawMaterial.name == updatedRow.rawMaterial.name
      )[0].quantity;
      const acceptedQuantity = updatedRow.quantity;

      //If the new quantity is less than what is in PO, new line item to be in follow up
      if (acceptedQuantity < originalQuantity) {
        const followUpQuantity = originalQuantity - acceptedQuantity;

        const followUpRow = JSON.parse(JSON.stringify(updatedRow));
        followUpRow.quantity = followUpQuantity;

        //Find the index of the follow up line item (if present)
        const index = followUpProducts.findIndex(
          (lineItem) =>
            lineItem.rawMaterial.name === updatedRow.rawMaterial.name
        );

        //Line Item does not exist on the follow up side
        if (index == -1) {
          const newFollowUpProducts = [...followUpProducts, { ...followUpRow }];

          setFollowUpProducts(newFollowUpProducts);

          //Line Item exists on the follow up side, just update the quantity
        } else {
          //Deepcopy current array
          const newFollowUpProducts = JSON.parse(
            JSON.stringify(followUpProducts)
          );
          newFollowUpProducts.splice(index, 1, followUpRow);
          setFollowUpProducts(newFollowUpProducts);
        }

        //Somehow if the quantity is set to be the same as what is original on PO
        //Just remove any line item on the follow up side
      } else if (acceptedQuantity == originalQuantity) {
        //Find the index of the line item on follow up side (if any)
        const index = followUpProducts.findIndex(
          (lineItem) =>
            lineItem.rawMaterial.name === updatedRow.rawMaterial.name
        );

        if (index != -1) {
          const newFollowUpProducts = JSON.parse(
            JSON.stringify(followUpProducts)
          );
          newFollowUpProducts.splice(index, 1);
          setFollowUpProducts(newFollowUpProducts);
        }
      }

      //Regardless of outcome, set new state for accepted list
      const acceptedIndex = acceptedProducts.findIndex(
        (lineItem) => lineItem.rawMaterial.name === updatedRow.rawMaterial.name
      );

      const newAcceptedProducts = [...acceptedProducts];
      newAcceptedProducts.splice(acceptedIndex, 1, updatedRow);
      setAcceptedProducts(newAcceptedProducts);

      return updatedRow;
    }
  };

  //Select Line Item from Accepted products
  const [acceptedSelectionModel, setAcceptedSelectionModel] = useState([]);
  //Select Line Item from Follow up products
  const [followUpSelectionModel, setFollowUpSelectionModel] = useState([]);

  const handleSwap = (selectedIds) => {
    let newFollowUpProducts = JSON.parse(JSON.stringify(followUpProducts));
    let newAcceptedProducts = JSON.parse(JSON.stringify(acceptedProducts));
    const productNames = [];

    for (const selectedId of selectedIds) {
      const productName = lineItems.find(
        (lineItem) => lineItem.id == selectedId
      ).rawMaterial.name;
      productNames.push(productName);

      //Accept swapping to follow up
      if (acceptedSelectionModel.length != 0) {
        //LineItem already present on the other side
        if (
          followUpProducts.some(
            (lineItem) => lineItem.rawMaterial.name == productName
          )
        ) {
          const lineItemToAdd = lineItems.find(
            (lineItem) => lineItem.id == selectedId
          );

          const index = followUpProducts.findIndex(
            (lineItem) => lineItem.rawMaterial.name === productName
          );

          newFollowUpProducts.splice(index, 1, lineItemToAdd);
        } else {
          newFollowUpProducts = newFollowUpProducts.concat(
            acceptedProducts.filter(
              (lineItem) => lineItem.rawMaterial.name == productName
            )
          );
        }

        setFollowUpProducts(newFollowUpProducts);
        setAcceptedProducts(
          acceptedProducts.filter(
            (lineItem) => !productNames.includes(lineItem.rawMaterial.name)
          )
        );
        //Follow Up swapping to accept
      } else {
        if (
          acceptedProducts.some(
            (lineItem) => lineItem.rawMaterial.name === productName
          )
        ) {
          const lineItemToAdd = lineItems.find(
            (lineItem) => lineItem.id == selectedId
          );

          const newLineItemToAdd = { ...lineItemToAdd, volume: 1 };

          const index = acceptedProducts.findIndex(
            (lineItem) => lineItem.rawMaterial.name === productName
          );

          newAcceptedProducts.splice(index, 1, newLineItemToAdd);
        } else {
          const lineItem = followUpProducts
            .filter((lineItem) => lineItem.rawMaterial.name == productName)
            .map((lineItem) => ({ ...lineItem, volume: 1 }));

          newAcceptedProducts = newAcceptedProducts.concat(lineItem);
        }

        setAcceptedProducts(newAcceptedProducts);
        setFollowUpProducts((result) =>
          result.filter((product) => !selectedIds.has(product.id))
        );
      }
    }
  };

  //Retrieve all QA checklists
  const [qaChecklists, setQAChecklists] = useState([]);

  const retrieveQAChecklists = async () => {
    const response = await fetch(
      `http://localhost:3000/api/qa-checklists/orgId/${organisationId}`
    );

    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
      result = result.filter(
        (checklist) => checklist.productType == 'rawmaterial'
      );
    }

    setQAChecklists(result);
  };

  useEffect(() => {
    retrieveQAChecklists();
    retrievePurchaseOrders();
  }, [open]);

  useEffect(() => {
    console.log(acceptedProducts);
  }, [acceptedProducts]);

  useEffect(() => {
    console.log(followUpProducts);
  }, [followUpProducts]);

  //Current Checklist
  const [currentChecklist, setCurrentChecklist] = useState();
  const [currentQARules, setCurrentQARules] = useState();

  const handleChecklistChange = (event) => {
    setCurrentQARules(
      qaChecklists.find((checklist) => checklist.name == event.target.value)
        .qaRules
    );
    setCurrentChecklist(
      qaChecklists.find((checklist) => checklist.name == event.target.value)
    );
  };

  const formik = useFormik({
    initialValues: {
      purchaseOrderId: '',
      dateReceived: new Date(),
      description: '',
    },
    validationSchema: Yup.object({
      purchaseOrderId: Yup.string().required('Purchase Order ID is required'),
      description: Yup.string(),
    }),
    onSubmit: handleConfirm,
  });

  return (
    <>
      <GoodsReceiptConfirmDialog
        open={openDialog}
        handleClose={handleConfirmClose}
        dialogTitle="Confirm Create"
        dialogContent="Are you sure you want to create this goods receipt?"
        dialogAction={handleOnSubmit}
      />
      <form onSubmit={formik.handleOnSubmit}>
        <Dialog
          fullScreen
          open={open}
          onClose={handleCreateDialogClose}
          disableEscapeKeyDown
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCreateDialogClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Create Goods Receipt
              </Typography>
              <Button
                autoFocus
                color="inherit"
                disabled={
                  !formik.isValid ||
                  (acceptedProducts.length == 0 && followUpProducts.length == 0)
                }
                size="medium"
                type="submit"
                variant="outlined"
                onClick={formik.handleSubmit}
              >
                Create
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Box>
              <Typography variant="body1" color="red">
                {error}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Autocomplete
                inputValue={inputValue}
                options={purchaseOrders.map((purchaseOrder) =>
                  purchaseOrder.id.toString()
                )}
                fullWidth
                onChange={(e, value) => {
                  setInputValue(value ? value : '');
                  formik.setFieldValue('purchaseOrderId', value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Purchase Order ID"
                    error={Boolean(
                      formik.touched.purchaseOrderId &&
                        formik.errors.purchaseOrderId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.purchaseOrderId &&
                      formik.errors.purchaseOrderId
                    }
                    value={formik.values.purchaseOrderId}
                    margin="normal"
                    name="purchaseOrderId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              <Button
                sx={{ marginLeft: 1 }}
                variant="contained"
                size="medium"
                color="primary"
                onClick={retrievePOLineItems}
              >
                Retrieve
              </Button>
            </Box>

            {/* With full width */}
            {!fullScreen && (
              <Box display="flex" justifyContent="space-evenly">
                <Box mt={2} ml={'2.5%'} mr={'2.5%'} sx={{ minWidth: '45%' }}>
                  <Box sx={{ minWidth: 360 }}>
                    <CreateGoodsReceiptDataGrid
                      header="Accepted"
                      products={acceptedProducts}
                      columns={columnsForAccepted}
                      setSelectionModel={setAcceptedSelectionModel}
                      handleRowUpdate={handleRowUpdate}
                      typeIn="accepted"
                    />
                  </Box>
                  <Box display="flex" justifyContent="center">
                    <IconButton
                      //sx={{ marginTop: 12 }}
                      size="medium"
                      disabled={
                        (acceptedSelectionModel.length == 0 &&
                          followUpSelectionModel.length == 0) ||
                        (acceptedSelectionModel.length > 0 &&
                          followUpSelectionModel.length > 0)
                      }
                      onClick={() => {
                        const selectedIds =
                          acceptedSelectionModel.length == 0
                            ? new Set(followUpSelectionModel)
                            : new Set(acceptedSelectionModel);
                        handleSwap(selectedIds);
                      }}
                    >
                      <SwapVertIcon fontSize="large" />
                    </IconButton>
                  </Box>
                  <Box sx={{ minWidth: 360 }}>
                    <CreateGoodsReceiptDataGrid
                      header="Follow Up"
                      products={followUpProducts}
                      columns={columnsForFollowUp}
                      setSelectionModel={setFollowUpSelectionModel}
                      handleRowUpdate={handleRowUpdate}
                      typeIn="followUp"
                    />
                  </Box>
                </Box>

                <Box mt={2} ml={'2.5%'} mr={'2.5%'} sx={{ minWidth: '45%' }}>
                  <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Quality Assurance
                  </Typography>
                  <TextField
                    select
                    defaultValue=""
                    error={Boolean(
                      formik.touched.checklist && formik.errors.checklist
                    )}
                    fullWidth
                    helperText={
                      formik.touched.checklist && formik.errors.checklist
                    }
                    label="Checklist"
                    value={currentChecklist}
                    margin="normal"
                    name="checklist"
                    onBlur={formik.handleBlur}
                    onChange={handleChecklistChange}
                    variant="outlined"
                    size="small"
                  >
                    {qaChecklists.length != 0 ? (
                      qaChecklists?.map((option) => (
                        <MenuItem key={option.id} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))
                    ) : (
                      <h5>&nbsp; &nbsp; No Checklists Found</h5>
                    )}
                  </TextField>
                  <List>
                    {currentQARules?.map((rule) => (
                      <ListItem key={rule.id}>
                        <FormControlLabel
                          value="top"
                          control={<Checkbox />}
                          label={`${rule.title} [${rule.description}]`}
                          labelPlacement="End"
                        />
                      </ListItem>
                    ))}
                  </List>
                  <TextField
                    error={Boolean(
                      formik.touched.description && formik.errors.description
                    )}
                    fullWidth
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    label="Description"
                    margin="normal"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    variant="outlined"
                    multiline
                    minRows={4}
                  />
                </Box>
              </Box>
            )}

            {fullScreen && (
              <>
                <Box mt={2}>
                  <Box sx={{ minWidth: 360 }}>
                    <CreateGoodsReceiptDataGrid
                      header="Accepted"
                      products={acceptedProducts}
                      columns={columnsForAccepted}
                      setSelectionModel={setAcceptedSelectionModel}
                      handleRowUpdate={handleRowUpdate}
                      typeIn="accepted"
                    />
                  </Box>
                  <Box display="flex" justifyContent="center">
                    <IconButton
                      //sx={{ marginTop: 12 }}
                      size="medium"
                      disabled={
                        (acceptedSelectionModel.length == 0 &&
                          followUpSelectionModel.length == 0) ||
                        (acceptedSelectionModel.length > 0 &&
                          followUpSelectionModel.length > 0)
                      }
                      onClick={() => {
                        const selectedIds =
                          acceptedSelectionModel.length == 0
                            ? new Set(followUpSelectionModel)
                            : new Set(acceptedSelectionModel);
                        handleSwap(selectedIds);
                      }}
                    >
                      <SwapVertIcon fontSize="large" />
                    </IconButton>
                  </Box>
                  <Box sx={{ minWidth: 360 }}>
                    <CreateGoodsReceiptDataGrid
                      header="Follow Up"
                      products={followUpProducts}
                      columns={columnsForFollowUp}
                      setSelectionModel={setFollowUpSelectionModel}
                      handleRowUpdate={handleRowUpdate}
                      typeIn="followUp"
                    />
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Quality Assurance
                </Typography>
                <TextField
                  select
                  defaultValue=""
                  error={Boolean(
                    formik.touched.checklist && formik.errors.checklist
                  )}
                  fullWidth
                  helperText={
                    formik.touched.checklist && formik.errors.checklist
                  }
                  label="Checklist"
                  value={currentChecklist}
                  margin="normal"
                  name="checklist"
                  onBlur={formik.handleBlur}
                  onChange={handleChecklistChange}
                  variant="outlined"
                  size="small"
                >
                  {qaChecklists.length != 0 ? (
                    qaChecklists?.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))
                  ) : (
                    <h5>&nbsp; &nbsp; No Checklists Found</h5>
                  )}
                </TextField>
                <List>
                  {currentQARules?.map((rule) => (
                    <ListItem key={rule.id}>
                      <FormControlLabel
                        value="top"
                        control={<Checkbox />}
                        label={`${rule.title} [${rule.description}]`}
                        labelPlacement="End"
                      />
                    </ListItem>
                  ))}
                </List>
                <TextField
                  error={Boolean(
                    formik.touched.description && formik.errors.description
                  )}
                  fullWidth
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  label="Description"
                  margin="normal"
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  variant="outlined"
                  multiline
                  minRows={4}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
};
