import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  useTheme,
  Box,
  Typography,
  Autocomplete,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { SimpleToolbar } from './simple-toolbar';
import { BulkDiscountConfirmDialog } from './bulk-discount-confirm-dialog';

export const CreateBulkDiscountDialog = ({
  openDialog,
  handleClose,
  handleAlertOpen,
  retrieveAllBulkDiscounts,
}) => {
  const [error, setError] = useState('');

  const types = ['Weight', 'Price'];
  const [selectedType, setSelectedType] = useState('Weight');
  const [ranges, setRanges] = useState([
    {
      id: 1,
      start: 1,
      end: null,
      discountRate: 1,
    },
  ]);

  //Handle dialog close from child dialog
  const onClose = () => {
    formik.resetForm();
    setRanges([
      {
        id: 1,
        start: 1,
        end: null,
        discountRate: 1,
      },
    ]);
    handleClose();
  };

  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // Handle Formik submission
  const handleOnSubmit = async () => {
    const response = await fetch('http://localhost:3000/api/bulk-discounts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organisationId: organisationId,
        bulkType: selectedType,
        bulkDiscountRangeDtos: ranges,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();

      handleAlertOpen(`Created Bulk Discount ${result.id} successfully`);
      retrieveAllBulkDiscounts();
      setError('');
      onClose();
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };

  const handleCreate = async () => {
    const createBody = {
      id: ranges.length + 1,
      start: formik.values.newStart,
      end: null,
      discountRate: formik.values.newDiscountRate,
    };

    ranges.unshift(createBody);

    const updateBody = formik.values.newStart - 1;

    ranges[1].end = updateBody;

    handleAlertOpen('Added discount range successfully', 'success');
    handleCreateCardClose();
  };

  const handleUpdate = async () => {
    setRanges((ranges) =>
      ranges.map((range) => {
        console.log(formik.values.id - 1);
        if (range.id === formik.values.id) {
          return {
            ...range,
            start: formik.values.start,
            discountRate: formik.values.discountRate,
          };
        } else if (range.id === formik.values.id - 1) {
          return {
            ...range,
            end: formik.values.start - 1,
          };
        }
        return range;
      })
    );

    handleAlertOpen('Updated discount range successfully', 'success');
  };

  useEffect(() => console.log(ranges), [ranges]);

  const handleDelete = async () => {
    let result = ranges.shift();
    console.log(ranges);
    ranges[0].end = null;

    // setRanges(ranges);
    handleAlertOpen('Deleted discount range successfully', 'success');
  };

  const formik = useFormik({
    initialValues: {
      // Top Discount Range
      id: ranges.length > 0 ? ranges[0].id : null,
      type: '',
      start: ranges.length > 0 ? ranges[0].start : null,
      discountRate: ranges.length > 0 ? ranges[0].discountRate : null,
      // New Discount Range
      newStart: ranges.length > 0 ? ranges[0].start + 2 : null,
      newDiscountRate: ranges.length > 0 ? ranges[0].discountRate + 1 : 0,
    },
    validationSchema: Yup.object({
      start: Yup.number()
        .typeError('Starting amount must be a number')
        .positive('Starting Amount must be positive')
        .min(
          ranges.length > 0
            ? ranges.length === 1
              ? 1
              : ranges[1].start + 1
            : 1,
          'Starting Amount must be at least $1 more than previous range'
        )
        .required('Starting Amount is required'),
      discountRate: Yup.number()
        .typeError('Discount rate must be a number')
        .min(0, 'Discount rate cannot be negative')
        .required('Discount rate is required'),
      newStart: Yup.number()
        .typeError('Starting amount must be a number')
        .positive('Starting Amount must be positive')
        .min(
          ranges.length > 0 ? ranges[0].start + 2 : 1,
          'Starting Amount must be at least $1 more than previous range'
        )
        .required('Starting Amount is required'),
      newDiscountRate: Yup.number()
        .typeError('Discount rate must be a number')
        .min(0, 'Discount cannot be negative')
        .required('Discount Rate is required'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  // Create Dialog Helpers
  const [createCardOpen, setCreateCardOpen] = useState(false);
  const toggleCreateCardOpen = () => {
    setCreateCardOpen(!createCardOpen);
  };
  const handleCreateCardOpen = () => {
    setCreateCardOpen(true);
  };
  const handleCreateCardClose = () => {
    setCreateCardOpen(false);
  };

  //Confirm Dialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <BulkDiscountConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        dialogTitle={`Delete range`}
        dialogContent={`Confirm deletion of range?`}
        dialogAction={() => {
          handleDelete();
        }}
      />
      <Dialog
        fullScreen
        open={openDialog}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
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
              Create Bulk Discount
            </Typography>
            <Button
              variant="contained"
              disabled={!formik.isValid || formik.isSubmitting}
              onClick={formik.handleSubmit}
            >
              Submit
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              <Autocomplete
                disablePortal
                options={types}
                renderInput={(params) => (
                  <TextField fullWidth {...params} label="Based on type" />
                )}
                onChange={(e, value) => {
                  formik.setFieldValue('type', value ? value : null);
                  setSelectedType(value);
                }}
                sx={{ mb: 3, width: 300, p: 1 }}
              />
            </Box>

            <SimpleToolbar
              key="toolbar"
              name={'Discount Range'}
              open={createCardOpen}
              handleToggle={toggleCreateCardOpen}
            />
            <Box
              sx={{
                mt: 3,
                textAlign: 'center',
              }}
            >
              {createCardOpen && (
                <Card
                  sx={{
                    mb: 2,
                  }}
                >
                  <CardHeader
                    title="Add Discount Range"
                    action={
                      <Button variant="contained" onClick={handleCreate}>
                        Add
                      </Button>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          error={Boolean(
                            formik.touched.newStart && formik.errors.newStart
                          )}
                          helperText={
                            formik.touched.newStart && formik.errors.newStart
                          }
                          label="Starting Amount"
                          margin="normal"
                          name="newStart"
                          type="number"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.newStart}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          error={Boolean(
                            formik.touched.newDiscountRate &&
                              formik.errors.newDiscountRate
                          )}
                          helperText={
                            formik.touched.newDiscountRate &&
                            formik.errors.newDiscountRate
                          }
                          label="Discount Rate (%)"
                          margin="normal"
                          name="newDiscountRate"
                          type="number"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.newDiscountRate}
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
              {ranges.length > 0 ? (
                ranges.map((range, index) => (
                  <>
                    <Card
                      sx={{
                        mb: 2,
                      }}
                    >
                      {index === 0 && !createCardOpen && (
                        <>
                          <CardHeader
                            title="Edit Discount Range"
                            action={
                              <>
                                <Button
                                  color="primary"
                                  onClick={() =>
                                    handleUpdate(ranges.length === 1)
                                  }
                                  endIcon={<EditIcon />}
                                  variant="contained"
                                >
                                  Update
                                </Button>
                                {ranges.length > 1 && (
                                  <IconButton
                                    color="error"
                                    onClick={handleConfirmDialogOpen}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </>
                            }
                          />
                          <Divider />
                        </>
                      )}
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          {index === 0 && (
                            <>
                              <Grid item md={4} xs={12}>
                                <TextField
                                  fullWidth
                                  error={Boolean(
                                    formik.touched.start && formik.errors.start
                                  )}
                                  helperText={
                                    formik.touched.start && formik.errors.start
                                  }
                                  label="Starting Amount"
                                  margin="normal"
                                  name="start"
                                  type="number"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.start}
                                  variant="outlined"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        $
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item md={4} xs={12}>
                                <TextField
                                  disabled
                                  fullWidth
                                  error={Boolean(
                                    formik.touched.end && formik.errors.end
                                  )}
                                  helperText={
                                    formik.touched.end && formik.errors.end
                                  }
                                  label="Ending Amount"
                                  margin="normal"
                                  name="end"
                                  type="number"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.end}
                                  variant="outlined"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        $
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item md={4} xs={12}>
                                <TextField
                                  fullWidth
                                  error={Boolean(
                                    formik.touched.discountRate &&
                                      formik.errors.discountRate
                                  )}
                                  helperText={
                                    formik.touched.discountRate &&
                                    formik.errors.discountRate
                                  }
                                  label="Discount Rate (%)"
                                  margin="normal"
                                  name="discountRate"
                                  type="number"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.discountRate}
                                  variant="outlined"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        %
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                            </>
                          )}
                          {index > 0 && (
                            <>
                              <Grid item md={4} xs={12}>
                                <TextField
                                  fullWidth
                                  disabled
                                  label="Starting Amount"
                                  margin="normal"
                                  name="start"
                                  type="number"
                                  value={range.start}
                                  variant="outlined"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        $
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item md={4} xs={12}>
                                <TextField
                                  fullWidth
                                  disabled
                                  label="Ending Amount"
                                  margin="normal"
                                  name="end"
                                  type="number"
                                  value={range.end}
                                  variant="outlined"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        $
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item md={4} xs={12}>
                                <TextField
                                  fullWidth
                                  // disabled
                                  label="Discount Rate (%)"
                                  margin="normal"
                                  name="discountRate"
                                  type="number"
                                  value={range.discountRate}
                                  variant="outlined"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        %
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                    {index < ranges.length - 1 && (
                      <KeyboardDoubleArrowDownIcon />
                    )}
                  </>
                ))
              ) : (
                <Card
                  variant="outlined"
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <CardContent>
                    <Typography>{`No Discount Range Found`}</Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
            <Typography variant="body1" color="red">
              {error}
            </Typography>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
