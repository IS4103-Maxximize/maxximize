import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, TextField, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { apiHost, requestOptionsHelper } from '../../helpers/constants';

export const UpdateCreditDialog = (props) => {
  const {
    open,
    handleClose,
    retailer,
    creditRequired,
    handleAlertOpen,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const onClose = () => {
    handleClose();
  }

  const [minimum, setMinimum] = useState(0);

  useEffect(() => {
    if (open) {
      setMinimum((retailer && creditRequired) ? retailer.creditLimit + creditRequired : 0)
    }
  }, [open])

  const updateRetailer = async () => {
    const url = `${apiHost}/shell-organisations/${retailer.id}`;
    const body = JSON.stringify({
      creditLimit: formik.values.newCreditLimit
    })
    const requestOptions = requestOptionsHelper('PATCH', body);

    await fetch(url, requestOptions)
      .then(res => res.json())
      .then(result => {
        handleAlertOpen('Successfully updated Retailer Credit Limit!', 'success');
        onClose();
      })
      .catch(err => handleAlertOpen('Failed to Retailer Credit Limit', 'error'))
  }

  const formik = useFormik({
    initialValues: {
      newCreditLimit: minimum,
    },
    validationSchema: Yup.object({
      newCreditLimit: Yup
        .number()
        .min(minimum, `New Credit Limit must be higher than ${minimum}`)
        .required('New Credit Limit is required')
    }),
    enableReinitialize: true,
    onSubmit: updateRetailer
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Dialog 
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
    >
      {fullScreen && <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          {`Update Retailer Credit Limit`}
          </Typography>
          <Button
            variant="contained"
            disabled={
              formik.isSubmitting || !formik.isValid
            }
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
        </Toolbar>
      </AppBar>}
      {!fullScreen && 
      <>
        <DialogTitle>
          {`Update Retailer Credit Limit`}
        </DialogTitle>
        <Divider />
      </>}
      <DialogContent>
        <TextField
          fullWidth
          error={Boolean(formik.touched.newCreditLimit && formik.errors.newCreditLimit)}
          helperText={formik.touched.newCreditLimit && formik.errors.newCreditLimit}
          label="New Credit Limit"
          margin="normal"
          name="newCreditLimit"
          type="number"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.newCreditLimit}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            )
          }}
        />
      </DialogContent>
      {!fullScreen && 
      <DialogActions>
        <Button onClick={onClose}>Back</Button>
        <Button
          variant="contained"
          disabled={
            formik.isSubmitting || !formik.isValid
          }
          onClick={formik.handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>}
    </Dialog>
  );
};
