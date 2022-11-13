import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { NotificationAlert } from './notification-alert';

export const Profile = () => {
  //User organisation Id
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [organisation, setOrganisation] = useState('');

  // Get the organisation
  const retrieveOrganisation = async () => {
    const res = await fetch(
      `http://localhost:3000/api/organisations/${organisationId}`
    );

    if (res.status === 201 || res.status === 200) {
      const result = await res.json();
      console.log('retrieve organisation');
      setOrganisation(result);
    } else {
      handleAlertOpen('Error retrieving organisation', 'error');
    }
  };

  useEffect(() => {
    retrieveOrganisation();
    console.log(formik.values.profileImage);
  }, []);

  useEffect(() => {
    if (organisation) {
      formik.setFieldValue('orgDescription', organisation.description);
      if (organisation.documents.length !== 0) {
        console.log(
          organisation.documents.filter(
            (document) => document.businessType === 'organisationImage'
          )[0].name
        );
        formik.setFieldValue(
          'profileImage',
          'uploads/' +
            organisation.documents.filter(
              (document) => document.businessType === 'organisationImage'
            )[0].name
        );
      }
    }
  }, [organisation]);

  //Handle Profile Update
  const handleUpdate = async () => {
    console.log('Update org');
    const response = await fetch(
      `http://localhost:3000/api/organisations/${organisationId}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formik.values.orgDescription,
        }),
      }
    );

    console.log(temporaryFiles);

    const formdata = new FormData();
    temporaryFiles.map((file) => {
      console.log(file);
      formdata.append('files', file, file.name);
    });

    console.log(formdata.entries());

    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    const response2 = await fetch(
      `http://localhost:3000/api/files/upload?type=organisationImage&organisationId=${organisationId}`,
      requestOptions
    );

    if (response2.status === 200 || response2.status === 201) {
      const result = await response.json();

      handleAlertOpen('Updated organisation successfully', 'success');
    } else {
      const result = await response.json();
      handleAlertOpen(
        `Error updating organisation profile ${result.message}`,
        'error'
      );
    }
  };

  // NotificationAlert helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState();
  const [alertSeverity, setAlertSeverity] = useState('success');
  const handleAlertOpen = (text, severity) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertText(null);
    setAlertSeverity('');
  };

  const formik = useFormik({
    initialValues: {
      orgDescription: '',
      profileImage: '../assets/images/default-avatar.png',
    },
    enableReinitialize: true,
    onSubmit: handleUpdate,
  });

  useEffect(
    () => console.log(formik.values.profileImage),
    [formik.values.profileImage]
  );

  const [temporaryFiles, setTemporaryFiles] = useState([]);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      setTemporaryFiles(acceptedFiles);
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

  const style = useMemo(
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
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <Box>
        <Card>
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  m: -1,
                }}
              >
                <img src={''} />
                <TextField
                  error={Boolean(
                    formik.touched.orgDescription &&
                      formik.errors.orgDescription
                  )}
                  fullWidth
                  helperText={
                    formik.touched.orgDescription &&
                    formik.errors.orgDescription
                  }
                  label="Organisation Description"
                  margin="normal"
                  name="orgDescription"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.orgDescription}
                  variant="outlined"
                  size="small"
                />
                <Box mt={2}>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Upload new profile image
                  </Typography>
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop image here, or click to select image</p>
                  </div>
                  <Box ml={3} mt={2}>
                    <aside>
                      <h4>Uploaded image</h4>
                      <ul>{acceptedFileItems}</ul>
                    </aside>
                  </Box>
                </Box>
                <Box width="100%" display="flex" justifyContent="flex-end">
                  <Button
                    disabled={formik.isSubmitting}
                    variant="contained"
                    type="submit"
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
