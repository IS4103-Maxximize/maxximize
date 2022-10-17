import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { fetchMachines, updateProductionLine } from "../../helpers/assetManagement";
import { fetchBOMs } from '../../helpers/production/bom';


export const ProductionLineDialogUpdate = (props) => {
  const {
    open,
    handleClose,
    string,
    productionLine,
	handleRowUpdate,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const handleOnSubmit = async (values) => {
    // submit
    console.log(values);

    // - name
    // - description
    // - productionCostPerLot (Only edited when no planned or ongoing schedules)
    // - gracePeriod (Only edited when no planned or ongoing schedules)
    // - outputPerHour (Only edited when no planned or ongoing schedules)
    // - startTime (Only edited when no planned or ongoing schedules)
    // - endTime (Only edited when no planned or ongoing schedules)

    const updateProductionLineDto = {
      name: values.name,
      description: values.description,
      productionCostPerLot: values.productionCostPerHour,
      gracePeriod: 3600000 * values.hours + 60000 * values.minutes + 1000 * values.seconds,
      outputPerHour: values.outputPerHour,
      startTime: values.startTime,
      endTime: values.endTime,
      machineIds: selectedMachines.map(machine => machine.id),
      bomIds: selectedBoms.map(bom => bom.id)
    }

    console.log(updateProductionLineDto);

    updateProductionLine(productionLine.id, updateProductionLineDto)
      .then(res => {
		handleRowUpdate(res)
        onClose();
        handleAlertOpen(`Successfully Updated Production Line ${res.id}!`, 'success');
      })
      .catch(err => handleAlertOpen('Failed to Update Production Line', 'error'));
  };

  const [selectedBoms, setSelectedBoms] = useState([]);
  const [boms, setBoms] = useState([]);

  const [selectedMachines, setSelectedMachines] = useState([]);
  const [machines, setMachines] = useState([]);

  const getBoms = () => {
    fetchBOMs(organisationId)
      .then(res => setBoms(res))
  }

  const getMachines = () => {
    fetchMachines(organisationId)
      .then(res => setMachines(res.filter(machine => !machine.productionLineId || machine.productionLineId === productionLine.id)))
  }

  // Opening and Closing Dialog helpers
  useEffect(() => {
    // fetch when opening update dialog
    if (open && productionLine) {
      // console.log(productionLine)
      getBoms();
      getMachines();

      setSelectedBoms(productionLine.boms)
      setSelectedMachines(productionLine.machines);

      const gracePeriod = productionLine.gracePeriod;
      let milliseconds = gracePeriod;

      const hours = Math.floor(milliseconds / 3600000);
      milliseconds %= 3600000;
      const minutes = Math.floor(milliseconds/ 60000);
      milliseconds %= 60000;
      const seconds = Math.floor(milliseconds /= 1000);

      formik.setFieldValue('hours', hours);
      formik.setFieldValue('minutes', minutes);
      formik.setFieldValue('seconds', seconds);
    }
    if (!open) {
      setMachines([])
      setSelectedMachines([])
    }
  }, [open])


  const formik = useFormik({
    initialValues: {
      name: productionLine ? productionLine.name : '',
      description: productionLine ? productionLine.description : '',
      // Grace Period
      hours: 0,
      minutes: 0,
      seconds: 0,
      // ---------
      productionCostPerHour: productionLine ? productionLine.productionCostPerLot : 1,
      totalProductionCost: productionLine ? productionLine.productionCostPerLot * (productionLine.endTime - productionLine.startTime) : 1,
      outputPerHour: productionLine ? productionLine.outputPerHour : 1,
      totalOutput: productionLine ? productionLine.outputPerHour * (productionLine.endTime - productionLine.startTime) : 1,
      startTime: productionLine ? productionLine.startTime : 0,
      endTime: productionLine ? productionLine.endTime : 0,
      totalTime: productionLine ? productionLine.endTime - productionLine.startTime : 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Enter Production Line name'),
      description: Yup.string().required('Enter Production Line Description'),
      hours: Yup
        .number()
        .integer()
        .min(0, 'Hours must not be negative')
        .required('Enter number of hours for grace period'),
      minutes: Yup
        .number()
        .integer()
        .min(0, 'Minutes must not be negative')
        .max(59, 'Minutes cannot be more than 59')
        .required('Enter number of minutes for grace period'),
      seconds: Yup
        .number()
        .integer()
        .min(0, 'Seconds must not be negative')
        .max(59, 'Seconds cannot be more than 59')
        .required('Enter number of seconds for grace period'),
      productionCostPerHour: Yup
        .number()
        .positive('Must be positive')
        .required('Enter Production Cost per Hour'),
      outputPerHour: Yup
        .number()
        .positive('Must be positive').required('Enter Output per Hour'),
      startTime: Yup
        .number()
        .integer()
        .min(0, 'Must not be negative')
        .max(23, )
        .required('Enter Start Time (Hour)'),
      endTime: Yup.number()
        .integer()
        .min(0, 'Must not be negative')
        .max(23, )
        .required('Enter End Time (Hour)')
        .moreThan(Yup.ref('startTime'), 'End Time must be after Start Time'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const disabled = productionLine ? productionLine.schedules.find(schedule => schedule.status === 'ongoing' || schedule.status === 'planned') : false;

  // Time Changes
  useEffect(() => {
    const newTotalTime = Math.max(formik.values.endTime - formik.values.startTime, 0)
    formik.setFieldValue('totalTime', newTotalTime);
    formik.setFieldValue('totalOutput', formik.values.outputPerHour * newTotalTime);
    formik.setFieldValue('totalProductionCost', formik.values.productionCostPerHour * newTotalTime)
  }, [formik.values.startTime, formik.values.endTime])

  // Output per Hour change
  useEffect(() => {
    formik.setFieldValue('totalOutput', formik.values.outputPerHour * formik.values.totalTime)
  }, [formik.values.outputPerHour])

  // Prod Cost per Hour change
  useEffect(() => {
    formik.setFieldValue('totalProductionCost', formik.values.productionCostPerHour * formik.values.totalTime)
  }, [formik.values.productionCostPerHour])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog 
        fullWidth
        open={open} 
        onClose={onClose}
      >
        <DialogTitle>
          {`Update `}
          {string}
        </DialogTitle>
        <DialogContent>
          <Stack sx={{ mt: 1 }} spacing={1}>
            {/* BOM Selection */}
            <Autocomplete
              id="boms-selector"
              multiple
              disableCloseOnSelect
              options={boms}
              getOptionLabel={(option) => `${option.id} - ${option.finalGood.skuCode}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedBoms}
              onChange={(e, value) => setSelectedBoms(value)}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {`BOM ${option.id} - ${option.finalGood.skuCode}`}
                </li>
              )}
              renderInput={(params) => (<TextField {...params} label="Bills of Material" />)}
              disabled={disabled}
            />
            {/* Machines Selection */}
            <Autocomplete
              id="machines-selector"
              multiple
              disableCloseOnSelect
              options={machines}
              getOptionLabel={(option) => `${option.make} ${option.model}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedMachines}
              onChange={(e, value) => setSelectedMachines(value)}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {`${option.make} ${option.model}`}
                </li>
              )}
              renderInput={(params) => (<TextField {...params} label="Machines" />)}
              disabled={disabled}
            />
          </Stack>
          <TextField
            fullWidth
            error={Boolean(formik.touched.name && formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            label="Production Line Name"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
          />
          <TextField
            fullWidth
            error={Boolean(formik.touched.description && formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outlined"
            multiline
            minRows={3}
          />
          <Typography sx={{ml: 1}}>Grace Period</Typography>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <TextField
              fullWidth
              error={Boolean(formik.touched.hours && formik.errors.hours)}
              helperText={formik.touched.hours && formik.errors.hours}
              label="Hours"
              margin="normal"
              name="hours"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.hours}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
              disabled={disabled}
            />
            <TextField
              fullWidth
              error={Boolean(formik.touched.minutes && formik.errors.minutes)}
              helperText={formik.touched.minutes && formik.errors.minutes}
              label="Minutes"
              margin="normal"
              name="minutes"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.minutes}
              variant="outlined"
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              disabled={disabled}
            />
            <TextField
              fullWidth
              error={Boolean(formik.touched.seconds && formik.errors.seconds)}
              helperText={formik.touched.seconds && formik.errors.seconds}
              label="Seconds"
              margin="normal"
              name="seconds"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.seconds}
              variant="outlined"
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              disabled={disabled}
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <TextField
              fullWidth
              error={Boolean(formik.touched.startTime && formik.errors.startTime)}
              helperText={formik.touched.startTime && formik.errors.startTime}
              label="Start Time (Hour)"
              margin="normal"
              name="startTime"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.startTime}
              variant="outlined"
              InputProps={{ inputProps: { min: 0, max: 23 } }}
              disabled={disabled}
            />
            <TextField
              fullWidth
              error={Boolean(formik.touched.endTime && formik.errors.endTime)}
              helperText={formik.touched.endTime && formik.errors.endTime}
              label="End Time (Hour)"
              margin="normal"
              name="endTime"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.endTime}
              variant="outlined"
              InputProps={{ inputProps: { min: 0, max: 23 } }}
              disabled={disabled}
            />
            <TextField
              fullWidth
              label="Total Hours"
              margin="normal"
              name="totalTime"
              type="number"
              value={formik.values.totalTime}
              variant="outlined"
              InputProps={{ inputProps: { min: 0, max: 23 } }}
              disabled
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <TextField
              fullWidth
              error={Boolean(formik.touched.outputPerHour && formik.errors.outputPerHour)}
              helperText={formik.touched.outputPerHour && formik.errors.outputPerHour}
              label="Output per Hour"
              margin="normal"
              name="outputPerHour"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.outputPerHour}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
              disabled={disabled}
            />
            <TextField
              fullWidth
              label="Total Output"
              margin="normal"
              name="totalOutput"
              type="number"
              value={formik.values.totalOutput}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
              disabled
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <TextField
              fullWidth
              error={Boolean(formik.touched.productionCostPerHour && formik.errors.productionCostPerHour)}
              helperText={formik.touched.productionCostPerHour && formik.errors.productionCostPerHour}
              label="Production Cost per Hour"
              margin="normal"
              name="productionCostPerHour"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.productionCostPerHour}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
              disabled={disabled}
            />
            <TextField
              fullWidth
              label="Total Production Cost"
              margin="normal"
              name="totalProductionCost"
              type="number"
              value={formik.values.totalProductionCost}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
              disabled
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              !formik.isValid || 
              formik.isSubmitting ||
              selectedBoms.length === 0 ||
              selectedMachines.length === 0
            }
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
