import { Alert, Snackbar } from "@mui/material";

export const NotificationAlert = (props) => {
  const {open, severity, text, handleClose} = props;

  return (
    <Snackbar 
      anchorOrigin={{ vertical:'top', horizontal:'center' }}
      open={open}
      onClose={handleClose}
    >
      <Alert severity={severity} onClose={handleClose}>
        {text}
      </Alert>
    </Snackbar>
  );
};