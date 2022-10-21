import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { createVehicle } from "../../helpers/deliveryFleet";

export const VehicleCreateDialog = (props) => {
  const {
    open,
    handleClose,
    addVehicle,
    handleAlertOpen,
    handleAlertClose,
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const handleOnSubmit = async (values) => {

    const CreateVehicleDto = {
      id:values.id,
      description: values.description,
      make: values.make,
      model: values.model,
      year: values.year,
      lastServiced: selectedDate,
      remarks: values.remarks,
      licensePlate: values.licensePlate,
      loadCapacity:values.loadCapacity,
      location: values.location,
      organisationId: organisationId,
      currentStatus: 'Available',
      isOperating: values.isOperating ,
    }

    createVehicle(CreateVehicleDto)
      .then(res => {
        // console.log(res)
        onClose();
        addVehicle(res)
        handleAlertOpen(`Added Vehicle ${res.id} successfully!`, 'success');
      })
      .catch(err => handleAlertOpen('Failed to Create Vehicle', 'error'));
  }

  const formik = useFormik({
    initialValues: {
      id: '',
      description: '',
      make: '',
      model: '',
      year: '',
      lastServiced: '',
      remarks: '',
      currentStatus: 'Available',
      licensePlate: '',
      loadCapacity:'',
      location: '',
      isOperating: true ,
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Enter Vehicle Description'),
      make: Yup.string().required("Make is required"),
      model: Yup.string().required("Model is required"),
      year: Yup.number().integer("Year must be a whole number").positive("Year must be positive").required("Year is required"),
      remarks: Yup.string().required('Enter Remarks for Vehicle'),
      licensePlate: Yup.string().required("License Plate Number is required"),
      location: Yup.string().required("Location is required"),
      loadCapacity: Yup.number().integer("Load Capacity must be a whole number").positive("Load Capacity must be positive").required("Load Capacity is required"),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  const [selectedDate, handleDateChange] = useState();
  
  useEffect(() => {  
    
    if (!open) {
      handleDateChange(null)
    }
  },[open]);

  useEffect(()=>console.log(selectedDate),[selectedDate]);


  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog 
        // fullScreen
        fullWidth
        open={open} 
        onClose={onClose}
      >
        <DialogTitle>
          {`Create New Vehicle`}
        </DialogTitle>
        <DialogContent>
          <TextField
            required
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
          
          <TextField
            required
            fullWidth
            error={Boolean(formik.touched.licensePlate && formik.errors.licensePlate)}
            helperText={formik.touched.licensePlate && formik.errors.licensePlate}
            label="License Plate"
            margin="normal"
            name="licensePlate"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.licensePlate}
            variant="outlined"
          />
          
          <TextField
              required
              error={Boolean(formik.touched.location && formik.errors.location)}
              fullWidth
              helperText={formik.touched.location && formik.errors.location}
              label="Location"
              margin="normal"
              name="location"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.location}
              variant="outlined"
            />
            
            <TextField
              required
              type="number"
              error={Boolean(formik.touched.loadCapacity && formik.errors.loadCapacity)}
              fullWidth
              helperText={formik.touched.loadCapacity && formik.errors.loadCapacity}
              label="Load Capacity"
              margin="normal"
              name="loadCapacity"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.loadCapacity}
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
            disabled={!formik.isValid || formik.isSubmitting || !selectedDate }
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
