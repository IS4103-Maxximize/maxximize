import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Box, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";


export const PoGoodsReceiptDialog = (props) => {
  const {
    // action,
    open,
    handleClose,
    // string,
    purchaseOrder,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const formik = useFormik({
    initialValues: {
      goodsReceipts: purchaseOrder ? purchaseOrder.goodsReceipts : [],
    },
    validationSchema: Yup.object({
      // bomLineItems: Yup.array()
    }),
    enableReinitialize: true,
    // handleSubmit: () => {}
  });

  // // Opening and Closing Dialog helpers
  // useEffect(() => {
  //   // fetch when opening create dialog
  //   if (open) {
  //     getProducts();
  //   }
  // }, [open])

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1
    },
    {
      field: 'createdDateTime',
      headerName: 'Created On',
      flex: 2,
      valueFormatter: (params) => {
        return dayjs(params.value).format('DD MMM YYYY, HH:mm');
      }
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1
    },
    {
      field: 'rawMaterial',
      headerName: 'Raw Material',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? `${params.row.product.name} [${params.row.product.skuCode}]` : '';
      }
    },
  ]

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
              {'View '}
              {`Purchase Order ${purchaseOrder ? purchaseOrder.id : ''}'s Goods Receipts`}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Stack direction="row" spacing={1} alignItems="baseline">
            {/* Purchase Order ID */}
            <TextField
              sx={{ width: 150 }}
              label="Purchase Order ID"
              margin="normal"
              name="purchase-order-id"
              value={purchaseOrder ? purchaseOrder.id : ''}
              variant="outlined"
              disabled
            />
          </Stack>
          {formik.values.goodsReceipts.map(
              (goodsreceipt, index) => {
                return (
                  // <Accordion>
                  //   <AccordionSummary>

                  //   </AccordionSummary>
                  // </Accordion>
                  <Box 
                    key={index}
                    sx={{ my: 2 }}
                  >
                    <Typography>{`Goods Receipt ${goodsreceipt.id}`}</Typography>
                    <Stack direction="row" spacing={2}>
                    <TextField
                      sx={{ width: 300 }}
                      label="Description"
                      margin="normal"
                      name="description"
                      value={goodsreceipt.description}
                      variant="outlined"
                      multiline
                      minRows={3}
                    />
                      <DataGrid
                        autoHeight
                        rows={goodsreceipt ? goodsreceipt.goodsReceiptLineItems : []}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                      />
                    </Stack>
                    
                  </Box>
                )
              }
            )
          }
        </DialogContent>
      </Dialog>
    </form>
  );
};
