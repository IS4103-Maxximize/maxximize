import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";


export const PurchaseRequisitionNew = (props) => {
  const {
    open,
    handleClose,
    string,
    prodOrderId,
    prodLineItems,
    // purchaseRequisitions
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // Create PRs and close dialog
  const handleOnSubmit = async (values) => {
    // submit
    // console.log(values);

    // const finalGoodId = values.finalGoodId;

    // const bomLineItems = formik.values.bomLineItems.map((item) => {
    //   return {
    //     quantity: item.quantity,
    //     rawMaterialId: item.rawMaterial.id,
    //   }
    // })

    // console.log(finalGoodId);
    // console.log(bomLineItems);

    // // Create BOM
    // // call create api
    // createBOM(finalGoodId, bomLineItems)
    //   .then((res) => {
    //     onClose();
    //     handleAlertOpen(`Successfully Created ${string} ${res.id}!`, 'success');
    //   })
    //   .catch(err => handleAlertOpen(`Failed to Create ${string}'`, 'error'));
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

  // Update Purchase Requisition if quantity is changed
  // const handleRowUpdate = (newRow, oldRow) => {
  //   console.log(newRow);
  //   console.log(oldRow);
  //   if (newRow.quantity === oldRow.quantity) {
  //     return oldRow;
  //   }

  //   // Get original lineItem quantity and use as minimum
  //   const minimum = prodLineItems.find(item => item.id === newRow.id).quantity;

  //   // Open error alert if quantity is < minimum
  //   if (newRow.quantity < minimum) {
  //     const message = `Quantity must not be less than ${minimum}!`
  //     handleAlertOpen(message, 'error');
  //     throw new Error(message);
  //   }

  //   const updatedPRs = formik.values.purchaseRequisitions
  //     .map(item => item.id === newRow.id ? newRow : item);

  //   formik.setFieldValue('purchaseRequisitions', updatedPRs);
  //   handleAlertClose();
  //   return newRow;
  // }

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
            productionOrder: item.productionOrder
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
      // editable: true,
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
    // {
    //   field: "name",
    //   headerName: "Raw Material",
    //   flex: 2,
    //   valueGetter: (params) => {
    //     return params.row ? params.row.rawMaterial.name : '';
    //   }
    // },
    // {
    //   field: "skuCode",
    //   headerName: "SKU",
    //   flex: 1,
    //   valueGetter: (params) => {
    //     return params.row ? params.row.rawMaterial.skuCode : '';
    //   }
    // },
  ]

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog 
        // fullScreen 
        fullWidth
        open={open}
        onClose={onClose}
      >
        {/* <AppBar sx={{ position: 'relative' }}>
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
              {'Create '}
              {string}
            </Typography>
            <Button
              variant="contained"
              disabled={
                formik.isSubmitting ||
                !formik.values.finalGoodId 
              }
              onClick={formik.handleSubmit}
            >
              Submit
            </Button>
          </Toolbar>
        </AppBar> */}
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
            // onSelectionModelChange={(ids) => setSelectedRows(ids)}
            // experimentalFeatures={{ newEditingApi: true }}
            // processRowUpdate={handleRowUpdate}
            // onProcessRowUpdateError={(error) => {
            //   console.log(error);
            //   // remain in editing mode
            // }}
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
