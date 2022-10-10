import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { updateVehicle } from "../../helpers/deliveryFleet";


export const VehicleDialogUpdate = (props) => {
  const {
    open,
    handleClose,
    string,
    vehicle,
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

    const updateVehicleDto = {
      description: values.description,
      make: values.make,
      model: values.model,
      year: values.year,
      lastServiced: selectedDate,
      remarks: values.remarks,
      licensePlate : values.licensePlate,
      status: selectedStatus,
    }

    console.log(updateVehicleDto);

    updateVehicle(vehicle.id, updateVehicleDto)
      .then(res => {
		handleRowUpdate(res)
        onClose();
        handleAlertOpen(`Successfully Updated Vehicle ${res.id}!`, 'success');
      })
      .catch(err => handleAlertOpen('Failed to Update Vehicle', 'error'));
  };

  const formik = useFormik({
    initialValues: {
      description: vehicle ? vehicle.description : '',
      make: vehicle ? vehicle.make : '',
      model: vehicle ? vehicle.model : '',
      year: vehicle ? vehicle.year : '',
      lastServiced: selectedDate,
      remarks: vehicle ? vehicle.remarks : '',
      status: selectedStatus,
      licensePlate: vehicle ? vehicle.licensePlate : '',
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Description is required"),
      serialNumber: Yup.string().required('Serial Number is required'),
      make: Yup.string().required("Make is required"),
      model: Yup.string().required("Model is required"),
      year: Yup.number().integer("Year must be a whole number").positive("Year must be positive").required("Year is required"),
      remarks: Yup.string().required("Remarks is required"),
      licensePlate: Yup.string().required('Enter License Plate'),
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
    if(action=="PATCH" && open) {
      handleDateChange(machine.lastServiced)
    }
    if (!open) {
      handleDateChange(null)
    }
  },[open]);
  
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
