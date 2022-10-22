import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DayJS from "dayjs";

export const ViewAllocationDialog = (props) => {
  const {
    open,
    handleClose,
    schedule,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const onClose = () => {
    // formik.resetForm();
    handleClose();
  }

  const columns = [
    {
      field: 'code',
      headerName: 'Batch Item Code',
      flex: 3,
      valueGetter: (params) => {
        return params.value === '' ? 'STAGING' : params.value;
      }
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry',
      flex: 2,
      valueFormatter: (params) => {
        return DayJS(params.value).format('DD MMM YYYY');
      }
    },
  ]

  return (
    <Dialog 
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {`View Allocated Goods for Schedule (${schedule ? schedule.id : ''})`}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Batch Number"
          margin="normal"
          name="batch-number"
          value={schedule ? schedule.completedGoods?.batchNumber : ''}
          variant="outlined"
          disabled
        />
        <DataGrid
          autoHeight
          rows={schedule ? schedule.completedGoods?.batchLineItems : []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Back</Button>
      </DialogActions>
    </Dialog>
  );
};
