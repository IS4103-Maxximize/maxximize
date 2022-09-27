import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppBar, Autocomplete, Badge, Box, Button, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { createBOM, fetchBOMs } from "../../helpers/production/bom";
import { ConfirmDialog } from "../assetManagement/confirm-dialog";


export const ProductionOrderCreateDialog = (props) => {
  const {
    open,
    handleClose,
    string,
    handleAlertOpen,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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

  // const [id, setId] = useState(0); // temporary id for line item in datagrid
  const [boms, setBoms] = useState([]);
  const [bomOptions, setBomOptions] = useState([]);
  const [selectedBom, setSelectedBom] = useState();

  // Fetch BOMs
  const getBOMs = async () => {
    const boms = await fetchBOMs(organisationId);
    setBoms([...boms]);
    setBomOptions([...boms]);
  }

  // Populate Prod Line Items
  useEffect(() => {
    if (selectedBom) {
      const lineItems = selectedBom.bomLineItems
        .map((item) => {
          return {
            id: item.id, // temporary id
            quantity: item.quantity,
            sufficient: false, // to be calculated later
            rawMaterial: item.rawMaterial
          }
        });
      // TBD - probably have to calculate sufficiency here before setting datagrid rows
      formik.setFieldValue('prodLineItems', lineItems);
    }
    // Clear Prod Line Items if BOM selector is cleared
    if (!selectedBom) {
      formik.setFieldValue('prodLineItems', []);
    }
  }, [selectedBom])

  // Selected Line Items
  const [selectedRows, setSelectedRows] = useState([]);

  const formik = useFormik({
    initialValues: {
      quantity: 100, // tbd
      bomId: null,
      prodLineItems: [],
    },
    validationSchema: Yup.object({
      quantity: Yup.number().integer().positive('Quantity must be positive').required('Enter Production Quantity'),
      bomId: Yup.number().required('BOM must be selected'),
      prodLineItems: Yup.array().min(1, 'Line Items must not be empty'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Opening and Closing Dialog helpers
  useEffect(() => {
    // fetch when opening create dialog
    if (open) {
      getBOMs();
    }
  }, [open])

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  // Prod Line Item Headers
  const columns = [
    {
      field: "rawMaterial",
      headerName: "Raw Material",
      flex: 2,
      valueGetter: (params) => {
        return params.row ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}] ` : '';
      }
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      type: 'number',
      headerAlign: 'left',  // align header
      align: 'left',        // align data
    },
    {
      field: "sufficient",
      headerName: "Sufficient?",
      flex: 1,
    },
  ]

  return (
    <form onSubmit={formik.handleSubmit}>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        dialogTitle={`Create Production Order`}
        dialogContent={`Confirm Creation of Production Order?`}
        dialogAction={handleOnSubmit}
      />
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
              {'New '}
              {string}
            </Typography>
            <Button
              variant="contained"
              disabled={
                formik.isSubmitting || 
                !formik.values.bomId || 
                formik.values.prodLineItems.length === 0
              }
              onClick={() => setConfirmDialogOpen(true)}
            >
              Create
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {/* Production Quantity */}
          <TextField
            sx={{ width: 400, mb: 2 }}
            error={Boolean(formik.touched.quantity && formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
            label="Production Quantity"
            margin="normal"
            name="quantity"
            type="number"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.quantity}
            variant="outlined"
          />
          {/* BOM Selection */}
          <Autocomplete
            id="bom-selector"
            sx={{ width: 400, mb: 2 }}
            options={bomOptions}
            getOptionLabel={(option) => `BOM ${option.id} - ${option.finalGood.name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            // value={formik.values.quotation}
            onChange={(e, value) => {
              formik.setFieldValue('bomId', value ? value.id : null);
              setSelectedBom(value);
            }}
            renderInput={(params) => (<TextField {...params} label="Bill Of Material" />)}
          />
          <Typography 
            sx={{ mt: 2, mx: 2 }}
            variant="h6"
          >
            Production Line Items
          </Typography>
          <DataGrid
            autoHeight
            rows={formik.values.prodLineItems}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            // experimentalFeatures={{ newEditingApi: true }}
            // processRowUpdate={handleRowUpdate}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};
