import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Button, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useFormik } from "formik";
import { DataGrid } from "@mui/x-data-grid";
import * as Yup from "yup";

export const EditQuotationDialog = (props) => {
  const {
    action, // POST || PATCH
    open,
    handleClose,
    string,
    quotation,
    handleAlertOpen
  } = props;

  const initialValues = {
    id: quotation.id,
    created: quotation.created,
    totalPrice: quotation.totalPrice,
    supplierId: quotation.shellOrganisation.id,
    salesInquiryId: quotation.salesInquiry.id,
    quotationLineItems: quotation.quotationLineItems,
  }

  const schema = Yup.object({
    totalPrice: Yup
      .number()
      .integer()
      .positive()
      .required('Enter Total Price'),
  })

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    enableReinitialize: true,
  })
  
  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  const columns = [
    {
      field: 'price',
      headerName: 'Quoted Price *',
      flex: 1,
      editable: true,
      valueGetter: (params) => {
        return params.row.price;
      }
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row.quantity;
      }
    },
    {
      field: 'rawName',
      headerName: 'Raw Material Name',
      flex: 1,
      valueGetter: (params) => {
        return params.row.rawMaterial.name;
      }
    },
    {
      field: 'skuCode',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params) => {
        return params.row.rawMaterial.skuCode;
      }
    },
  ]

  const handleRowUpdate = (newRow) => {
    console.log(newRow);
    const updatedRow = {...newRow};
    formik.setFieldValue()
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
      >
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
              {/* {`Create `}
              {`View `} */}
              {string}
            </Typography>
            {action === 'POST' && <Button 
              variant="contained"
              disabled={
                !formik.isValid || 
                formik.isSubmitting
              }
              onClick={formik.handleSubmit}
            >
              Submit
            </Button>}
          </Toolbar>
        </AppBar>
        <DialogContent>
          {quotation && <TextField
            fullWidth
            error={Boolean(formik.touched.id && formik.errors.id)}
            helperText={formik.touched.id && formik.errors.id}
            label="Quotation ID"
            margin="normal"
            name="id"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.id}
            variant="outlined"
            disabled
          />}
          {quotation && <TextField
            fullWidth
            error={Boolean(formik.touched.created && formik.errors.created)}
            helperText={formik.touched.created && formik.errors.created}
            label="Date Created"
            margin="normal"
            name="created"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.created}
            variant="outlined"
            disabled
          />}
          <TextField
            fullWidth
            error={Boolean(formik.touched.totalPrice && formik.errors.totalPrice)}
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
            <TextField
              label="Sales Inquiry ID"
              value={quotation.salesInquiry.id}
              disabled={quotation}
            />
            <TextField
              label="Supplier ID"
              value={quotation.shellOrganisation.id}
              disabled={quotation}
            />
          </Stack>
          <DataGrid
            autoHeight
            rows={formik.values.quotationLineItems}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={handleRowUpdate}
          />
        </DialogContent>
      </Dialog>
    </form>
  )
}