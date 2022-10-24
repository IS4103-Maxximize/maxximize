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
import { FormikConsumer, useFormik, useFormikContext } from 'formik';
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

export const ProdOFromProdReqCreateDialog = (props) => {
  const { open, handleClose, productionRequest, handleAlertOpen, ...rest } =
    props;

  const [loading, setLoading] = useState(false);
  const [rerender, setRerender] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [maximumFinalGoodOutput, setMaximumFinalGoodOutput] = useState(0);

  const handleOnSubmit = async () => {
    const response = await fetch(
      'http://localhost:3000/api/production-orders',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plannedQuantity: formik.values.multiplier,
          bomId: selectedBom.id,
          daily: formik.values.daily,
          organisationId: organisationId,
          duration: formik.values.noOfDays,
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      //Rerender parent data grid component
      onClose();
      handleAlertOpen(
        `Successfully Created Production Order ${result.id}!`,
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

  const formik = useFormik({
    initialValues: {
      multiplier: 1,
      lotQuantity: 1,
      quantity: productionRequest ? productionRequest.quantity : '',
      bomId: productionRequest
        ? boms
            .filter(
              (bom) => bom.finalGood.id === productionRequest.finalGood.id
            )
            .map((bom) => bom.id)
        : '',
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
      bomId: Yup.number().required('BOM must be selected'),
      prodLineItems: Yup.array().min(1, 'Line Items must not be empty'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Populate Prod Line Items
  //   useEffect(() => {
  //     if (selectedBom) {
  //       setFinalGoodUnit(selectedBom.finalGood.unit);
  //       formik.setFieldValue('multiplier', 1);
  //       formik.setFieldValue('quantity', selectedBom.finalGood.lotQuantity);
  //     }
  //     // Clear Prod Line Items if BOM selector is cleared
  //     if (!selectedBom) {
  //       formik.resetForm();
  //       formik.setFieldTouched('noOfDays', false, false);
  //       setMaximumFinalGoodOutput(0);
  //     }
  //   }, [selectedBom]);

  //   Calculate whenever multiplier changes
  //   useEffect(() => {
  //     if (selectedBom && formik.values.multiplier > 0) {
  //       formik.setFieldValue(
  //         'quantity',
  //         Math.ceil(selectedBom?.finalGood.lotQuantity * formik.values.multiplier)
  //       );
  //     }
  //   }, [formik.values.multiplier]);

  //Retrieve all incoming purchase orders
  const retrieveSelectedBom = async () => {
    const response = await fetch(
      `http://localhost:3000/api/bill-of-materials/${formik.values.bomId}`
    );
    let result = [];
    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }
    setSelectedBom(result);
  };

  // Opening and Closing Dialog helpers
  useEffect(() => {
    // fetch when opening create dialog
    if (open) {
      getBOMs();
      setMaximumFinalGoodOutput(0);
      setRerender(true);
      retrieveSelectedBom();

      formik.setFieldValue('lotQuantity', selectedBom?.finalGood?.lotQuantity);

      formik.setFieldValue(
        'multiplier',
        Math.ceil(formik.values.quantity / formik.values.lotQuantity)
      );
    }
  }, [open]);

  const onClose = () => {
    formik.resetForm();
    setFirstSchedules([]);
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

  const [firstSchedules, setFirstSchedules] = useState([]);

  // Earliest Schedules for final product
  const retrievePossibleSchedules = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/production-lines/earliestSchedules?quantity=${formik.values.quantity}&finalGoodId=${selectedBom.finalGood.id}&daily=${formik.values.daily}&days=${formik.values.noOfDays}&organisationId=${organisationId}`
      );
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();

        setFirstSchedules(result);
        setError('');
      } else {
        const result = await response.json();
        setError(result.message);

        formik.setFieldValue('prodLineItems', []);
        setLoading(false);
      }
    } catch (error) {
      setError(error);
    }
  };

  // Rerender Earliest Schedules for final product
  const rerenderPossibleSchedules = async () => {
    setError('');
    // Daily but not enough to cover all days, then it should not show any schedules
    // if (
    //   formik.values.daily &&
    //   maximumFinalGoodOutput !==
    //     formik.values.multiplier * formik.values.noOfDays
    // ) {
    //   setError('Not enough raw materials to fulfil everyday production');
    //   formik.setFieldValue('schedules', []);

    //   // Adhoc based on the maximum final good output that can be producted
    // } else

    if (formik.values.daily && maximumFinalGoodOutput) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/production-lines/earliestSchedules?quantity=${formik.values.quantity}&finalGoodId=${selectedBom.finalGood.id}&daily=${formik.values.daily}&days=${formik.values.noOfDays}&organisationId=${organisationId}`
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
          formik.setFieldValue('prodLineItems', []);
        }
      } catch (error) {
        setError(error);
      }

      // If rerender but not enough final goods
    } else if (maximumFinalGoodOutput) {
      try {
        const maximumAllowed =
          selectedBom.finalGood.lotQuantity * maximumFinalGoodOutput;
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
          formik.setFieldValue('prodLineItems', []);
        }
      } catch (error) {
        setError(error);
      }

      // If rerender but not enough final goods CHECK
    } else {
      formik.setFieldValue('schedules', []);
    }
  };

  // Retrieve Production Line Items (Sufficient/Insufficient)
  const retrieveProductionLineItems = async () => {
    try {
      const productMultiplier = formik.values.daily
        ? formik.values.multiplier * formik.values.noOfDays
        : formik.values.multiplier;

      const response = await fetch(
        `http://localhost:3000/api/batch-line-items/getLineItem/${
          selectedBom.id
        }/${productMultiplier}/${organisationId}/${
          firstSchedules.length !== 0
            ? firstSchedules[firstSchedules.length - 1].end
            : null
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

  // Stop loading upon error
  useEffect(() => {
    if (error !== '') {
      setLoading(false);
    }
  }, [error]);

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
    if (formik.values.quantity && selectedBom) {
      retrieveProductionLineItems();
    } else if (formik.values.schedules.length === 0) {
      formik.setFieldValue('prodLineItems', []);
      if (loading) {
        setLoading(!loading);
      }
    }
  }, [firstSchedules]);

  // After prod line items changes, calculate maximum possible production
  useEffect(() => {
    if (formik.values.prodLineItems.length > 0) {
      const insufficientLineItems = formik.values.prodLineItems.filter(
        (prodLineItem) => prodLineItem.sufficient === false
      );

      let limitingLineQuantity;
      let insufficientLineItem;
      let currentBOMLineItem;

      if (insufficientLineItems.length !== 0) {
        limitingLineQuantity = 9999999999;
        insufficientLineItem = '';
        insufficientLineItems.map((lineItem) => {
          // The BOM line item associated with the line item
          const bomLineItem = selectedBom.bomLineItems.find(
            (bomLineItem) =>
              bomLineItem.rawMaterial.id === lineItem.rawMaterial.id
          );
          // This is the maximum that can be produced based on the per unit final good (BOM)
          const maxProduceable = lineItem.quantity / bomLineItem.quantity;

          // Find the lowest one, this will be limiting the possible production
          if (maxProduceable < limitingLineQuantity) {
            limitingLineQuantity = maxProduceable;
            insufficientLineItem = lineItem;
            currentBOMLineItem = bomLineItem;
          }
        });

        const insufficientQuantity = insufficientLineItem.quantity;
        // const insufficientRawMaterialId = insufficientLineItem.rawMaterial.id;
        // const bomLineItem = selectedBom.bomLineItems.find(
        //   (bomLineItem) =>
        //     bomLineItem.rawMaterial.id === insufficientRawMaterialId
        // );

        setMaximumFinalGoodOutput(
          formik.values.multiplier -
            insufficientQuantity / currentBOMLineItem.quantity >=
            0
            ? formik.values.multiplier -
                insufficientQuantity / currentBOMLineItem.quantity
            : 0
        );

        if (
          maximumFinalGoodOutput === 0 &&
          formik.values.prodLineItems.length > 0
        ) {
          setError('Insufficient raw material to produce');
        }
      } else {
        if (formik.values.daily) {
          setMaximumFinalGoodOutput(
            formik.values.multiplier * formik.values.noOfDays
          );
        } else {
          setMaximumFinalGoodOutput(formik.values.multiplier);
        }
      }
    }
  }, [formik.values.prodLineItems]);

  useEffect(() => {
    if (formik.values.schedules?.length > 0 && loading) {
      setLoading(!loading);
    }
  }, [formik.values.schedules]);

  useEffect(() => {
    rerenderPossibleSchedules();
    console.log('Use Effect rerender');
  }, [maximumFinalGoodOutput]);

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
      headerName: 'Quantity',
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
        dialogContent={
          formik.values.prodLineItems.some(
            (prodLineItem) => prodLineItem.sufficient === false
          )
            ? `Production Order is only partially fulfilled, proceed to create two production orders?`
            : `Confirm Creation of Production Order?`
        }
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
              New Production Order
            </Typography>
            <Button
              variant="contained"
              disabled={
                formik.isSubmitting ||
                !formik.values.bomId ||
                formik.values.prodLineItems.length === 0 ||
                Boolean(error)
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
                    <TextField
                      disabled
                      label="Bill of Material"
                      sx={{ width: '100%', mb: 1 }}
                      margin="normal"
                      name="bill-of-material"
                      value={formik.values.bomId}
                      variant="outlined"
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
                      value={formik.values.lotQuantity}
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
                      disabled
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
                      sx={{ width: '100%', mb: 2 }}
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
                    label="Lots that can be produced"
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
                {/* <Box m={1}>
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
                </Box> */}
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
                  width={'100%'}
                  height={'40%'}
                ></Skeleton>
              ) : (
                <Card sx={{ marginTop: 2, marginBottom: 2 }}>
                  <DataGrid
                    autoHeight
                    rows={formik.values.schedules}
                    columns={scheduleColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
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
                  pageSize={10}
                  rowsPerPageOptions={[10]}
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
