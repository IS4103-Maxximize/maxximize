import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";


export const FinalGoodsAllocationDialog = (props) => {
  const {
    open,
    handleClose,
    // string,
    productionOrder,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const handleOnSubmit = async (values) => {
    // submit
    // console.log(values);

    // - name
    // - description
    // - productionCostPerLot (Only edited when no planned or ongoing schedules)
    // - gracePeriod (Only edited when no planned or ongoing schedules)
    // - outputPerHour (Only edited when no planned or ongoing schedules)
    // - startTime (Only edited when no planned or ongoing schedules)
    // - endTime (Only edited when no planned or ongoing schedules)

    // const updateProductionLineDto = {
    //   name: values.name,
    //   description: values.description,
    //   productionCostPerLot: values.productionCostPerLot,
    //   gracePeriod: 3600000 * values.hours + 60000 * values.minutes + 1000 * values.seconds,
    //   outputPerHour: values.outputPerHour,
    //   startTime: values.startTime,
    //   endTime: values.endTime,
    //   machineIds: selectedMachines.map(machine => machine.id)
    // }

    // console.log(updateProductionLineDto);

    // updateProductionLine(productionLine.id, updateProductionLineDto)
    //   .then(res => {
		// handleRowUpdate(res)
    //     onClose();
    //     handleAlertOpen(`Successfully Updated Production Line ${res.id}!`, 'success');
    //   })
    //   .catch(err => handleAlertOpen('Failed to Update Production Line', 'error'));
  };

  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validationSchema: Yup.object({
      quantity: Yup
        .number()
        .min(1, 'Quantity must be more than 0')
        .integer('Quantity must be an integer')
        .required('Enter Quantity of Final Goods to allocate')
    }),
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  // const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  // const checkedIcon = <CheckBoxIcon fontSize="small" />;

  // const disabled = productionLine ? productionLine.schedules.find(schedule => schedule.status === 'ongoing' || schedule.status === 'planned') : false;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog 
        fullWidth
        open={open} 
        onClose={onClose}
      >
        <DialogTitle>
          {`Allocate and Receive Final Goods`}
        </DialogTitle>
        <DialogContent>
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
