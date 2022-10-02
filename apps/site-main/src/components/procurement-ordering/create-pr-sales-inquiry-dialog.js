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
import { createSalesInquiryFromPurchaseRequisition } from '../../helpers/procurement-ordering/purchase-requisition';

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
    const salesInquiryLineItemsDtos = [];

    values.lineItems.forEach((item) => {
      const lineItemDto = {
        quantity: item.quantity,
        indicativePrice: item.rawMaterial.unitPrice,
        rawMaterialId: item.rawMaterial.id,
      }
      salesInquiryLineItemsDtos.push(lineItemDto);
    })

    const purchaseRequisitionIds = purchaseRequisitions.map(pr => pr.id);

    const createSalesInquiryDto = {
      currentOrganisationId: organisationId,
      totalPrice: formik.values.totalPrice,
      salesInquiryLineItemsDtos: salesInquiryLineItemsDtos,
      purchaseRequisitionIds: purchaseRequisitionIds
    }

    console.log(createSalesInquiryDto)

    createSalesInquiryFromPurchaseRequisition(createSalesInquiryDto)
      .then((result) => {
        onClose();
        handleAlertOpen(`Successfully Created Sales Inquiry ${result.id}!`, 'success')
      })
      .catch((error) => handleAlertOpen(`Failed to Create Sales Inquiry from Purchase Requisitions`, 'error'))
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
      const collatePRs = {};

      // Map raw-materials using rawM.id for key
      purchaseRequisitions.forEach((pr) => {
        collatePRs[pr.rawMaterial.id] = {id: pr.rawMaterial.id, original: 0, quantity: 0, rawMaterial: pr.rawMaterial};
      })

      purchaseRequisitions.forEach((pr) => {
        collatePRs[pr.rawMaterial.id].original += pr.expectedQuantity;
        collatePRs[pr.rawMaterial.id].quantity += pr.expectedQuantity;
      })

      const lineItems = []
      Object.values(collatePRs).forEach((item) => {
        lineItems.push(item);
      })

      const totalPrice = lineItems.reduce((a, b) => {
        return a + b.quantity * b.rawMaterial.unitPrice;
      }, 0)

      formik.setFieldValue('totalPrice', totalPrice);
      formik.setFieldValue('lineItems', lineItems);
    }
  }, [open])

  // DataGrid Helpers
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowUpdate = (newRow, oldRow) => {
    // Check if quantity doesnt change
    if (newRow.quantity === oldRow.quantity) {
      return oldRow;
    }

    // Check quantity must be >= original
    if (newRow.quantity < newRow.original) {
      const message = 'Quantity cannot be less than original quantity!';
      handleAlertOpen(message, 'error');
      throw new Error(message);
    }

    // Update line items to trigger total price update
    const newLineItems = formik.values.lineItems.map((item) => {
      return item.id === newRow.id ? newRow : item;
    })
    formik.setFieldValue('lineItems', newLineItems);
    handleAlertClose();
    return newRow;
  };

  // Update total price if quantity for line item changes
  useEffect(() => {
    if (formik.values.lineItems.length > 0) {
      const totalPrice = formik.values.lineItems.reduce((a, b) => {
        return a + b.quantity * b.rawMaterial.unitPrice;
      }, 0)
      formik.setFieldValue('totalPrice', totalPrice);
    }
  }, [formik.values.lineItems])

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
        return params.row ? params.row.productionLineItem.productionOrder.id : ''
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
      field: 'expectedQuantity',
      headerName: 'Expected Quantity',
      flex: 1,
    },
  ]

  const columns = [
    {
      field: 'quantity',
      headerName: 'Quantity *',
      flex: 1,
      editable: formik.values.status === 'draft',
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
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.unit : '';
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
            disableSelectionOnClick
            pageSize={5}
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={handleRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.log(error)
            }}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};
