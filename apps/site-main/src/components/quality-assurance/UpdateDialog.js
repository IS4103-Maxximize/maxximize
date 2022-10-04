import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    useTheme,
    Box,
    Typography,
    Autocomplete,
  } from '@mui/material';
  import useMediaQuery from '@mui/material/useMediaQuery';
  import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
  import * as Yup from 'yup';

export const UpdateDialog = ({
    openUpdateDialog,
    setOpenUpdateDialog,
    updateRules,
    rowToEdit,
    ruleCategoryOptions
  }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [error, setError] = useState('')
    useEffect(() => {
        const retrieveItem = async() => {
            const response = await fetch(`http://localhost:3000/api/qa-rules/${rowToEdit.id}`)
            const result = await response.json()
            formik.setFieldValue('title', result.title)
            formik.setFieldValue('description', result.description)
            formik.setFieldValue('category', ruleCategoryOptions.find(option => option.value === result.category))
        }
        retrieveItem()
    }, [rowToEdit])
    const handleDialogClose = () => {
      setOpenUpdateDialog(false);
      formik.resetForm();
    };

    const user = JSON.parse(localStorage.getItem('user'));
    const orgId = user?.organisation.id

    const handleOnSubmit = async () => {

        const response = await fetch(`http://localhost:3000/api/qa-rules/${rowToEdit.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formik.values.title,
          description: formik.values.description,
          category: formik.values.category.value
        }),
      });
        if (response.status === 200 || response.status === 201) {
          const result = await response.json();
  
          updateRules(result);
          setError('')
          handleDialogClose();
        } else {
          const result = await response.json()
          setError(result.message)
        }
        
    
      
  };
  
    const formik = useFormik({
      initialValues: {
        title: '',
        description: '',
        category: {label: 'PACKAGING', value: 'packaging'},
        error: ''
      },
      validationSchema: Yup.object({
        title: Yup.string()
        .min(1, 'Title must be at least be 1 character long')
        .max(50, 'Title can at most be 50 characters long')
        .required('Title is required'),
        description: Yup.string().required('Description is required'),
        category: Yup.object().required('Category is required').nullable()

      }),
      onSubmit: handleOnSubmit
    });
    
    return (
      <Dialog
        fullScreen={fullScreen}
        open={openUpdateDialog}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
            Update rule
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
          <TextField
            error={Boolean(formik.touched.title && formik.errors.title)}
            fullWidth
            helperText={formik.touched.title && formik.errors.title}
            label="Title"
            margin="normal"
            name="title"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.title}
            variant="outlined"
            sx={{mb: 1}}
          />

        <TextField
            error={Boolean(formik.touched.description && formik.errors.description)}
            fullWidth
            helperText={formik.touched.description && formik.errors.description}
            multiline
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outlined"
            rows={4}
            sx={{mb: 3}}
          />
        <Autocomplete disablePortal 
        options={ruleCategoryOptions}
        renderInput={(params) => 
        <TextField
        {...params}
        label="Category"
        error={Boolean(formik.touched.category && formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
        fullWidth
        name="category"
        />}
        onChange={(e, value) => {
            formik.setFieldValue('category', value)
        }}
        // onOpen={formik.handleBlur}
        sx={{mb:3}}
        value={formik.values.category}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        >

        </Autocomplete>
          
        <Typography variant="caption" color="red">
            {error}
        </Typography>

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
                size="medium"
                type="submit"
                variant="contained"
              >
                Update
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  