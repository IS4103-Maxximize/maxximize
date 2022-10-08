import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { createProductionLine, fetchMachines } from "../../helpers/assetManagement";
import { fetchBOMs } from "../../helpers/production/bom";


export const ProductionLineDialogNew = (props) => {
  const {
    open,
    handleClose,
    string,
    handleAlertOpen,
    handleAlertClose,
    addProductionLine,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const handleOnSubmit = async (values) => {
    // submit
    console.log(values);

    const createProductionLineDto = {
      name: values.name,
      description: values.description,
      bomId: selectedBom.id,
      productionCostPerLot: values.productionCostPerLot,
      gracePeriod: 3600000 * values.hours + 60000 * values.minutes + 1000 * values.seconds,
      organisationId: organisationId,
      outputPerHour: values.outputPerHour,
      startTime: values.startTime,
      endTime: values.endTime,
      machineIds: selectedMachines.map(machine => machine.id)
    }

    createProductionLine(createProductionLineDto)
      .then(res => {
        onClose();
        addProductionLine(res)
        handleAlertOpen(`Successfully Created Production Line ${res.id}!`, 'success');
      })
      .catch(err => console.log(err)) //handleAlertOpen('Failed to Create Production Line', 'error'));
  };

  const [selectedBom, setSelectedBom] = useState();
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [boms, setBoms] = useState([]);
  const [machines, setMachines] = useState([]);

  const getBoms = () => {
    fetchBOMs(organisationId)
      .then(res => setBoms(res))
  }

  const getMachines = () => {
    fetchMachines(organisationId)
      .then(res => setMachines(res.filter(machine => !machine.productionLineId)))
  }

  // Opening and Closing Dialog helpers
  useEffect(() => {
    // fetch when opening create dialog
    if (open) {
      getBoms();
      getMachines();
    }
  }, [open])


  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      // Grace Period
      hours: 0,
      minutes: 0,
      seconds: 0,
      // ---------
      productionCostPerLot: 1,
      outputPerHour: 1,
      startTime: 0,
      endTime: 0,
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
      productionCostPerLot: Yup
        .number()
        .positive('Must be positive')
        .required('Enter Production Cost per Lot'),
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog 
        // fullScreen
        fullWidth
        open={open} 
        onClose={onClose}
      >
        <DialogTitle>
          {`Create `}
          {string}
        </DialogTitle>
        <DialogContent>
          <Stack sx={{ mt: 1 }} direction="row" spacing={1}>
            {/* BOM Selection */}
            <Autocomplete
              id="bom-selector"
              sx={{ width: '40%'}}
              options={boms}
              getOptionLabel={(option) => `BOM ${option.id} - ${option.finalGood.skuCode}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => setSelectedBom(value)}
              renderInput={(params) => (<TextField {...params} label="BOM" />)}
            />
            {/* Machines Selection */}
            <Autocomplete
              id="machines-selector"
              sx={{ width: '60%'}}
              multiple
              disableCloseOnSelect
              options={machines}
              getOptionLabel={(option) => `${option.make} ${option.model}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
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
            />
          </Stack>
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
            />
            <TextField
              fullWidth
              error={Boolean(formik.touched.productionCostPerLot && formik.errors.productionCostPerLot)}
              helperText={formik.touched.productionCostPerLot && formik.errors.productionCostPerLot}
              label="Production Cost per Lot"
              margin="normal"
              name="productionCostPerLot"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.productionCostPerLot}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!formik.isValid || formik.isSubmitting || !selectedBom || selectedMachines.length === 0}
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