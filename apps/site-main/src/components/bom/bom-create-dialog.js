import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppBar, Autocomplete, Badge, Box, Button, Dialog, DialogContent, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { createBOM } from "../../helpers/production/bom";
import { fetchProducts } from "../../helpers/products";


export const BOMCreateDialog = (props) => {
  const {
    open,
    handleClose,
    string,
    handleAlertOpen,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const handleOnSubmit = async (values) => {
    // submit
    // console.log(values);

    const finalGoodId = values.finalGoodId;

    const bomLineItems = formik.values.bomLineItems.map((item) => {
      return {
        quantity: item.quantity,
        rawMaterialId: item.rawMaterial.id,
      }
    })

    console.log(finalGoodId);
    console.log(bomLineItems);

    // Create BOM
    // call create api
    createBOM(finalGoodId, bomLineItems)
      .then((res) => {
        onClose();
        handleAlertOpen(`Successfully Created ${string} ${res.id}!`, 'success');
      })
      .catch(err => handleAlertOpen(`Failed to Create ${string}'`, 'error'));
  };

  const [id, setId] = useState(1); // temporary id for line item in datagrid
  const [finalGoods, setFinalGoods] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [rawMaterialOptions, setRawMaterialOptions] = useState([]);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState();

  const getProducts = async () => {
    const raw = await fetchProducts('raw-materials', organisationId)
    const final = await fetchProducts('final-goods', organisationId)    
    setRawMaterials([...raw]);
    setRawMaterialOptions([...raw]);
    setFinalGoods(final.filter(finalGood => !finalGood.billOfMaterial));
  }

  // Selected Line Items
  const [selectedRows, setSelectedRows] = useState([]);

  const formik = useFormik({
    initialValues: {
      numRaw: 1,
      finalGoodId: null,
      bomLineItems: [],
    },
    validationSchema: Yup.object({
      numRaw: Yup.number().integer().positive('Number must be positive'),
      finalGoodId: Yup.number().required('Final Good must be selected'),
      bomLineItems: Yup.array().min(1, 'Line Items must not be empty'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Delete BOM Line Item(s)
  const deleteLineItems = (ids) => {
    const updatedBomLineItems = formik.values.bomLineItems.filter(
      (el) => !ids.includes(el.id)
    );
    // Get raw materials which should be excluded
    const bomLineItemRawMaterialIds = updatedBomLineItems.map(el => el.rawMaterial.id);

    // Update bomLineItems
    formik.setFieldValue('bomLineItems', updatedBomLineItems);

    // Reset raw material option list and selected rows
    setRawMaterialOptions(rawMaterials.filter(rawM => !bomLineItemRawMaterialIds.includes(rawM.id)));
    setSelectedRows([]);
  };

  // Add BOM Line Item upon click of '+'
  const addBOMLineItem = (num, rawMaterial) => {
    const bomLineItem = {
      id: id, // temporary id for DataGrid
      quantity: num,
      rawMaterial: rawMaterial
    }

    // Update BOM Line Items
    const updatedBomLineItems = [bomLineItem, ...formik.values.bomLineItems];
    formik.setFieldValue('bomLineItems', updatedBomLineItems);

    // Reset numRaw field and remove added raw material
    // from raw materials list
    formik.setFieldValue('numRaw', 1);
    setRawMaterialOptions(rawMaterialOptions.filter(rawM => rawM.id !== rawMaterial.id));
    setSelectedRawMaterial(null);
    // Increase id for next line item
    setId(id + 1);
  }

  // Update BOM Line Items if quantity is changed for line item
  const handleRowUpdate = (newRow, oldRow) => {
    console.log(newRow);
    console.log(oldRow);
    if (newRow.quantity === oldRow.quantity) {
      return oldRow;
    }

    // Open error alert if quantity is < 1
    if (newRow.quantity < 1) {
      const message = 'Quantity must be positive!'
      handleAlertOpen(message, 'error');
      throw new Error(message);
    }

    const updatedBomLineItems = formik.values.bomLineItems
      .map(item => item.id === newRow.id ? newRow : item)

    formik.setFieldValue('bomLineItems', updatedBomLineItems)
    return newRow;
  }

  // useEffect(() => {
  //   console.log(formik.values.bomLineItems)
  // }, [formik.values.bomLineItems])

  // Opening and Closing Dialog helpers
  useEffect(() => {
    // fetch when opening create dialog
    if (open) {
      getProducts();
    }
  }, [open])

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
      field: "unit",
      headerName: "Unit",
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.unit : '';
      }
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
              {'Create '}
              {string}
            </Typography>
            <Button
              variant="contained"
              disabled={
                formik.isSubmitting ||
                !formik.values.finalGoodId || 
                formik.values.bomLineItems.length === 0
              }
              onClick={formik.handleSubmit}
            >
              Submit
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Stack direction="row" spacing={1}>
            {/* Final Good Selection */}
            <Autocomplete
              id="final-good-selector"
              sx={{ width: 400, mb: 2 }}
              options={finalGoods}
              getOptionLabel={(option) => `${option.name} [${option.skuCode}]`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              // value={formik.values.quotation}
              onChange={(e, value) => formik.setFieldValue('finalGoodId', value ? value.id : null)}
              renderInput={(params) => (<TextField {...params} label="Final Good" />)}
            />
            <TextField
              label="Lot Quantity"
              margin="normal"
              name="final-good-lotQuantity"
              value={
                formik.values.finalGoodId ? 
                finalGoods.find(item => item.id === formik.values.finalGoodId).lotQuantity : 0
              }
              variant="outlined"
              disabled
            />
            <TextField
              sx={{width: 100}}
              label="Unit"
              margin="normal"
              name="final-good-unit"
              value={
                formik.values.finalGoodId ? 
                finalGoods.find(item => item.id === formik.values.finalGoodId).unit : ''
              }
              variant="outlined"
              disabled
            />
          </Stack>
          <Box my={2} display="flex" justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              {/* Raw Material Selection to be added as Line Items */}
              <Autocomplete
                id="raw-material-selector"
                sx={{ width: 400 }}
                options={rawMaterialOptions}
                getOptionLabel={(option) => `${option.name} [${option.skuCode}]`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedRawMaterial}
                onChange={(e, value) => setSelectedRawMaterial(value)}
                renderInput={(params) => (<TextField {...params} label="Raw Material" />)}
              />
              {/* Line Item Quantity aka number of raw materials */}
              <TextField
                error={Boolean(formik.touched.numRaw && formik.errors.numRaw)}
                helperText={formik.touched.numRaw && formik.errors.numRaw}
                label="Enter Quantity of Raw Materials"
                margin="normal"
                name="numRaw"
                type="number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.numRaw}
                variant="outlined"
              />
              <TextField
                sx={{width: 100}}
                label="Unit"
                margin="normal"
                name="final-good-unit"
                value={
                  selectedRawMaterial ? 
                  selectedRawMaterial.unit : ''
                }
                variant="outlined"
                disabled
              />
              <IconButton
                disabled={formik.values.numRaw <= 0 || !selectedRawMaterial}
                color="primary"
                onClick={() => {
                  addBOMLineItem(formik.values.numRaw, selectedRawMaterial);
                }}
              >
                <AddBoxIcon />
              </IconButton>
            </Stack>
            <IconButton
              disabled={selectedRows.length === 0}
              color="error"
              onClick={() => deleteLineItems(selectedRows)}
            >
              <Badge badgeContent={selectedRows.length} color="error">
                <DeleteIcon />
              </Badge>
            </IconButton>
          </Box>
          <DataGrid
            autoHeight
            rows={formik.values.bomLineItems}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            experimentalFeatures={{ newEditingApi: true }}
            processRowUpdate={handleRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.log(error);
              // remain in editing mode
            }}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};
