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
  import { fetchMachine, fetchProductionLines } from '../../helpers/assetManagement';
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
      updateMachine,
      addMachine,
      handleAlertOpen,
      machine,
    } = props;
    
    const [error, setError] = useState('');

    let initialValues = {
      id: machine ? machine.id : '',
      serialNumber: machine ? machine.serialNumber : '',
      description: machine ? machine.description : '',
      make: machine ? machine.make : '',
      model: machine ? machine.model : '',
      year: machine ? machine.year : '',
      lastServiced: machine ? machine.lastServiced : '',
      remarks: machine ? machine.remarks : '',
      productionLineId: machine ? machine.productionLine : '',
      isOperating: machine ? machine.isOperating : "operating" ,
    };

    let schema = {
      description: Yup.string(),
      serialNumber: Yup.string().required('Serial Number is required'),
      make: Yup.string(),
      model: Yup.string(),
      year: Yup.string(),
      // lastServiced: Yup.date(),
      remarks: Yup.string(),
      // productionLineId: Yup.string(),
      // status: Yup.boolean().required('Status is required'),
    };
  
    const handleOnSubmit = async () => {
      if (action === 'POST') {
        const response = await fetch('http://localhost:3000/api/factory-machines', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({        
          description: formik.values.description,
          serialNumber: formik.values.serialNumber,
          make: formik.values.make,
          model: formik.values.model,
          year: formik.values.year,
          lastServiced: selectedDate,
          remarks: formik.values.remarks,
          isOperating: formik.values.isOperating,
        }),
      });
  
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        console.log(result)
        addMachine(result)
        handleAlertOpen(`Added Machine ${result.id} successfully`);
        setError('');
        handleClose();
      } else {
        const result = await response.json();
        setError(result.message);
      }
      } else if (action === 'PATCH') {
        console.log(machine)
          const response = await fetch(`http://localhost:3000/api/factory-machines/${machine.id}`, {
              method: 'PATCH',
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                description: formik.values.description,
                make: formik.values.make,
                model: formik.values.model,
                year: formik.values.year,
                lastServiced: selectedDate,
                remarks: formik.values.remarks,
                isOperating: formik.values.isOperating,
                  }),
                });
                if (response.status === 200 || response.status === 201) {
                  const result = await response.json();
                  console.log(result)
                  updateMachine(result)
                  handleAlertOpen(`Updated Machine ${result.id} successfully`);
                  setError('');
                  handleClose();
                } else {
                  const result = await response.json();
                  setError(result.message);
                }
      };
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

    const [dateTime, setDateTime] = useState([]);

    const [selectedDate, handleDateChange] = useState([]);
    const fetchDate = async () => {
      const dateTime = await fetchMachine(user.organisation.id);
      setDateTime(dateTime);
    };

    useEffect(() => {  
      fetchDate();
      if(action=="PATCH") {
        const selectedDate = machine?.lastServiced;
      }
    },[open]);
  

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
                disabled={action === 'PATCH'}
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
                disabled={action === 'PATCH'}
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
                disabled={action === 'PATCH'}
                
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
                disabled={action === 'PATCH'}
                
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
            disableFuture={true}
            />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status :</Typography>
              <RadioGroup
                label="isOperating"
                margin="normal"
                name="isOperating"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.isOperating}
                defaultValue={formik.values.isOperating}
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
  