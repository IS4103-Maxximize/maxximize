import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { allocateSchedule } from "../../helpers/production/production-order";


export const FinalGoodsAllocationDialog = (props) => {
  const {
    open,
    handleClose,
    productionOrder,
    schedule,
    handleAlertOpen,
    handleAlertClose,
    updateSchedules,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const handleOnSubmit = async (values) => {
    // submit
    // console.log(values);

    // orgId: number;
    // scheduleId: number;
    // quantity: number;
    // volumetricSpace: number

    const allocateScheduleDto = {
      orgId: organisationId,
      scheduleId: schedule?.id,
      quantity: formik.values.quantity,
      volumetricSpace: formik.values.volumetricSpace
    }

    console.log(allocateScheduleDto);

    allocateSchedule(allocateScheduleDto)
      .then(res => {
        console.log(res);
        updateSchedules(res);
        onClose();
        handleAlertOpen(`Successfully allocated goods for Schedule ${res.id}!`, 'success');
      })
      .catch(err => handleAlertOpen(`Failed to allocate goods`, 'error'));
  };

  const formik = useFormik({
    initialValues: {
      quantity: 1,
      volumetricSpace: 1,
    },
    validationSchema: Yup.object({
      quantity: Yup
        .number()
        .min(1, 'Quantity must be more than 0')
        .integer('Quantity must be an integer')
        .required('Enter Quantity of Final Goods to allocate'),
      volumetricSpace: Yup
        .number()
        .min(1, 'Volumetric Space must be more than 0')
        .integer('Volumetric Space must be an integer')
        .required('Enter Volumetric Space of Final Goods to allocate'),
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
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
          {`Allocate Final Goods for Schedule (${schedule?.id})`}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Planned Production Quantity"
            margin="normal"
            name="planned-prod-quantity"
            type="number"
            value={
              productionOrder?.plannedQuantity * productionOrder?.bom?.finalGood?.lotQuantity
            }
            variant="outlined"
            InputProps={{ 
              inputProps: { min: 1 },
              endAdornment: (
                <InputAdornment position="end">
                  {productionOrder?.bom?.finalGood?.unit}
                </InputAdornment>
              )
            }}
            disabled
          />
          <TextField
            fullWidth
            error={Boolean(formik.touched.quantity && formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
            label="Quantity to Receive"
            margin="normal"
            name="quantity"
            type="number"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.quantity}
            variant="outlined"
            InputProps={{ 
              inputProps: { min: 1 },
              endAdornment: (
                <InputAdornment position="end">
                  {productionOrder?.bom?.finalGood?.unit}
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            error={Boolean(formik.touched.volumetricSpace && formik.errors.volumetricSpace)}
            helperText={formik.touched.volumetricSpace && formik.errors.volumetricSpace}
            label="Volumetric Space"
            margin="normal"
            name="volumetricSpace"
            type="number"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.volumetricSpace}
            variant="outlined"
            InputProps={{ inputProps: { min: 1 }}}
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
