import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Autocomplete, Button, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { fetchQuotations } from "../../helpers/procurement-ordering";

export const PODialog = (props) => {
  const {
    action,
    open,
    handleClose,
    string,
    purchaseOrder,
    addPO,
    updatePO,
    handleAlertOpen,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const handleOnSubmit = async (values) => {
    // submit
  };

  const [quotations, setQuotations] = useState([]);
  const getQuotations = async () => {
    const data =  await fetchQuotations()
      .then((result) => result.filter((quotation) => 
        quotation.salesInquiry.currentOrganisation.id === organisationId));
    setQuotations(data);
  }
  useEffect(() => {
    // fetch when opening create dialog
    if (open && action === 'POST') { 
      getQuotations();
    }
  }, [open])

  const formik = useFormik({
    initialValues: {
      id: purchaseOrder ? purchaseOrder.id : null,
      status: purchaseOrder ? purchaseOrder.status : 'pending',
      deliveryAddres: purchaseOrder ? purchaseOrder.deliveryAddres : '',
      totalPrice: purchaseOrder ? purchaseOrder.totalPrice : 0,
      created: purchaseOrder ? purchaseOrder.created : null,
      deliveryDate: purchaseOrder ? purchaseOrder.deliveryDate : new Date(),
      unfulfilledQuantity: purchaseOrder ? purchaseOrder.unfulfilledQuantity : 0,
      currentOrganisation: purchaseOrder ? purchaseOrder.currentOrganisation : user.organisation,
      orgContact: purchaseOrder ? purchaseOrder.orgContact : null,
      userContact: purchaseOrder ? purchaseOrder.userContact : null,
      supplierContact: purchaseOrder ? purchaseOrder.supplierContact : null,
      poLineItems: purchaseOrder ? purchaseOrder.poLineItems : [],
      followUpPoLineItems: purchaseOrder ? purchaseOrder.followUpPoLineItems : [],
      quotation: purchaseOrder ? purchaseOrder.quotation : null,
    },
    validationSchema: Yup.object({}),
    // enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Select Quotation -> populate poLineItems, calculate totalPrice
  // Clear Quotation selection -> clear poLineItems, set totalPrice to 0
  useEffect(() => {
      formik.setFieldValue('poLineItems', 
        formik.values.quotation ? 
          formik.values.quotation.quotationLineItems : []);
      formik.setFieldValue('totalPrice', 
        formik.values.quotation ? 
          formik.values.quotation.totalPrice : 0);
  }, [formik.values.quotation])

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  const columns = [
    {
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Raw Material Name",
      flex: 2,
      valueGetter: (params) => {
        return params.row.rawMaterial.name;
      }
    },
    {
      field: "skuCode",
      headerName: "SKU",
      flex: 1,
      valueGetter: (params) => {
        return params.row.rawMaterial.skuCode;
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
              {!purchaseOrder && `Create `}
              {purchaseOrder &&`View `}
              {string}
            </Typography>
            {action === 'POST' && (
              <Button
                variant="contained"
                disabled={!formik.isValid || formik.isSubmitting}
                onClick={formik.handleSubmit}
              >
                Submit
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent>
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
            value={formik.values.totalPrice}
            variant="outlined"
            disabled
          />
          <Stack direction="row" spacing={1}>
            {/* Quotation Selection */}
            {!purchaseOrder && (
              <Autocomplete
                id="quotation-selector"
                sx={{ width: 300 }}
                options={quotations}
                getOptionLabel={(option) => option.id.toString()}
                value={formik.values.quotation}
                onChange={(e, value) => formik.setFieldValue('quotation', value)}
                renderInput={(params) => (
                  <TextField {...params} label="Quotation ID" />
                )}
              />
            )}
            {purchaseOrder && (
              <TextField
                label="Quotation ID"
                value={purchaseOrder.quotation.id}
                disabled={purchaseOrder}
              />
            )}
          </Stack>
          <DataGrid
            autoHeight
            rows={formik.values.poLineItems}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // onSelectionModelChange={(ids) => setSelectedRows(ids)}
            // experimentalFeatures={{ newEditingApi: true }}
            // processRowUpdate={handleRowUpdate}
          />
          {/* <DataGrid
            autoHeight
            rows={formik.values.followUpPoLineItems}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // onSelectionModelChange={(ids) => setSelectedRows(ids)}
            // experimentalFeatures={{ newEditingApi: true }}
            // processRowUpdate={handleRowUpdate}
          /> */}
        </DialogContent>
      </Dialog>
    </form>
  );
};
