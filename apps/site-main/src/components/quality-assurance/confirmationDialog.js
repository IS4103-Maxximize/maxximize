import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from '@mui/material';
import { Box } from '@mui/system';
  
  export const ConfirmationDialog = (props) => {
    const { open, handleClose, dialogTitle, dialogContent, dialogAction } = props;
  
    return (
      <form>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogContent}</DialogContentText>
          </DialogContent>
          <DialogActions sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{display: 'flex', gap: 2}}>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  dialogAction();
                  handleClose();
                }}
              >
                Confirm
              </Button>
              <Button color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </form>
    );
  };
  