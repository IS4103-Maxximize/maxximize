import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    MenuItem,
    useTheme,
    Box,
  } from '@mui/material';
  import useMediaQuery from '@mui/material/useMediaQuery';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  
  export const CreateMachineDialog = ({
    openDialog,
    setOpenDialog,
    addMachine,
  }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    const handleDialogClose = () => {
      setOpenDialog(false);
      formik.resetForm();
    };
  
    const handleOnSubmit = async (event) => {
      event.preventDefault();
  
      formik.values.username = formik.values.firstName + formik.values.lastName;
  
      const response = await fetch('http://localhost:3000/api/users/createUser', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formik.values.description,
          make: formik.values.make,
          model: formik.values.model,
          year: formik.values.year,
          lastServiced: formik.values.lastServiced,
          organisationId: 1,
          schedule: {
            start: formik.values.start,
            end: formik.values.end,
            type: formik.values.type,
          },
          sensor: {
            temperature: formik.values.temperature,
            humidity: formik.values.humidity,
          },
        }),
      });
  
      const result = await response.json();
  
      addMachine(result);
  
      handleDialogClose();
    };
  
    const formik = useFormik({
      initialValues: {
        description: '',
        make: '',
        model: '',
        year: '',
        lastServiced: '',
        start: '',
        end: '',
        type: '',
        temperature: '',
        humidty: '',
      },

      validationSchema: Yup.object({
        description: Yup.string().required('Description of machine is required'),
        make: Yup.string().required('Make of machine is required'),
        model: Yup.string().required('Model of machine is required'),
        year: Yup.date().required('Year of model is required'),
        lastServiced: Yup.date().required('Date of last servicing is required'),
        start: Yup.date().required('Start Date is required'),
        end: Yup.date().required('End Date is required'),
        type: Yup.string().required('Schedule Type of machine is required'),
      }),
    });
  
    const scheduleType = [

      { value: 'MAINTENANCE', label: 'MAINTENANCE' },
      { value: 'AVAILABLE', label: 'AVAILABLE' },
      { value: 'RECONFIGURATION', label: 'RECONFIGURATION' },
      { value: 'DELIVERY', label: 'DELIVERY' },
    ];
  
    return (
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Create New Machine'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleOnSubmit}>
            <TextField
              error={Boolean(formik.touched.description && formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Description"
              margin="normal"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              variant="outlined"
              size="small"
            />
            <TextField
              error={Boolean(formik.touched.make && formik.errors.make)}
              fullWidth
              helperText={formik.touched.make && formik.errors.make}
              label="Machine Make"
              margin="normal"
              name="make"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.make}
              variant="outlined"
              size="small"
            />
            <TextField
              select
              fullWidth
              helperText={formik.touched.model && formik.errors.model}
              label="Machine Model"
              margin="normal"
              name="model"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="string"
              value={formik.values.model}
              variant="outlined"
              size="small"
            >
            </TextField>
            
            <TextField
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
              size="small"
            />
            <TextField
              error={Boolean(formik.touched.lastServiced && formik.errors.lastServiced)}
              fullWidth
              helperText={formik.touched.lastServiced && formik.errors.lastServiced}
              label="Date of Last Servicing"
              margin="normal"
              name="lastServiced"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.lastServiced}
              variant="outlined"
              size="small"
            />
            <TextField
              error={Boolean(formik.touched.start && formik.errors.start)}
              fullWidth
              helperText={formik.touched.start && formik.errors.start}
              label="Start Date"
              margin="normal"
              name="start"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.start}
              variant="outlined"
              size="small"
            />

            <TextField
              error={Boolean(
                formik.touched.end && formik.errors.end
              )}
              fullWidth
              helperText={formik.touched.end && formik.errors.end}
              label="End Date"
              margin="normal"
              name="end"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.end}
              variant="outlined"
              size="small"
            />
            
            <TextField
            select
            fullWidth
            helperText={formik.touched.type && formik.errors.type}
            label="Schedule Type"
            margin="normal"
            name="type"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="string"
            value={formik.values.type}
            variant="outlined"
            size="small"
          >
            {scheduleType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
              label="Temperature"
              margin="normal"
              name="temperature"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.temperature}
              variant="outlined"
              size="small"
            />

        <TextField
              label="Humidity"
              margin="normal"
              name="humidity"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.humidity}
              variant="outlined"
              size="small"
            />                    

            <Box
              mt={1}
              mb={1}
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button autoFocus onClick={handleDialogClose}>
                Back
              </Button>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                size="large"
                type="submit"
                variant="contained"
              >
                Create New Machine
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  