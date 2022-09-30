import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar, Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

export const CreatePRSalesInquiryDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const {
    open,
    handleClose,
    string,
    purchaseRequisitions,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  // Formik Helpers and Variables
  const initialValues = {
    status: 'draft',
    lineItems: [],
    totalPrice: 0,
  };

  const schema = {
    status: Yup.string().required('Inquiry status is required'),
    // tbd
  };

  const handleOnSubmit = async (values) => {
    // if (action === 'POST') {
    //   const newLineItems = values.lineItems;
    //   let totalPrice = 0;

    //   const lineItems = [];

    //   for (const newLineItem of newLineItems) {
    //     let lineItem = {
    //       quantity: newLineItem.quantity,
    //       indicativePrice: newLineItem.rawMaterial.unitPrice,
    //       rawMaterialId: newLineItem.rawMaterial.id,
    //     };
    //     totalPrice += lineItem.quantity * lineItem.indicativePrice;

    //     lineItems.push(lineItem);
    //   }
    //   const user = JSON.parse(localStorage.getItem('user'));
    //   const currentOrganisationId = user.organisation.id;

    //   const salesInquiry = {
    //     totalPrice: totalPrice,
    //     currentOrganisationId: currentOrganisationId,
    //     salesInquiryLineItemsDtos: lineItems,
    //   };

    //   const lineItemJSON = JSON.stringify(salesInquiry);

    //   const response = await fetch('http://localhost:3000/api/sales-inquiry', {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: lineItemJSON,
    //   }).then((res) => res.json());

    //   //   // create
    //   //   const result = await createSalesInquiry(
    //   //     user.organisation.id,
    //   //     values.lineItems
    //   //   ).catch((err) => handleAlertOpen(`Error creating ${string}`, 'error'));

    //   // newly created SI doesn't return relations
    //   // fetch SI with relations
    //   const result = await response; 
    //   const inquiry = await fetchSalesInquiry(result.id);

    //   addSalesInquiry(inquiry);
    // } else if (action === 'PATCH') {
    //   // update
    //   const result = await updateSalesInquiry(updateTotalPrice, values);
    //   updateInquiry(result);
    // }
    onClose();
  };

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(schema),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  useEffect(() => {
    if (open) {
      // Collate similar raw-materials from PRs into 1 line item
      // key: rawM.id
      // value: subtotal (sum of all quantity for prs)
      const collatePRs = {};

      purchaseRequisitions.forEach((pr) => {
        collatePRs[pr.rawMaterial.id] = {id: pr.rawMaterial.id, original: 0, subtotal: 0, rawMaterial: pr.rawMaterial};
      })

      purchaseRequisitions.forEach((pr) => {
        collatePRs[pr.rawMaterial.id].original += pr.quantity;
        collatePRs[pr.rawMaterial.id].subtotal += pr.quantity;
      })

      const lineItems = []
      Object.values(collatePRs).forEach((item) => {
        lineItems.push(item);
      })

      formik.setFieldValue('lineItems', lineItems);
    }
  }, [open])

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowUpdate = (newRow, oldRow) => {
    // Check if quantity doesnt change

    // Check quantity must be >= minimum

    return newRow;
  };

  const prColumns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1
    },
    {
      field: 'prodOrderId',
      headerName: 'Prod. Order ID',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.productionOrder.id : ''
      }
    },
    {
      field: 'name',
      headerName: 'Raw Material',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}]` : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
    },
  ]

  const columns = [
    {
      field: 'subtotal',
      headerName: 'Quantity *',
      flex: 1,
      editable: formik.values.status === 'draft',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.unit : '';
      },
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.unitPrice : 0;
      },
    },
    {
      field: 'name',
      headerName: 'Raw Material',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}]` : '';
      },
    },
    {
      field: 'description',
      headerName: 'Product Description',
      flex: 3,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.description : '';
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
              {`Create `}
              {`Sales Inquiry from Purchase Requisitions`}
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
                Submit
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Stack direction="row" spacing={1}>
            <Box width={'20%'}>
              <TextField
                sx={{ width: 200 }}
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
              <TextField
                sx={{ width: 200 }}
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
            </Box>
            <Box width={'80%'}>
              <Typography sx={{ ml: 2 }}>Purchase Requisitions</Typography>
              <DataGrid 
                autoHeight
                rows={purchaseRequisitions}
                columns={prColumns}
                checkboxSelection={formik.values.status !== 'sent'}
                disableSelectionOnClick
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </Box>
          </Stack>
          <Typography sx={{ ml: 2 }}>Sales Inquiry Line Items</Typography>
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
            processRowUpdate={handleRowUpdate}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};
