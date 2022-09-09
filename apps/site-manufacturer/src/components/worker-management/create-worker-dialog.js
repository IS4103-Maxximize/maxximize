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

export const CreateWorkerDialog = ({
  openDialog,
  setOpenDialog,
  addWorker,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //Handle dialog close from child dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  //Change this to retrieve local storage user organisation Id
  const organisationId = '1';

  //Handle Formik submission
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const min = 100000;
    const max = 100000000;
    const rand = min + Math.random() * (max - min);

    formik.values.username =
      formik.values.firstName + formik.values.lastName + rand.toString();

    const response = await fetch('http://localhost:3000/api/users/createUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        username: formik.values.username,
        password: formik.values.password,
        role: formik.values.role,
        organisationId: organisationId,
        contact: {
          address: formik.values.address,
          email: formik.values.email,
          phoneNumber: formik.values.phoneNumber,
          postalCode: formik.values.postalCode,
        },
      }),
    });

    const result = await response.json();

    console.log(result);

    const flattenResult = flattenObj(result);

    console.log(flattenResult);

    //Rerender parent data grid compoennt
    addWorker(flattenResult);

    handleDialogClose();
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: 'password',
      role: '',
      address: '',
      postalCode: '',
      email: '',
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      role: Yup.string().required('Role is required'),
      address: Yup.string().max(255).required('Address is required'),
      postalCode: Yup.string().max(255).required('Postal Code is required'),
      email: Yup.string().max(255).required('Email is required'),
      phoneNumber: Yup.string().max(16).required('Phone Number is required'),
    }),
  });

  const workerRoles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'FactoryWorker', label: 'FactoryWorker' },
    { value: 'Driver', label: 'Driver' },
  ];

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleDialogClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Create Worker Account'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleOnSubmit}>
          <TextField
            error={Boolean(formik.touched.firstName && formik.errors.firstName)}
            fullWidth
            helperText={formik.touched.firstName && formik.errors.firstName}
            label="First Name"
            margin="normal"
            name="firstName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.firstName}
            variant="outlined"
            size="small"
          />
          <TextField
            error={Boolean(formik.touched.lastName && formik.errors.lastName)}
            fullWidth
            helperText={formik.touched.lastName && formik.errors.lastName}
            label="Last Name"
            margin="normal"
            name="lastName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.lastName}
            variant="outlined"
            size="small"
          />
          <TextField
            select
            fullWidth
            helperText={formik.touched.role && formik.errors.role}
            label="Role"
            margin="normal"
            name="role"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="string"
            value={formik.values.role}
            variant="outlined"
            size="small"
          >
            {workerRoles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            error={Boolean(formik.touched.address && formik.errors.address)}
            fullWidth
            helperText={formik.touched.address && formik.errors.address}
            label="Address"
            margin="normal"
            name="address"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.address}
            variant="outlined"
            size="small"
          />
          <TextField
            error={Boolean(
              formik.touched.postalCode && formik.errors.postalCode
            )}
            fullWidth
            helperText={formik.touched.postalCode && formik.errors.postalCode}
            label="Postal Code"
            margin="normal"
            name="postalCode"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.postalCode}
            variant="outlined"
            size="small"
          />
          <TextField
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label="Email"
            margin="normal"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
            variant="outlined"
            size="small"
          />
          <TextField
            error={Boolean(
              formik.touched.phoneNumber && formik.errors.phoneNumber
            )}
            fullWidth
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            label="Phone Number"
            margin="normal"
            name="phoneNumber"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
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
              Create Account
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

//Helper methods
//Flatten the worker record retrieved, difficult to update with an inner object
const flattenObj = (obj, parent, res = {}) => {
  for (let key in obj) {
    let propName = key;
    if (typeof obj[key] == 'object' && key != 'organisation') {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};
