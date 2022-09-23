import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
  } from '@mui/material';
  import { Stack } from '@mui/system';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import { createMachine, updateMachine, fetchProductionLines } from '../../helpers/assetManagement';
  import { DateTimePicker } from '@mui/x-date-pickers';
  import { useEffect, useState } from 'react';
  
  const options = ['operating', 'not operating'];
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  export const MachineDialog = (props) => {
    const {
      action,
      open,
      handleClose,
      machine,
      addMachine,
      handleAlertOpen,
      organisationId,
      updateMachines,
    } = props;
  
    let initialValues = {
      id: machine ? machine.id : null,
      serialNumber: machine ? machine.serialNumber : '',
      description: machine ? machine.description : '',
      make: machine ? machine.make : '',
      model: machine ? machine.model : '',
      year: machine ? machine.year : '',
      lastServiced: machine ? machine.lastServiced : '',
      remarks: machine ? machine.remarks : '',
      productionLineId: machine ? machine.productionLineId : '',
      status: machine ? Boolean(machine.isOperating) : false,
    };

    let schema = {
      description: Yup.string(),
      serialNumber: Yup.string().required('Serial Number is required'),
      make: Yup.string(),
      model: Yup.string(),
      year: Yup.string(),
      lastServiced: Yup.date(),
      remarks: Yup.string(),
      productionLineId: Yup.string().required('Production line is required'),
      status: Yup.boolean(),
    };
  
    const handleOnSubmit = async (values) => {
      if (action === 'POST') {
        const result = await createMachine(values, organisationId).catch(
          (err) => handleAlertOpen(`Error creating Machine`, 'error')
        );
        addMachine(result);
      } else if (action === 'PATCH') {
        try {
          const updatedMachine = await updateMachine(machine.id, values);
          updateMachines(updatedMachine);
          handleAlertOpen(
            `Updated Machine ${updatedMachine.id} successfully!`,
            'success'
          );
        } catch (err) {
          handleAlertOpen(`Error updating machine`, 'error');
        }
      }
      onClose();
    };
  
    const formik = useFormik({
      initialValues: initialValues,
      enableReinitialize: true,
      validationSchema: Yup.object(schema),
      onSubmit: handleOnSubmit,
    });
  
    const onClose = () => {
      formik.resetForm();
      handleClose();
    };
    
    const [selectedDate, handleDateChange] = useState(new Date());

    const [productionLineOptions, setProductionLineOptions] = useState([]);
    const [selectedProductionLines, setSelectedProductionLines] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        const productionLineNames = await fetchProductionLines(user.organisation.factoryMachine.productionLine.name);
        setProductionLineOptions(productionLineNames.map((productionLine) => productionLine.name));
      };
  
      if (action === 'POST') {
        fetchData();
      }
    });

    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setSelectedProductionLines(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };
  

    return (
      <form onSubmit={formik.handleSubmit}>
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>
            {action === 'POST' && 'Add '}
            {action === 'PATCH' && 'Edit '}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter Machine Details
            </DialogContentText>
            <TextField
                required
                error={Boolean(formik.touched.serialNumber && formik.errors.serialNumber)}
                fullWidth
                helperText={formik.touched.serialNumber && formik.errors.serialNumber}
                label="Serial Number"
                margin="normal"
                name="serialNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.serialNumber}
                variant="outlined"
                disabled
              />           
            <TextField
              error={Boolean(
                formik.touched.description && formik.errors.description
              )}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Description"
              margin="normal"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              variant="outlined"
              multiline
              minRows={4}
              autoFocus={action === 'PATCH'}
            />
            <TextField
                required
                error={Boolean(formik.touched.make && formik.errors.make)}
                fullWidth
                helperText={formik.touched.make && formik.errors.make}
                label="Make"
                margin="normal"
                name="make"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.make}
                variant="outlined"
                
              />
            <TextField
                required
                error={Boolean(formik.touched.model && formik.errors.model)}
                fullWidth
                helperText={formik.touched.model && formik.errors.model}
                label="Model"
                margin="normal"
                name="model"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.model}
                variant="outlined"
                
              />
            <TextField
                required
                error={Boolean(formik.touched.year && formik.errors.year)}
                fullWidth
                helperText={formik.touched.year && formik.errors.year}
                label="Year"
                margin="normal"
                name="year"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.year}
                variant="outlined"
                
              />         
            <TextField
              required
              error={Boolean(formik.touched.remarks && formik.errors.remarks)}
              fullWidth
              helperText={formik.touched.remarks && formik.errors.remarks}
              label="Remarks"
              margin="normal"
              name="remarks"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.remarks}
              variant="outlined"
              
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Last Serviced Date :</Typography>
            <DateTimePicker
            label="Last Serviced Date"
            inputVariant="outlined"
            value={selectedDate}
            renderInput={(props) => <TextField {...props} />}
            onChange={handleDateChange}
            />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Machines under Production Line :</Typography>
            <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="productionLineNamesLabel">Production Lines</InputLabel>
        <Select
          labelId="productionLineNamesLabel"
          id="productionLineNames"
          multiple
          value={selectedProductionLines}
          onChange={handleChange}
          input={<OutlinedInput label="Production Line Name" />}
        >
          {productionLineOptions.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
          </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status :</Typography>
              <RadioGroup
                label="Status"
                margin="normal"
                name="status"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.status}
                defaultValue={options[0]}
                row
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                    
                  />
                ))}
              </RadioGroup>
            </Stack>
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
  