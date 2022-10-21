import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { updateVehicle } from "../../helpers/deliveryFleet";

const options = ['available', 'out for service'];

export const VehicleUpdateDialog = (props) => {
  const {
    open,
    handleClose,
    vehicle,
	  handleRowUpdate,
    handleAlertOpen,
    handleAlertClose,
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const handleOnSubmit = async (values) => {
    // submit
    console.log(values);

    const updateVehicleDto = {
      id: values.id,
      description: values.description,
      make: values.make,
      model: values.model,
      year: values.year,
      lastServiced: selectedDate,
      remarks: values.remarks,
      licensePlate : values.licensePlate,
      organisationId: organisationId,
      loadCapacity:values.loadCapacity,
      location: values.location,
      currentStatus: values.currentStatus,
      isOperating: values.isOperating 
    }

    console.log(updateVehicleDto);

    updateVehicle(vehicle.id, updateVehicleDto)
      .then(res => {
		handleRowUpdate(res)
        onClose();
        handleAlertOpen(`Updated Vehicle ${res.id} successfully!`, 'success');
      })
      .catch(err => handleAlertOpen('Failed to Update Vehicle', 'error'));
  };

  const formik = useFormik({
    initialValues: {
      id: vehicle ? vehicle.id : '',
      description: vehicle ? vehicle.description : '',
      make: vehicle ? vehicle.make : '',
      model: vehicle ? vehicle.model : '',
      year: vehicle ? vehicle.year : '',
      lastServiced: vehicle ? vehicle.lastServiced : '',
      remarks: vehicle ? vehicle.remarks : '',
      currentStatus: vehicle ? vehicle.currentStatus : '',
      licensePlate: vehicle ? vehicle.licensePlate : '',
      loadCapacity:vehicle ? vehicle.loadCapacity : '',
      location: vehicle ? vehicle.location : '',
      isOperating: vehicle ? vehicle.isOperating : '',
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Description is required"),
      make: Yup.string().required("Make is required"),
      model: Yup.string().required("Model is required"),
      year: Yup.number().integer("Year must be a whole number").positive("Year must be positive").required("Year is required"),
      remarks: Yup.string().required("Remarks is required"),
      licensePlate: Yup.string().required('Enter License Plate'),
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
    if( open) {
      handleDateChange(vehicle.lastServiced)
    }
    if (!open) {
      handleDateChange(null)
    }
  },[open]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog 
        fullWidth
        open={open} 
        onClose={onClose}
      >
        <DialogTitle>
          {`Update Vehicle Details`}
        </DialogTitle>
        <DialogContent>
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
            fullWidth
            error={Boolean(formik.touched.licensePlate && formik.errors.licensePlate)}
            helperText={formik.touched.licensePlate && formik.errors.licensePlate}
            label="License Plate"
            margin="normal"
            name="name"
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

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Status:</Typography>
            <RadioGroup
              label="Current Status"
              margin="normal"
              name="currentStatus"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.currentStatus}
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
