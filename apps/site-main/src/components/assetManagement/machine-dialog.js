import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchMachine, fetchProductionLines } from '../../helpers/assetManagement';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';

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

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

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
    isOperating: machine ? machine.isOperating : true ,
  };

  let schema = {
    description: Yup.string().required("Description is required"),
    serialNumber: Yup.string().required('Serial Number is required'),
    make: Yup.string().required("Make is required"),
    model: Yup.string().required("Model is required"),
    year: Yup.number().integer("Year must be a whole number").positive("Year must be positive").required("Year is required"),
    remarks: Yup.string().required("Remarks is required"),
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
        organisationId: organisationId
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      console.log(result)
      addMachine(result)
      handleAlertOpen(`Added Machine ${result.id} successfully`);
      setError('');
	  onClose();
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
                onClose();
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

  const [selectedDate, handleDateChange] = useState();

  useEffect(() => {  
    if(action=="PATCH" && open) {
      handleDateChange(machine.lastServiced)
    }
    if (!open) {
      handleDateChange(null)
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
			  type="number"
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
          
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!formik.isValid || formik.isSubmitting || !selectedDate}
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
