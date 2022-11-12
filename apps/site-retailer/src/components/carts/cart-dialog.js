import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  AppBar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid, gridColumnVisibilityModelSelector } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useShoppingCart } from '../context/shopping-cart-context';
import { CartConfirmDialog } from './cart-confirm-dialog';
import { CartPODialog } from './cart-purchase-order-dialog';
import { ViewPODialog } from './view-po-dialog';

export const CartDialog = (props) => {
  const { open, handleClose, cart, handleAlertOpen } = props;
  const { removeCart, removeFromCart, updateCartLineItem } = useShoppingCart();

  const [purchaseOrders, setPurchaseOrders] = useState([]);

  // Quantity of line items that are still available
  // Initially this will be all of the cart line items
  // But as each line item is used for PO, decrease their qty
  // Also use this to check for the quantity that is allowed for each PO
  // In addition, this can be used to check if checkout can proceed
  const [availableLineItems, setAvailableLineItems] = useState([]);

  const [discount, setDiscount] = useState(0);

  // Get the discount available for this cart, if any
  const getDiscountForCart = async () => {
    const response = await fetch(
      'http://localhost:3000/api/bulk-discounts/discount',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organisationId: cart.supplier.id,
          totalPrice: cart.totalPrice,
          totalWeight: cart.totalWeight,
        }),
      }
    );

    if (response.status == 200 || response.status == 201) {
      const result = await response.json();
      setDiscount(result);
    }
  };

  useEffect(() => {
    setAvailableLineItems(JSON.parse(JSON.stringify(cart.cartLineItems)));
    getDiscountForCart();
  }, [open]);

  // Submission
  // Loading buttons
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Checkout Cart
  const handleCheckout = async () => {
    if (availableLineItems.length === 0) {
      let response;

      for (const purchaseOrder of purchaseOrders) {
        let poLineItems = [];

        poLineItems = purchaseOrder.poLineItemDtos.map((item) => {
          return {
            quantity: item.quantity,
            price: item.finalGood.unitPrice,
            finalGoodId: item.finalGood.id,
          };
        });

        purchaseOrder.poLineItemDtos = poLineItems;

        response = await fetch(`http://localhost:3000/api/purchase-orders`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchaseOrder),
        });
      }

      if (response.status == 200 || response.status == 201) {
        removeCart(cart.supplierId);
        onClose();
        handleAlertOpen(`Successfully created Purchase Order(s)!`, 'success');
      } else {
        const result = await response.json();
        handleAlertOpen('Failed to Create Purchase Order', 'error');
      }
    } else {
      handleAlertOpen(
        'Allocate all the remaining cart items before checking out',
        'error'
      );
    }
  };

  // View PO Helper
  const [selectedRow, setSelectedRow] = useState();
  const [openViewPODialog, setOpenViewPODialog] = useState(false);

  // Delete Confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Delete a cart line item in the cart
  const handleCartLineItemDelete = (row) => {
    console.log(row);
    removeFromCart(cart.supplier.id, row.finalGood.id);
    const remainingLineItems = cart.cartLineItems.filter(
      (cartLineItem) => cartLineItem.id != row.id
    );

    const finalGoodToRemoveId = row.finalGood.id;

    for (const purchaseOrder of purchaseOrders) {
      purchaseOrder.poLineItemDtos = purchaseOrder.poLineItemDtos.filter(
        (purchaseOrderLineItem) =>
          purchaseOrderLineItem.finalGood.id !== finalGoodToRemoveId
      );
    }

    setPurchaseOrders((purchaseOrders) =>
      purchaseOrders.filter(
        (purchaseOrder) => purchaseOrder.poLineItemDtos.length !== 0
      )
    );
  };

  // For cart line item
  const deleteButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setSelectedRow(params.row);
          handleConfirmDialogOpen();
        }}
      >
        <RemoveCircleOutlineIcon color="primary" />
      </IconButton>
    );
  };

  // Delete PO Confirm dialog
  const [poConfirmDialogOpen, setPOConfirmDialogOpen] = useState(false);
  const handlePOConfirmDialogOpen = () => {
    setPOConfirmDialogOpen(true);
  };
  const handlePOConfirmDialogClose = () => {
    setPOConfirmDialogOpen(false);
  };

  // Delete a purchase order
  const deletePurchaseOrder = () => {
    handleAvailableLineItemsChange(selectedRow.poLineItemDtos, 'delete');
    setPurchaseOrders((purchaseOrders) =>
      purchaseOrders.filter((purchaseOrder) => {
        return purchaseOrder.id !== selectedRow.id;
      })
    );
  };

  useEffect(() => console.log(availableLineItems), [availableLineItems]);

  // Action button
  const actionButtons = (params) => {
    return (
      <>
        <IconButton
          onClick={(event) => {
            setSelectedRow(params.row);
            setOpenViewPODialog(true);
          }}
        >
          <InfoIcon color="primary" />
        </IconButton>
        <IconButton
          onClick={(event) => {
            setSelectedRow(params.row);
            handlePOConfirmDialogOpen();
          }}
        >
          <RemoveCircleOutlineIcon color="primary" />
        </IconButton>
      </>
    );
  };

  // PO dialog
  const [poDialogOpen, setPODialogOpen] = useState(false);
  const handlePODialogOpen = () => {
    setPODialogOpen(true);
  };
  const handlePODialogClose = () => {
    setPODialogOpen(false);
  };

  // Close dialog
  const onClose = () => {
    handleClose();
    setError('');
    setLoading(false);
    setPurchaseOrders([]);
    setAvailableLineItems([]);
    setDiscount(0);
  };

  // Handling the update of a cart line item quantity
  const updateCartLineItemQuantity = (newRow, oldRow) => {
    const updatedRow = { ...newRow };

    // Open error alert if quantity is < 1
    if (newRow.quantity < 1) {
      const message = 'Quantity must be positive!';
      handleAlertOpen(message, 'error');
      throw new Error(message);
    }

    let cannotUpdate = false;
    // If new value is greater than previous, the excess should be added to available line items
    console.log(newRow.quantity - oldRow.quantity);
    if (newRow.quantity - oldRow.quantity > 0) {
      const temporaryLineItems = [];
      let present = false;
      setAvailableLineItems((availableLineItems) =>
        availableLineItems.map((availableLineItem) => {
          if (availableLineItem.id === newRow.id) {
            present = true;
            return {
              ...availableLineItem,
              quantity:
                Number(availableLineItem.quantity) +
                (newRow.quantity - oldRow.quantity),
            };
          } else {
            return availableLineItem;
          }
        })
      );

      if (!present) {
        temporaryLineItems.push({
          cartId: cart.id,
          finalGood: newRow.finalGood,
          id: cart.cartLineItems.find(
            (lineItem) => lineItem.finalGood.id === newRow.finalGood.id
          ).id,
          quantity: newRow.quantity - oldRow.quantity,
        });
      }

      setAvailableLineItems((availableLineItems) =>
        availableLineItems.concat(temporaryLineItems)
      );
      // If the new value is less than the previous value
    } else {
      // Already allocated fully, cannot alter quantity
      if (availableLineItems.length === 0) {
        const message = `Purchase order allocation has been completed, cannot alter quantity`;
        handleAlertOpen(message, 'error');
        cannotUpdate = true;
      } else {
        setAvailableLineItems((availableLineItems) =>
          availableLineItems.map((availableLineItem) => {
            if (availableLineItem.id === newRow.id) {
              // Less than what is already allocated
              if (
                availableLineItem.quantity -
                  (oldRow.quantity - newRow.quantity) <
                0
              ) {
                const message = `Purchase order allocation has exceeded the line item quantity, new value difference cannot be greater than ${availableLineItem.quantity}`;
                handleAlertOpen(message, 'error');
                cannotUpdate = true;
                return availableLineItem;
              } else {
                // Avilable becomes 0, will be removed

                return {
                  ...availableLineItem,
                  quantity:
                    availableLineItem.quantity -
                    (oldRow.quantity - newRow.quantity),
                };
              }
            } else {
              return availableLineItem;
            }
          })
        );

        // If there are any line item with quantity of 0, remove it
        setAvailableLineItems((availableLineItems) =>
          availableLineItems.filter((lineItem) => {
            return lineItem.quantity !== 0;
          })
        );
      }
    }

    if (!cannotUpdate) {
      console.log('Can update');
      let totalPrice = 0;

      updateCartLineItem(updatedRow.id, updatedRow.quantity);

      for (const lineItem of cart.cartLineItems) {
        if (lineItem.id == updatedRow.id) {
          lineItem.quantity = updatedRow.quantity;
          lineItem.finalGood = updatedRow.finalGood;
        }

        console.log(lineItem);

        totalPrice += lineItem.finalGood.unitPrice * lineItem.quantity;
      }
      formik.setFieldValue('totalPrice', totalPrice);

      return updatedRow;
    } else {
      console.log('Returning old row');
      throw new Error('Cannot update');
    }
  };

  // Change for PO prices whenever a cart line item is deleted
  // Will need to recalculate based on discount too
  useEffect(() => {
    getDiscountForCart();

    setPurchaseOrders((purchaseOrders) =>
      purchaseOrders.map((purchaseOrder) => {
        return {
          ...purchaseOrder,
          totalPrice:
            purchaseOrder.poLineItemDtos.reduce(
              (a, b) => a + b.quantity * b.finalGood.unitPrice,
              0
            ) *
            ((100 - discount) / 100),
        };
      })
    );
  }, [cart.cartLineItems, discount]);

  // Whenever a PO is created or deleted
  const handleAvailableLineItemsChange = (poLineItems, type) => {
    if (type === 'create') {
      // Creating PO
      // Deduct the quantity from the list of avaiable line item
      for (const poLineItem of poLineItems) {
        console.log(poLineItem);

        setAvailableLineItems((availableLineItems) =>
          availableLineItems.map((availableLineItem) => {
            if (availableLineItem.finalGood.id === poLineItem.finalGood.id) {
              return {
                ...availableLineItem,
                quantity: availableLineItem.quantity - poLineItem.quantity,
              };
            } else {
              return availableLineItem;
            }
          })
        );
      }

      // If there are any line item with quantity of 0, remove it
      setAvailableLineItems((availableLineItems) =>
        availableLineItems.filter((lineItem) => {
          return lineItem.quantity !== 0;
        })
      );
    } else if (type === 'delete') {
      console.log('Handling Delete');
      const temporaryLineItems = [];

      let counter = 0;
      for (const poLineItem of poLineItems) {
        let present = false;
        counter++;

        console.log(counter);
        console.log(availableLineItems);

        availableLineItems.map((availableLineItem) => {
          // Line item with the final good is still present, just update the qty
          console.log(availableLineItem);
          console.log(poLineItem);

          if (availableLineItem.finalGood.id == poLineItem.finalGood.id) {
            present = true;
            temporaryLineItems.push({
              cartId: availableLineItem.cartId,
              finalGood: availableLineItem.finalGood,
              id: availableLineItem.id,
              quantity:
                Number(availableLineItem.quantity) +
                Number(poLineItem.quantity),
            });
            // Line item no longer exist, need to reconstruct it from the po line item
          }
          console.log(temporaryLineItems);
        });

        if (!present) {
          console.log(present);
          console.log('Adding to the available items');
          console.log(poLineItem);
          temporaryLineItems.push({
            cartId: cart.id,
            finalGood: poLineItem.finalGood,
            id: cart.cartLineItems.find(
              (lineItem) => lineItem.finalGood.id === poLineItem.finalGood.id
            ).id,
            quantity: poLineItem.quantity,
          });
        }
      }

      setAvailableLineItems(temporaryLineItems);
    }
  };

  const formik = useFormik({
    initialValues: {
      supplierName: cart ? cart.supplier.name : '',
      totalPrice: cart ? cart.totalPrice : '',
    },
    enableReinitialize: true,
  });

  //Columns for cart line items datagrid, column headers & specs
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      flex: 1,
    },
    {
      field: 'finalGoodName',
      headerName: 'Final Good Name',
      width: 200,
      flex: 3,
      valueGetter: (params) => {
        return params.row.finalGood.name ? params.row.finalGood.name : '';
      },
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 150,
      flex: 1,
      valueGetter: (params) => {
        return params.row.finalGood.unitPrice
          ? params.row.finalGood.unitPrice
          : '';
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 150,
      editable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.row.quantity ? params.row.quantity : '';
      },
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      valueGetter: (params) => {
        return params.row.finalGood.unitPrice * params.row.quantity;
      },
      valueFormatter: (params) => (params.value ? `$ ${params.value}` : ''),
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      renderCell: deleteButton,
    },
  ];

  const rows = cart.cartLineItems;

  //Columns for datagrid, column headers & specs
  const poColumns = [
    {
      field: 'deliverTo',
      headerName: 'Deliver To',
      flex: 1,
      valueGetter: (params) => {
        return params.row.deliveryAddress;
      },
    },
    {
      field: 'deliveryDate',
      headerName: 'Deliver On',
      flex: 2,
      valueFormatter: (params) => {
        return DayJS(params.value).format('DD MMM YYYY');
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      valueGetter: (params) => {
        return params.row.totalPrice;
      },
      valueFormatter: (params) =>
        params.value ? `$ ${params.value.toFixed(2)}` : '',
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: actionButtons,
    },
  ];

  const poRows = purchaseOrders;

  return (
    <>
      <ViewPODialog
        purchaseOrder={selectedRow}
        openViewPODialog={openViewPODialog}
        setOpenViewPODialog={setOpenViewPODialog}
      />
      <CartPODialog
        open={poDialogOpen}
        handleClose={handlePODialogClose}
        cart={cart}
        discount={discount}
        setPurchaseOrders={setPurchaseOrders}
        availableLineItems={availableLineItems}
        handleAvailableLineItemsChange={handleAvailableLineItemsChange}
        handleAlertOpen={handleAlertOpen}
      />
      <CartConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={'Delete Cart Line Item'}
        dialogContent={
          'Are you sure you want to delete this line item? It will also be removed from all PO (if any)'
        }
        dialogAction={() => handleCartLineItemDelete(selectedRow)}
      />
      <CartConfirmDialog
        open={poConfirmDialogOpen}
        handleClose={handlePOConfirmDialogClose}
        dialogTitle={'Delete Purchase Order'}
        dialogContent={'Are you sure you want to delete this purchase order?'}
        dialogAction={deletePurchaseOrder}
      />
      <form onSubmit={formik.handleSubmit}>
        <Dialog
          fullScreen
          open={open}
          onClose={onClose}
          aria-labelledby="responsive-dialog-title"
        >
          <AppBar color="primary" sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                disabled={loading}
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Cart
              </Typography>
              {loading ? (
                <LoadingButton
                  fullWidth
                  loading={loading}
                  loadingPosition="start"
                  size="medium"
                  variant="outlined"
                >
                  Loading
                </LoadingButton>
              ) : (
                <Button
                  disabled={!formik.isValid || formik.isSubmitting}
                  autoFocus
                  color="inherit"
                  size="medium"
                  onClick={handleCheckout}
                  variant="outlined"
                >
                  Checkout
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <DialogContent style={{ backgroundColor: '#f8f8f8' }}>
            <Box mr={2} flex={1} display="flex" justifyContent="space-between">
              <TextField
                disabled
                sx={{ width: '66%' }}
                color="primary"
                fullWidth
                label="Supplier Name"
                margin="normal"
                name="supplierName"
                value={formik.values.supplierName}
                variant="outlined"
                size="small"
              />
              <TextField
                disabled
                sx={{ width: '16%' }}
                color="primary"
                label="Total Price"
                margin="normal"
                name="totalPrice"
                value={formik.values.totalPrice}
                variant="outlined"
                size="small"
              />
              <TextField
                disabled
                sx={{ width: '16%' }}
                color="primary"
                label="Bulk Discount Obtained"
                margin="normal"
                name="discount"
                value={discount}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Box>
            <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
              Cart Line Items
            </Typography>
            <Card>
              <Box>
                <DataGrid
                  autoHeight
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  allowSorting={true}
                  //   components={{
                  //     Toolbar: GridToolbar,
                  //   }}
                  disableSelectionOnClick
                  //   checkboxSelection={true}
                  //   onSelectionModelChange={(ids) => {
                  //     setSelectionModel(ids);
                  //   }}
                  experimentalFeatures={{ newEditingApi: true }}
                  processRowUpdate={updateCartLineItemQuantity}
                />
              </Box>
            </Card>
            <Box display="flex" justifyContent="space-between" mt={3} mb={1}>
              <Typography variant="h6" component="div">
                Purchase Orders
              </Typography>
              {availableLineItems.length !== 0 ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handlePODialogOpen}
                >
                  Create Purchase Order
                </Button>
              ) : (
                <></>
              )}
            </Box>
            <Card>
              <Box>
                <DataGrid
                  autoHeight
                  rows={purchaseOrders}
                  columns={poColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  allowSorting={true}
                  //   components={{
                  //     Toolbar: GridToolbar,
                  //   }}
                  disableSelectionOnClick
                  //   checkboxSelection={true}
                  //   onSelectionModelChange={(ids) => {
                  //     setSelectionModel(ids);
                  //   }}
                  //   editMode="row"
                  //   experimentalFeatures={{ newEditingApi: true }}
                />
              </Box>
            </Card>
            <Box display="flex" justifyContent={'center'}>
              <Typography variant="caption" color="red">
                {error}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
};
