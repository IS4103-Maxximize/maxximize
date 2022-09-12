import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const options = [
  'draft',
  'pending',
]

export const SalesInquiryDialog = (props) => {
  const {
    action, // POST || PATCH
    open,
    handleClose,
    string,
    inquiry,
    addInquiry,
    updateInquiry
  } = props;

  let initialValues = {
    id: inquiry ? inquiry.id : null,
    status: inquiry ? inquiry.status : 'draft',
  }
  let schema = {
    status: Yup
      .string()
      .required('Inquiry status is required'),
  }

  const handleOnSubmit = async (values) => {
    if (action === 'POST') {
      // create
    } else if (action === 'PATCH') {
      // update
    }
    onClose();
  }

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object(schema),
    onSubmit: handleOnSubmit
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        fullWidth
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          {action === 'POST' && 'Add '}
          {action === 'PATCH' && 'Edit '}
          {string}
        </DialogTitle>
        <DialogContent>
          {inquiry && <TextField
            error={Boolean(formik.touched.id && formik.errors.id)}
            fullWidth
            helperText={formik.touched.id && formik.errors.id}
            label="Sales Inquiry ID"
            margin="normal"
            name="id"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.id}
            variant="outlined"
            disabled
          />}
          <TextField
            error={Boolean(formik.touched.status && formik.errors.status)}
            fullWidth
            helperText={formik.touched.status && formik.errors.status}
            label="Status"
            margin="normal"
            name="status"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.status}
            variant="outlined"
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button 
            disabled={!formik.isValid || formik.isSubmitting}
            variant="contained"
            onClick={formik.handleSubmit}>
            Submit
          </Button>
          <Button 
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}