import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Card, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Dropzone, { useDropzone } from 'react-dropzone';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const steps = ['Register Your Organisation', 'Create an admin account'];

export const RegisterOrganisation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;

  //Submission
  const [error, setError] = useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const navigate = useNavigate();

  const handleBack = () => {
    if (activeStep !== 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      navigate(-1);
    }
  };

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitForm(values, actions) {
    setLoading(true);
    setDisabled(true);
    const min = 100000;
    const max = 1000000;
    const rand = Math.floor(min + Math.random() * (max - min));

    const username =
      formik.values.firstName + formik.values.lastName + rand.toString();

    const response = await fetch('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        createOrganisationDto: {
          name: values.orgName,
          type: values.orgType,
          uen: values.uen,
          contact: {
            phoneNumber: values.orgPhoneNumber,
            email: values.orgEmail,
            address: values.orgAddress,
            postalCode: values.orgPostalCode,
          },
        },
        createUserDto: {
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
          contact: {
            phoneNumber: values.phoneNumber,
            email: values.email,
            address: values.address,
            postalCode: values.postalCode,
          },
          username: username,
        },
      }),
    });

    if (response.status === 200 || response.status === 201) {
      //   console.log({
      //     files: values.files.map((file) => ({
      //       fileName: file.name,
      //       type: file.type,
      //       size: `${file.size} bytes`,
      //     })),
      //   });

      const result = await response.json();
      //   handleAlertOpen(`Created Warehouse ${result.id} successfully`);

      console.log(values.files);

      //   values.files.map(async (file) => {
      //     const uploadResponse = await fetch(
      //       `http://localhost:3000/api/files/upload?type=validation&applicationId=${result.id}`,
      //       {
      //         method: 'POST',
      //         headers: {
      //           Accept: 'application/json',
      //           'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify({
      //           files: file,
      //         }),
      //       }
      //     );

      //     if (uploadResponse.status === 200 || uploadResponse.status === 201) {
      //       const result = await uploadResponse.json();

      //       setError('');
      //       handleNext();
      //       setLoading(false);
      //       formik.resetForm();
      //     } else {
      //       const result = await uploadResponse.json();

      //       setError(result.message);
      //       setLoading(false);
      //       setDisabled(false);
      //     }
      //   });
      const formdata = new FormData();
      values.files.map((file) => {
        console.log(file);
        formdata.append('files', file, file.name);
      });

      console.log(formdata.entries());

      let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      const uploadResponse = await fetch(
        `http://localhost:3000/api/files/upload?type=validation&applicationId=${result.id}`,
        requestOptions
      );

      if (uploadResponse.status === 200 || uploadResponse.status === 201) {
        const result = await uploadResponse.json();

        setError('');
        handleNext();
        setLoading(false);
        formik.resetForm();
      } else {
        const result = await uploadResponse.json();

        setError(result.message);
        setLoading(false);
        setDisabled(false);
      }
    } else {
      const result = await response.json();
      setError(result.message);
      setLoading(false);
      setDisabled(false);
    }
  }

  const handleOnSubmit = async (values, actions) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      handleNext();
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const stepOneValidation = Yup.object({
    orgName: Yup.string()
      .min(1, 'Organisation Name must be at least be 1 character long')
      .max(60, 'Organisation Name can at most be 60 characters long')
      .required('Organisaion Name is required'),
    uen: Yup.string()
      .min(9, 'UEN must be at least be 9 characters long')
      .max(10, 'UEN can at most be 10 characters long')
      .required('UEN is required'),
    orgEmail: Yup.string()
      .email('Email must be in a proper format [eg. user@email.com]')
      .min(7, 'Email must be at least be 7 characters long')
      .max(62, 'Email can at most be 62 characters long')
      .required('Email is required'),
    orgAddress: Yup.string()
      .min(3, 'Address must be at least be 3 characters long')
      .max(95, 'Address can at most be 95 characters long')
      .required('Address is required'),
    orgPostalCode: Yup.string()
      .min(6, 'Postal Code must be at least be 6 digits')
      .max(6, 'Postal Code can at most be 6 digits')
      .required('Postal Code is required'),
    orgPhoneNumber: Yup.string()
      .min(8, 'Phone number must be at least be 8 digits')
      .max(16, 'Phone number can at most be 16 digits')
      .matches(new RegExp('[0-9]'), 'Phone number should only contain digits')
      .required('Phone Number is required'),
    files: Yup.mixed().required(),
  });

  const stepTwoValidation = Yup.object({
    firstName: Yup.string()
      .min(1, 'First Name must be at least be 1 character long')
      .max(50, 'First Name can at most be 50 characters long')
      .required('First name is required'),
    lastName: Yup.string()
      .min(1, 'Last Name must be at least be 1 character long')
      .max(50, 'Last Name can at most be 50 characters long')
      .required('Last name is required'),
    address: Yup.string()
      .min(3, 'Address must be at least be 3 characters long')
      .max(95, 'Address can at most be 95 characters long')
      .required('Address is required'),
    postalCode: Yup.string()
      .min(6, 'Postal Code must be at least be 6 digits')
      .max(6, 'Postal Code can at most be 6 digits')
      .required('Postal Code is required'),
    email: Yup.string()
      .email('Email must be in a proper format [eg. user@email.com]')
      .min(7, 'Email must be at least be 7 characters long')
      .max(62, 'Email can at most be 62 characters long')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .min(8, 'Phone number must be at least be 8 digits')
      .max(16, 'Phone number can at most be 16 digits')
      .matches(new RegExp('[0-9]'), 'Phone number should only contain digits')
      .required('Phone Number is required'),
  });

  const formik = useFormik({
    initialValues: {
      orgName: '',
      orgType: 'retailer',
      uen: '',
      orgEmail: '',
      orgAddress: '',
      orgPostalCode: '',
      orgPhoneNumber: '',
      firstName: '',
      lastName: '',
      username: '',
      address: '',
      postalCode: '',
      email: '',
      phoneNumber: '',
      file: '',
    },
    onSubmit: handleOnSubmit,
    validationSchema: activeStep === 0 ? stepOneValidation : stepTwoValidation,
  });

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 3,
    accept: {
      'application/pdf': ['.pdf'],
    },
    onDrop: (acceptedFiles) => {
      formik.setFieldValue('files', acceptedFiles);
    },
  });
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignitems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };

  const focusedStyle = {
    borderColor: '#2196f3',
  };

  const acceptStyle = {
    borderColor: '#00e676',
  };

  const rejectStyle = {
    borderColor: '#ff1744',
  };

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{'Organisation Registration'}</title>
        </Helmet>
      </HelmetProvider>

      {activeStep === steps.length ? (
        <Box
          mx="auto"
          my={'30vh'}
          width={'50%'}
          display="flex"
          alignItems="center"
        >
          <React.Fragment>
            <Card sx={{ padding: 4 }}>
              <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                Application Sent
              </Typography>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Registration complete. Please wait for 1 to 3 working days for
                application to be approved by Maxximize staff.
              </Typography>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Email will be sent to the admin account email address upon
                approval.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  variant="contained"
                  onClick={() => navigate('/organisationSelection')}
                >
                  Back to main page
                </Button>
              </Box>
            </Card>
          </React.Fragment>{' '}
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            mx="auto"
            mt={2}
            width="50%"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              disabled={disabled}
              color="inherit"
              onClick={handleBack}
              sx={{ height: '20%' }}
            >
              Back
            </Button>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ width: '70%' }}
            >
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {loading ? (
              <LoadingButton
                disabled={!formik.isValid || formik.isSubmitting || disabled}
                loading={loading}
                sx={{ height: '20%' }}
                variant="outlined"
              >
                Loading
              </LoadingButton>
            ) : (
              <Button
                disabled={!formik.isValid || formik.isSubmitting || disabled}
                autoFocus
                color="primary"
                size="medium"
                onClick={formik.handleSubmit}
                variant="contained"
                sx={{ height: '20%' }}
              >
                {isLastStep ? 'Register' : 'Next'}
              </Button>
            )}
          </Box>
          <React.Fragment>
            <form>
              <Box m={3}>
                {activeStep === 0 ? (
                  <Box
                    mx="auto"
                    my={3}
                    flex={1}
                    width={'50%'}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Card sx={{ padding: 4, height: '100vh' }}>
                      <Typography variant="h6" component="div">
                        Organisation Details
                      </Typography>
                      <TextField
                        error={Boolean(
                          formik.touched.orgName && formik.errors.orgName
                        )}
                        fullWidth
                        helperText={
                          formik.touched.orgName && formik.errors.orgName
                        }
                        label="Organisation Name"
                        margin="normal"
                        name="orgName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.orgName}
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
                      {/* <TextField
                      select
                      fullWidth
                      helperText={
                        formik.touched.orgType && formik.errors.orgType
                      }
                      label="Type"
                      margin="normal"
                      name="orgType"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="string"
                      value={formik.values.orgType}
                      variant="outlined"
                      size="small"
                    >
                      {orgTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField> */}

                      <TextField
                        error={Boolean(
                          formik.touched.orgAddress && formik.errors.orgAddress
                        )}
                        fullWidth
                        helperText={
                          formik.touched.orgAddress && formik.errors.orgAddress
                        }
                        label="Organisation Address"
                        margin="normal"
                        name="orgAddress"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.orgAddress}
                        variant="outlined"
                        size="small"
                      />
                      <TextField
                        error={Boolean(
                          formik.touched.orgPostalCode &&
                            formik.errors.orgPostalCode
                        )}
                        fullWidth
                        helperText={
                          formik.touched.orgPostalCode &&
                          formik.errors.orgPostalCode
                        }
                        label="Organisation Postal Code"
                        margin="normal"
                        name="orgPostalCode"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.orgPostalCode}
                        variant="outlined"
                        size="small"
                      />
                      <TextField
                        error={Boolean(
                          formik.touched.orgEmail && formik.errors.orgEmail
                        )}
                        fullWidth
                        helperText={
                          formik.touched.orgEmail && formik.errors.orgEmail
                        }
                        label="Organisation Email"
                        margin="normal"
                        name="orgEmail"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="orgEmail"
                        value={formik.values.orgEmail}
                        variant="outlined"
                        size="small"
                      />
                      <TextField
                        error={Boolean(
                          formik.touched.orgPhoneNumber &&
                            formik.errors.orgPhoneNumber
                        )}
                        fullWidth
                        helperText={
                          formik.touched.orgPhoneNumber &&
                          formik.errors.orgPhoneNumber
                        }
                        label="Organisation Phone Number"
                        margin="normal"
                        name="orgPhoneNumber"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.orgPhoneNumber}
                        variant="outlined"
                        size="small"
                      />
                      <Box mt={2}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                          Upload proof of UEN and other relevant documents
                        </Typography>
                        <div {...getRootProps({ style })}>
                          <input {...getInputProps()} />
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        </div>
                        <Box ml={3} mt={2}>
                          <aside>
                            <h4>Uploaded files</h4>
                            <ul>{acceptedFileItems}</ul>
                          </aside>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ) : (
                  <Box
                    mx="auto"
                    my={3}
                    flex={1}
                    width={'50%'}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Card sx={{ padding: 4, height: '100vh' }}>
                      <Typography variant="h6" component="div">
                        First Admin Account
                      </Typography>
                      <TextField
                        error={Boolean(
                          formik.touched.firstName && formik.errors.firstName
                        )}
                        fullWidth
                        helperText={
                          formik.touched.firstName && formik.errors.firstName
                        }
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
                        error={Boolean(
                          formik.touched.lastName && formik.errors.lastName
                        )}
                        fullWidth
                        helperText={
                          formik.touched.lastName && formik.errors.lastName
                        }
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
                        error={Boolean(
                          formik.touched.address && formik.errors.address
                        )}
                        fullWidth
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
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
                        helperText={
                          formik.touched.postalCode && formik.errors.postalCode
                        }
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
                        error={Boolean(
                          formik.touched.email && formik.errors.email
                        )}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email"
                        margin="normal"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        value={formik.values.email}
                        variant="outlined"
                        size="small"
                      />
                      <TextField
                        error={Boolean(
                          formik.touched.phoneNumber &&
                            formik.errors.phoneNumber
                        )}
                        fullWidth
                        helperText={
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                        }
                        label="Phone Number"
                        margin="normal"
                        name="phoneNumber"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.phoneNumber}
                        variant="outlined"
                        size="small"
                      />
                      <Typography variant="body1" color="red">
                        {error}
                      </Typography>
                    </Card>
                  </Box>
                )}
              </Box>
            </form>
          </React.Fragment>
        </>
      )}
    </>
  );
};
