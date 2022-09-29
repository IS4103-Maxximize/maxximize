import CloseIcon from "@mui/icons-material/Close";
import { Accordion, AccordionSummary, AppBar, Box, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { apiHost } from "../../helpers/constants";


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

  // Selected Line Items
  // const [selectedRows, setSelectedRows] = useState([])

  // const [goodReceipts, setGrs] = useState([])

  const formik = useFormik({
    initialValues: {
      goodReceipts: purchaseOrder ? purchaseOrder.goodReceipts : [],
    },
    validationSchema: Yup.object({
      // bomLineItems: Yup.array()
    }),
    enableReinitialize: true,
    // handleSubmit: () => {}
  });

  const fetchGoodsReceipts = async (ids) => {
    const apiUrl = `${apiHost}/goods-receipts`;
    const grs = []
    try {
      await ids.forEach(async (id) => {
        const gr = await fetch(`${apiUrl}/${id}`).then(res => res.json());
        grs.push(gr);
      })
      formik.setFieldValue('goodReceipts', grs);
    }
    catch (error) {
      formik.setFieldValue('goodReceipts', []);
      // setLoading(false);
    }
  }

  // useEffect(() => {
  //   if (open) {
  //     fetchGoodsReceipts(purchaseOrder.goodReceipts.map(gr => gr.id));
  //   }
  // }, [open])

  useEffect(() => {
    console.log(formik.values.goodReceipts)
  }, [formik.values.goodReceipts])

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
              {`Purchase Order ${purchaseOrder ? purchaseOrder.id : ''}'s Good Receipts`}
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
          {formik.values.goodReceipts.map(
              (goodreceipt, index) => {
                return (
                  // <Accordion>
                  //   <AccordionSummary>

                  //   </AccordionSummary>
                  // </Accordion>
                  <Box 
                    key={index}
                    sx={{ my: 2 }}
                  >
                    <Typography>{`Good Receipt ${goodreceipt.id}`}</Typography>
                    <DataGrid
                      // key={index}
                      autoHeight
                      rows={goodreceipt ? goodreceipt.goodReceiptLineItems : []}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                    />
                  </Box>
                )
              }
            )
          }
          {/* <DataGrid
            autoHeight
            rows={formik.values.goodReceipts}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            // experimentalFeatures={{ newEditingApi: true }}
            // processRowUpdate={handleRowUpdate}
            // onProcessRowUpdateError={(error) => {
            //   console.log(error);
            //   // remain in editing mode
            // }}
          /> */}
        </DialogContent>
      </Dialog>
    </form>
  );
};
