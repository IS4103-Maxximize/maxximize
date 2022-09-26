import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { updateBomLineItem } from "../../helpers/bom";


export const BOMUpdateDialog = (props) => {
  const {
    // action,
    open,
    handleClose,
    string,
    bom,
    handleAlertOpen,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // Selected Line Items
  const [selectedRows, setSelectedRows] = useState([])

  const formik = useFormik({
    initialValues: {
      finalGood: bom ? bom.finalGood : null,
      bomLineItems: bom ? bom.bomLineItems : [],
    },
    validationSchema: Yup.object({
      bomLineItems: Yup.array()
    }),
    enableReinitialize: true,
    // handleSubmit: () => {}
  });

  // // Add BOM Line Item upon click of '+'
  // const addBOMLineItem = (num, rawMaterial) => {
  //   const bomLineItem = {
  //     id: id, // temporary id for DataGrid
  //     quantity: num,
  //     rawMaterial: rawMaterial
  //   }

  //   // Update BOM Line Items
  //   const updatedBomLineItems = [bomLineItem, ...formik.values.bomLineItems];
  //   formik.setFieldValue('bomLineItems', updatedBomLineItems);

  //   // Reset numRaw field and remove added raw material
  //   // from raw materials list
  //   formik.setFieldValue('numRaw', 1);
  //   setRawMaterials(rawMaterials.filter(rawM => rawM.id !== rawMaterial.id));
  //   setSelectedRawMaterial(null);
  //   // Increase id for next line item
  //   setId(id + 1);
  // }

  // Update BOM Line Items if quantity is changed for line item
  const handleRowUpdate = (newRow, oldRow) => {
    // console.log(newRow);
    // console.log(oldRow);

    // Dont call api update if quantity didn't change
    if (newRow.quantity === oldRow.quantity) {
      return oldRow;
    }
   
    // actually call api update on line item
    updateBomLineItem(newRow.id, newRow)
      .then((result) => {
        console.log(result);
        const updatedBomLineItems = formik.values.bomLineItems
          .map(item => item.id === newRow.id ? newRow : item);
        formik.setFieldValue('bomLineItems', updatedBomLineItems);
        handleAlertOpen(`Successfully Updated Line Item ${newRow.id}`, 'success');
      })
      .catch((err) => handleAlertOpen(`Failed to Update Line Item ${newRow.id}`, 'error'));
    
    return newRow;
  }

  useEffect(() => {
    console.log(formik.values.bomLineItems)
  }, [formik.values.bomLineItems])

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
      field: "quantity",
      headerName: "Quantity *",
      flex: 1,
      type: 'number',
      headerAlign: 'left',  // align header
      align: 'left',        // align data
      editable: true,
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
              {'View and Edit '}
              {string}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Stack direction="row" spacing={1} alignItems="baseline">
            {/* BOM ID */}
            <TextField
              label="Bill Of Material ID"
              margin="normal"
              name="bom-id"
              value={bom ? bom.id : ''}
              variant="outlined"
              disabled
            />
            {/* Final Good Information */}
            <TextField
              label="Final Good"
              margin="normal"
              name="final-good-name"
              value={formik.values.finalGood ? formik.values.finalGood.name : ''}
              variant="outlined"
              disabled
            />
            <TextField
              label="SKU"
              margin="normal"
              name="final-good-skuCode"
              value={formik.values.finalGood ? formik.values.finalGood.skuCode : ''}
              variant="outlined"
              disabled
            />
          </Stack>
          <DataGrid
            autoHeight
            rows={formik.values.bomLineItems}
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
  );
};
