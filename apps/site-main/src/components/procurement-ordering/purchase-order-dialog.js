import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Autocomplete, Button, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { addDays, parseISO } from "date-fns";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { fetchQuotations } from "../../helpers/procurement-ordering";
import { createPurchaseOrder, fetchWarehouses } from "../../helpers/procurement-ordering/purchase-order";


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
    // console.log(values);

    const submitValues = {
      deliveryAddress: values.deliveryAddress,
      totalPrice: values.totalPrice,
      deliveryDate: values.deliveryDate,
      currentOrganisationId: organisationId,
      quotationId: formik.values.quotation.id,
      userContactId: user.contact.id,
    }

    const poLineItems = formik.values.poLineItems.map((item) => {
      return {
        quantity: item.quantity,
        price: item.price,
        rawMaterialId: item.rawMaterial.id,
        // finalGoodId:
      }
    })

    console.log(submitValues);
    console.log(poLineItems);

    // Create new PO
    if (action === 'POST') {
      // call create api
      // TBD: send email to supplier
      createPurchaseOrder(submitValues, poLineItems)
        .then((res) => {
          onClose();
          handleAlertOpen(`Successfully Created and Sent Purchase Order ${res.id}!`, 'success');
        })
        .catch(err => handleAlertOpen('Failed to Create Purchase Order', 'error'));
    }

    // Update PO
    if (action === 'PATCH') {
      // update PO
    }
  };

  const [quotations, setQuotations] = useState([]);
  const getQuotations = async () => {
    const data = await fetchQuotations()
      .then((result) => result.filter((quotation) => 
        quotation.salesInquiry.currentOrganisation.id === organisationId &&
        !quotation.purchaseOrder
      ));
    // console.log(data);
    setQuotations(data);
  }

  // const [warehouse, setWarehouse] = useState();
  const [warehouses, setWarehouses] = useState([]);
  const getWarehouses = async () => {
    const data = await fetchWarehouses(organisationId);
    setWarehouses(data);
  }

  const formik = useFormik({
    initialValues: {
      id: purchaseOrder ? purchaseOrder.id : null,
      status: purchaseOrder ? purchaseOrder.status : 'pending',
      deliveryAddress: purchaseOrder ? purchaseOrder.deliveryAddress : null,
      totalPrice: purchaseOrder ? purchaseOrder.totalPrice : 0,
      created: purchaseOrder ? purchaseOrder.created : null,
      deliveryDate: purchaseOrder ? parseISO(purchaseOrder.deliveryDate) : null,
      currentOrganisation: purchaseOrder ? purchaseOrder.currentOrganisation : user.organisation,
      orgContact: purchaseOrder ? purchaseOrder.orgContact : null,
      userContact: purchaseOrder ? purchaseOrder.userContact : null,
      supplierContact: purchaseOrder ? purchaseOrder.supplierContact : null,
      poLineItems: purchaseOrder ? purchaseOrder.poLineItems : [],
      followUpLineItems: purchaseOrder ? purchaseOrder.followUpLineItems : [],
      quotation: purchaseOrder ? purchaseOrder.quotation : null,
    },
    validationSchema: Yup.object({
      deliveryAddress: Yup.string().required(),
      totalPrice: Yup.number().positive().required(),
      deliveryDate: Yup.date().required(),
      quotation: Yup.object().defined().required(),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Select Quotation -> populate poLineItems, calculate totalPrice
  // Clear Quotation selection -> clear poLineItems, set totalPrice to 0
  useEffect(() => {
    // create PO
    if (action === 'POST') {
      // console.log('post')
      formik.setFieldValue('poLineItems', 
        formik.values.quotation ? 
          formik.values.quotation.quotationLineItems : []);
      formik.setFieldValue('totalPrice', 
        formik.values.quotation ? 
          formik.values.quotation.totalPrice : 0);
      formik.setFieldValue('deliveryDate', 
        formik.values.quotation ? 
          addDays(new Date(), formik.values.quotation.leadTime) : new Date());
    }
  }, [formik.values.quotation])

  useEffect(() => {
    // fetch when opening create dialog
    if (open && action === 'POST') { 
      formik.setFieldValue('deliveryDate', new Date())
      getQuotations();
      getWarehouses();
    }
    // if (open &&  action === 'PATCH') {
    //   console.log(purchaseOrder)
    // }
  }, [open])

  const onClose = () => {
    setQuotations([]);
    setWarehouses([]);
    handleClose();
    formik.resetForm();
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
        return params.row ? params.row.rawMaterial.name : '';
      }
    },
    {
      field: "skuCode",
      headerName: "SKU",
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.skuCode : '';
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
                isOptionEqualToValue={(option, value) => option.id === value.id}
                // value={formik.values.quotation}
                onChange={(e, value) => formik.setFieldValue('quotation', value)}
                renderInput={(params) => (<TextField {...params} label="Quotation ID" />)}
              />
            )}
            {purchaseOrder && (
              <TextField
                label="Quotation ID"
                value={purchaseOrder.quotation.id}
                disabled={purchaseOrder}
              />
            )}
            <DatePicker
              disabled={!formik.values.quotation || purchaseOrder}
              renderInput={(props) => <TextField {...props} />}
              label="Delivery Date"
              value={formik.values.deliveryDate}
              minDate={formik.values.deliveryDate} // earliest date is current + leadTime OR purchaseOrder.deliveryDate
              onChange={(newValue) => {
                formik.setFieldValue('deliveryDate', newValue);
              }}
            />
            {/* Warehouse Selection */}
            {!purchaseOrder && (
              <Autocomplete
                id="warehouse-selector"
                sx={{ width: 600 }}
                options={warehouses}
                getOptionLabel={(option) => `[${option.name}] : ${option.address}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, value) => {
                  formik.setFieldValue('deliveryAddress', value ? value.address : null);
                }}
                renderInput={(params) => (<TextField {...params} label="Deliver To" />)}
              />
            )}
            {purchaseOrder && (
              <TextField
                label="Deliver To"
                value={purchaseOrder.deliveryAddress}
                disabled={purchaseOrder}
              />
            )}
          </Stack>
          <DataGrid
            autoHeight
            rows={purchaseOrder ? purchaseOrder.poLineItems : formik.values.poLineItems}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // onSelectionModelChange={(ids) => setSelectedRows(ids)}
            // experimentalFeatures={{ newEditingApi: true }}
            // processRowUpdate={handleRowUpdate}
          />
          
          {/* For Future Partial Fulfillment of Line Items */}
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
