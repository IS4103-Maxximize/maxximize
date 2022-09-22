import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle
  } from "@mui/material";
  
  
  export const ConfirmDialog = (props) => {
    const {
      open, 
      handleClose, 
      dialogTitle, 
      dialogContent,
      dialogAction,
    } = props;
  
    return (
      <form>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {dialogContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
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
            <Button 
              color="primary" 
              onClick={handleClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    )
  }