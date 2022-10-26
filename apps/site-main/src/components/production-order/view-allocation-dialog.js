import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DayJS from "dayjs";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useState } from "react";

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
    handleAlertClose();
    handleClose();
    setCopied(false);
  }

  const [copied, setCopied] = useState(false);

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
          // disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={() => {
                    const batchNumber = schedule.completedGoods?.batchNumber
                    if (batchNumber) {
                      navigator.clipboard.writeText(batchNumber).then(() => {
                        setCopied(true);
                        handleAlertOpen('Copied Batch Number!', 'success')
                      })
                    } else {
                      handleAlertOpen('Failed to copy Batch Number', 'error');
                    }
                  }}
                >
                  {!copied && <ContentCopyIcon />}
                  {copied && <DoneAllIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
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
