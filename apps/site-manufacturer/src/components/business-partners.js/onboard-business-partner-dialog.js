import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    useTheme,
    Box,
  } from '@mui/material';
  import useMediaQuery from '@mui/material/useMediaQuery';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  //import organisation from 

  export const OnboardBusinessPartner = ({
    openDialog,
    setOpenDialog,
    addOrganisation,
  }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    const handleDialogClose = () => {
      setOpenDialog(false);
      formik.resetForm();
    };
  
    const handleOnSubmit = async (event) => {
      event.preventDefault();
  
      const response = await fetch('http://localhost:3000/api/shell-organisations', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formik.values.name,
          uen: formik.values.uen,
          contact: {
            address: formik.values.address,
            email: formik.values.email,
            phoneNumber: formik.values.phoneNumber,
            postalCode: formik.values.postalCode,
          },
        }),
      });
  
      const result = await response.json();
  
      addOrganisation(result);
  
      handleDialogClose();
    };
  
    const formik = useFormik({
      initialValues: {
        name: '',
        //organisationId:organisations.organisationId,
        uen: '',
        address: '',
        postalCode: '',
        email: '',
        phoneNumber: '',
      },
      validationSchema: Yup.object({
        name: Yup.string().required('Organisation name is required'),
        uen: Yup.string().max(255).required('UEN is required').test('Unique UEN', 'UEN already in use', // <- key, message
        function (value) {
            return new Promise((resolve, reject) => {
                fetch('http://localhost:3000/api/shell-organisations')
                    .then((res) => {
                        resolve(true)
                    })
                    .catch((error) => {
                        if (error.response.data.content === "The uen has already been taken.") {
                            resolve(false);
                        }
                    })
            })
        }
    ),
        address: Yup.string().max(255).required('Address is required'),
        postalCode: Yup.string().max(255).required('Postal Code is required'),
        email: Yup.string().max(255).required('Email is required'),
        phoneNumber: Yup.string().max(16).required('Phone Number is required'),
      }),
    });
    
    return (
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Onboard New Business Partner'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleOnSubmit}>
          <TextField
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Name"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
            size="small"
          />

        <TextField
            error={Boolean(formik.touched.uen && formik.errors.uen)}
            fullWidth
            helperText={formik.touched.uen && formik.errors.uen}
            label="UEN"
            margin="normal"
            name="uen"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.uen}
            variant="outlined"
            size="small"
          />

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
              <Button autoFocus 
              onClick={handleDialogClose}>
                Back
              </Button>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                size="large"
                type="submit"
                variant="contained"
              >
                Onboard Account
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  