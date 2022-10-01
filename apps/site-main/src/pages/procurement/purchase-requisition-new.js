import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { createPurchaseRequisitions } from "../../helpers/procurement-ordering/purchase-requisition";


export const PurchaseRequisitionNew = (props) => {
  const {
    open,
    handleClose,
    string,
    prodOrderId,
    prodLineItems,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // Create PRs and close dialog
  const handleOnSubmit = async (values) => {
    // submit
    console.log(values);

    const purchaseRequisitionDtos = formik.values.purchaseRequisitions.map((item) => {
      return {
        expectedQuantity: item.quantity,
        productionLineItemId: item.id,
        organisationId: organisationId,
        rawMaterialId: item.rawMaterial.id
      }
    });

    console.log(purchaseRequisitionDtos)

    createPurchaseRequisitions(purchaseRequisitionDtos)
      .then(res => {
        onClose();
        handleAlertOpen(`Successfully Created ${string}(s)!`, 'success');
      })
      .catch(err => handleAlertOpen(`Failed to Create ${string}`, 'error'))
  };

  // Selected Line Items
  const [selectedRows, setSelectedRows] = useState([]);

  const formik = useFormik({
    initialValues: {
      purchaseRequisitions: []
    },
    validationSchema: Yup.object({
      purchaseRequisitions: Yup.array().min(1, 'There must be at least 1 PR'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Opening and Closing Dialog helpers
  useEffect(() => {
    // fetch when opening create dialog
    if (open) {
      formik.setFieldValue('purchaseRequisitions', 
        prodLineItems.map(item => {
          return {
            id: item.id,
            quantity: item.quantity,
            rawMaterial: item.rawMaterial,
          }
        })
      )
    }
  }, [open])

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  const columns = [
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      type: 'number',
      headerAlign: 'left',  // align header
      align: 'left',        // align data
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.unit : '';
      }
    },
    {
      field: "name",
      headerName: "Raw Material",
      flex: 2,
      valueGetter: (params) => {
        return params.row ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}]` : '';
      }
    },
  ]

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog 
        fullWidth
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          {`Create ${string}`}
        </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ width: 150 }}
            label="Production Order ID"
            margin="normal"
            name="prod-order-id"
            value={prodOrderId}
            variant="outlined"
            disabled
          />
          <DataGrid
            autoHeight
            rows={formik.values.purchaseRequisitions}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!formik.isValid || formik.isSubmitting}
            variant="contained"
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};
