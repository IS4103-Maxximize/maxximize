import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  AppBar,
  Autocomplete,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  gridColumnsTotalWidthSelector,
  selectedGridRowsSelector,
} from '@mui/x-data-grid';
import { useFormik, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { createBOM, fetchBOMs } from '../../helpers/production/bom';
import { ConfirmDialog } from '../assetManagement/confirm-dialog';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from '@mui/lab/LoadingButton';
import SyncIcon from '@mui/icons-material/Sync';
import DayJS from 'dayjs';
import { Container } from '@mui/system';

export const ProductionOrderCreateDialog = (props) => {
  const {
    open,
    handleClose,
    string,
    addProductionOrder,
    handleAlertOpen,
    ...rest
  } = props;

  const [loading, setLoading] = useState(false);
  const [rerender, setRerender] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [maximumFinalGoodOutput, setMaximumFinalGoodOutput] = useState(0);

  const handleOnSubmit = async (values) => {
    // submit
    // Create BOM
    // call create api
    const response = await fetch(
      'http://localhost:3000/api/production-orders',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plannedQuantity: formik.values.quantity,
          bomId: selectedBom.id,
          daily: formik.values.daily,
          organisationId: organisationId,
          duration: formik.values.numOfDays,
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      //Rerender parent data grid compoennt
      addProductionOrder(result);
      onClose();
      handleAlertOpen(
        `Successfully Created ${string} ${result.id}!`,
        'success'
      );
      setError('');
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const [boms, setBoms] = useState([]);
  const [bomOptions, setBomOptions] = useState([]);
  const [selectedBom, setSelectedBom] = useState();

  // Fetch BOMs
  const getBOMs = async () => {
    const boms = await fetchBOMs(organisationId);
    setBoms([...boms]);
    setBomOptions([...boms]);
  };

  // Handle when daily change from True/False, set the no. of days
  const handleDailyChange = () => {
    formik.setFieldValue('daily', !formik.values.daily);

    if (formik.values.daily) {
      formik.setFieldValue('noOfDays', 0);
      formik.setFieldTouched('noOfDays', false, false);
    } else {
      formik.setFieldValue('noOfDays', 1);
    }
  };

  const formik = useFormik({
    initialValues: {
      multiplier: 1,
      quantity: 0,
      bomId: null,
      daily: false,
      noOfDays: 0,
      prodLineItems: [],
      schedules: [],
    },
    validationSchema: Yup.object({
      multiplier: Yup.number()
        .positive('Number of lots must be positive')
        .required('Enter number of lots'),
      quantity: Yup.number().integer().positive('Quantity must be positive'),
      noOfDays: Yup.number()
        .integer()
        .when('daily', {
          is: true,
          then: Yup.number()
            .integer()
            .positive('Number of days must be positive'),
        }),
      bomId: Yup.number().required('BOM must be selected'),
      prodLineItems: Yup.array().min(1, 'Line Items must not be empty'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Populate Prod Line Items
  useEffect(() => {
    if (selectedBom) {
      setFinalGoodUnit(selectedBom.finalGood.unit);
      formik.setFieldValue('multiplier', 1);
      formik.setFieldValue('quantity', selectedBom.finalGood.lotQuantity);
    }
    // Clear Prod Line Items if BOM selector is cleared
    if (!selectedBom) {
      formik.setFieldValue('prodLineItems', []);
      formik.setFieldValue('schedules', []);
      formik.setFieldValue('quantity', 0);
      formik.setFieldValue('multiplier', 1);
      formik.setFieldValue('daily', false);
      formik.setFieldValue('noOfDays', 0);
      formik.setFieldTouched('noOfDays', false, false);
      setMaximumFinalGoodOutput(0);
    }
  }, [selectedBom]);

  // Calculate whenever multiplier changes
  useEffect(() => {
    if (selectedBom && formik.values.multiplier > 0) {
      formik.setFieldValue(
        'quantity',
        Math.ceil(selectedBom?.finalGood.lotQuantity * formik.values.multiplier)
      );
    }
  }, [formik.values.multiplier]);

  // Opening and Closing Dialog helpers
  useEffect(() => {
    // fetch when opening create dialog
    if (open) {
      getBOMs();
      setMaximumFinalGoodOutput(0);
      setRerender(true);
    }
  }, [open]);

  const onClose = () => {
    formik.resetForm();
    setFinalGoodUnit('');
    setError('');
    setLoading(false);
    setRerender(true);
    setSelectedBom('');
    setMaximumFinalGoodOutput(0);
    handleClose();
  };

  // Final good unit
  const [finalGoodUnit, setFinalGoodUnit] = useState('');

  // Earliest Schedules for final product
  const retrievePossibleSchedules = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/production-lines/earliestSchedules?quantity=${formik.values.quantity}&finalGoodId=${selectedBom.finalGood.id}&daily=${formik.values.daily}&days=${formik.values.noOfDays}&organisationId=${organisationId}`
      );

      if (response.status === 200 || response.status === 201) {
        const result = await response.json();

        formik.setFieldValue('schedules', result);
        setError('');
      } else {
        const result = await response.json();
        setError(result.message);
        formik.setFieldValue('schedules', []);
        if (loading) {
          setLoading(!loading);
        }
      }
    } catch (error) {
      setError(error);
    }
  };

  // Rerender Earliest Schedules for final product
  const rerenderPossibleSchedules = async () => {
    setError('');
    if (maximumFinalGoodOutput != 0) {
      try {
        const maximumAllowed = formik.values.quantity * maximumFinalGoodOutput;
        const response = await fetch(
          `http://localhost:3000/api/production-lines/earliestSchedules?quantity=${maximumAllowed}&finalGoodId=${selectedBom.finalGood.id}&daily=${formik.values.daily}&days=${formik.values.noOfDays}&organisationId=${organisationId}`
        );

        if (response.status === 200 || response.status === 201) {
          const result = await response.json();

          formik.setFieldValue('schedules', result);

          setRerender(true);
          setError('');
        } else {
          const result = await response.json();
          setError(result.message);
          formik.setFieldValue('schedules', []);
        }
      } catch (error) {
        setError(error);
      }
    } else {
      formik.setFieldValue('schedules', []);
    }
  };

  // Retrieve Production Line Items (Sufficient/Insufficient)
  const retrieveProductionLineItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/batch-line-items/getLineItem/${
          selectedBom.id
        }/${formik.values.multiplier}/${organisationId}/${
          formik.values.schedules[formik.values.schedules.length - 1].end
        }`
      );
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();

        result.sort((lineItem1, lineItem2) => {
          return lineItem1.sufficient - lineItem2.sufficient;
        });

        formik.setFieldValue('prodLineItems', result);
        setError('');
        setLoading(!loading);
      } else {
        const result = await response.json();
        setError(result.message);
        setLoading(!loading);
      }
    } catch (error) {
      setError(error);
    }
  };

  // Error Handling
  const [error, setError] = useState('');

  const refreshInformation = () => {
    if (selectedBom) {
      retrievePossibleSchedules();

      setLoading(!loading);

      setRerender(false);

      setError('');

      setMaximumFinalGoodOutput(0);
    }
  };

  useEffect(() => {
    if (
      formik.values.quantity &&
      selectedBom &&
      formik.values.schedules?.length != 0
    ) {
      retrieveProductionLineItems();
    } else if (
      formik.values.quantity &&
      selectedBom &&
      formik.values.schedules?.length == 0 &&
      rerender
    ) {
      formik.setFieldValue('prodLineItems', []);

      setError('No production line available for production of final good');
      if (loading) {
        setLoading(!loading);
      }
    }
  }, [formik.values.schedules]);

  useEffect(() => {
    if (formik.values.prodLineItems.length > 0) {
      const insufficientLineItem = formik.values.prodLineItems.find(
        (prodLineItem) => prodLineItem.sufficient === false
      );

      if (insufficientLineItem) {
        const insufficientQuantity = insufficientLineItem.quantity;
        const insufficientRawMaterialId = insufficientLineItem.rawMaterial.id;
        const bomLineItem = selectedBom.bomLineItems.find(
          (bomLineItem) =>
            bomLineItem.rawMaterial.id === insufficientRawMaterialId
        );

        setMaximumFinalGoodOutput(
          formik.values.multiplier - insufficientQuantity / bomLineItem.quantity
        );

        if (!rerender) {
          setError('Please rerender new schedules or change number of lots');
        }
      } else {
        setMaximumFinalGoodOutput(formik.values.multiplier);
      }
    }
  }, [formik.values.prodLineItems]);

  useEffect(() => {
    if (formik.values.schedules?.length > 0 && loading) {
      setLoading(!loading);
    }
  }, [formik.values.schedules]);

  // Schedule Headers
  const scheduleColumns = [
    {
      field: 'start',
      headerName: 'Start Time',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.start : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'end',
      headerName: 'End Time',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.end : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'quantity',
      headerName: 'Production Quantity',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'productionLineId',
      headerName: 'Production Line ID',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.productionLineId : '';
      },
    },
  ];

  // Prod Line Item Headers
  const productionOrderColumns = [
    {
      field: 'batchLineItemId',
      headerName: 'Batch Line Item ID',
      flex: 2,
      valueGetter: (params) => {
        return params.row.batchLineItemId
          ? params.row.batchLineItemId
          : 'Unable to Fulfil';
      },
    },
    {
      field: 'rawMaterial',
      headerName: 'Raw Material',
      flex: 2,
      valueGetter: (params) => {
        return params.row
          ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}] `
          : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Lot Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
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
      field: 'sufficient',
      headerName: 'Sufficient Status',
      flex: 1,
      renderCell: (params) => {
        return params.row.sufficient ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        );
      },
    },
  ];

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
        <DialogContent sx={{ backgroundColor: '#F9FAFC' }}>
          <Box display="flex">
            <Box mr={'2%'} width="25%">
              {/* BOM Selection */}
              <Typography variant="h6">Required Quantity</Typography>
              <Card sx={{ marginTop: 2 }}>
                <Box margin={2}>
                  {/* Bill of Material */}
                  <Stack direction="row" spacing={1}>
                    <Autocomplete
                      id="bom-selector"
                      sx={{ width: '100%', mb: 1 }}
                      options={bomOptions}
                      getOptionLabel={(option) =>
                        `BOM ${option.id} - ${option.finalGood.name} [${option.finalGood.skuCode}]`
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      onChange={(e, value) => {
                        formik.setFieldValue('bomId', value ? value.id : null);
                        setSelectedBom(value);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Bill Of Material" />
                      )}
                      size="small"
                    />
                  </Stack>

                  {/* Quantity per lot, Number of lots */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="baseline"
                    justifyContent="space-between"
                  >
                    <TextField
                      label="Quantity per lot"
                      sx={{ width: '49%', mb: 1 }}
                      margin="normal"
                      name="final-good-lotQuantity"
                      value={
                        selectedBom ? selectedBom.finalGood.lotQuantity : 0
                      }
                      variant="outlined"
                      disabled
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {finalGoodUnit}
                          </InputAdornment>
                        ),
                      }}
                      size="small"
                    />
                    <TextField
                      sx={{ width: '49%', mb: 1 }}
                      error={Boolean(
                        formik.touched.multiplier && formik.errors.multiplier
                      )}
                      helperText={
                        formik.touched.multiplier && formik.errors.multiplier
                      }
                      label="Number of lot(s)"
                      margin="normal"
                      name="multiplier"
                      type="number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.multiplier}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>

                  {/* Total Production Quantity */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="baseline"
                    justifyContent="flex-end"
                  >
                    <TextField
                      sx={{ width: '100%', mb: 1 }}
                      error={Boolean(
                        formik.touched.quantity && formik.errors.quantity
                      )}
                      helperText={
                        formik.touched.quantity && formik.errors.quantity
                      }
                      label="Production Quantity"
                      margin="normal"
                      name="quantity"
                      type="number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.quantity}
                      variant="outlined"
                      disabled
                      size="small"
                    />
                  </Stack>

                  {/* Daily or not, number of days */}
                  <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="space-between"
                    marginBottom={1}
                  >
                    <FormControlLabel
                      sx={{ width: '50%' }}
                      error={Boolean(
                        formik.touched.daily && formik.errors.daily
                      )}
                      helperText={formik.touched.daily && formik.errors.daily}
                      checked={formik.values.daily}
                      value={formik.values.daily}
                      control={<Checkbox />}
                      onChange={handleDailyChange}
                      label={
                        <Typography variant="body2">Produce Daily</Typography>
                      }
                    />
                    <Box display="flex" width="50%" alignItems="baseline">
                      <TextField
                        disabled={!formik.values.daily}
                        sx={{ width: '100%' }}
                        error={Boolean(
                          formik.touched.noOfDays && formik.errors.noOfDays
                        )}
                        helperText={
                          formik.touched.noOfDays && formik.errors.noOfDays
                        }
                        label="Number of Days"
                        margin="normal"
                        name="noOfDays"
                        type="number"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.noOfDays}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Stack>
                  {/* Button to recalculate respective quantities */}
                  {loading ? (
                    <LoadingButton
                      fullWidth
                      loading={loading}
                      loadingPosition="start"
                      startIcon={<SyncIcon />}
                      variant="outlined"
                    >
                      Loading
                    </LoadingButton>
                  ) : (
                    <Button
                      fullWidth
                      style={{ height: '4%' }}
                      color="primary"
                      variant="contained"
                      disabled={
                        !selectedBom ||
                        formik.values.multiplier < 1 ||
                        (formik.values.daily && formik.values.noOfDays == '')
                      }
                      onClick={refreshInformation}
                      endIcon={<SyncIcon />}
                    >
                      Generate
                    </Button>
                  )}
                </Box>
              </Card>

              {/* If insufficient raw material */}
              <Typography sx={{ marginTop: 2 }} variant="h6">
                Only Able To Produce
              </Typography>
              <Card sx={{ padding: 1, marginTop: 2 }}>
                <Box mb={1} ml={1} mr={1}>
                  <TextField
                    sx={{ width: '100%' }}
                    disabled={true}
                    label="Final Goods that can be produced"
                    margin="normal"
                    name="maximumFinalGoodOutput"
                    type="number"
                    value={maximumFinalGoodOutput}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' },
                      },
                    }}
                  />
                </Box>
                <Box m={1}>
                  <Button
                    fullWidth
                    style={{ height: '4%', marginTop: 1 }}
                    color="primary"
                    variant="contained"
                    disabled={
                      !selectedBom ||
                      formik.values.multiplier < 1 ||
                      (formik.values.daily && formik.values.noOfDays == '') ||
                      !formik.values.prodLineItems
                        .map((prodLineItem) => prodLineItem.sufficient)
                        .includes(false)
                    }
                    onClick={rerenderPossibleSchedules}
                    endIcon={<SyncIcon />}
                  >
                    Reload Schedules
                  </Button>
                </Box>
              </Card>
              <Typography variant="body1" color="red">
                {error}
              </Typography>
            </Box>

            <Box width="75%">
              <Typography variant="h6">Schedule(s)</Typography>
              {loading ? (
                <Skeleton
                  sx={{ marginTop: 2, marginBottom: 2 }}
                  variant="rounded"
                  fullWidth
                  height={'40%'}
                ></Skeleton>
              ) : (
                <Card sx={{ marginTop: 2, marginBottom: 2 }}>
                  <DataGrid
                    autoHeight
                    rows={formik.values.schedules}
                    columns={scheduleColumns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    // experimentalFeatures={{ newEditingApi: true }}
                    // processRowUpdate={handleRowUpdate}
                    sx={{ marginLeft: 1, marginRight: 1, marginBottom: 1 }}
                  />
                </Card>
              )}

              <Typography variant="h6">Production Line Items</Typography>

              <Card sx={{ marginTop: 2 }}>
                <DataGrid
                  autoHeight
                  rows={formik.values.prodLineItems}
                  columns={productionOrderColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  // experimentalFeatures={{ newEditingApi: true }}
                  // processRowUpdate={handleRowUpdate}
                  sx={{ marginLeft: 1, marginRight: 1, marginBottom: 1 }}
                />
              </Card>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </form>
  );
};
