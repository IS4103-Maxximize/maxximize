import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Dialog, DialogContent, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useState, useEffect } from "react";
import { SeverityPill } from '../severity-pill';

export const CostDialog = (props) => {
  const {
    open,
    handleClose,
    revenue,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (open && revenue) {
      setRows(revenue.lineItems.sort(
        (a, b) => DayJS(a.paymentReceived) - DayJS(b.paymentReceived)))
    }
  }, [open])


  const onClose = () => {
    handleClose();
    setCopied(false);
  }

  const [copied, setCopied] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const revenueTypeColorMap = {
    invoice: 'primary',
    // more choices
  }

  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      flex: 2,
      renderCell: (params) => (
        <SeverityPill color={revenueTypeColorMap[params.value]}>
          {params.value}
        </SeverityPill>
      )
    },
    {
      field: 'paymentReceived',
      headerName: 'Payment Received Date',
      flex: 3,
      valueFormatter: (params) => DayJS(params.value).format('DD MMM YYYY hh:mm a')
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 2,
      valueFormatter: (params) => `$ ${params.value}`
    },
  ]

  return (
    <Dialog
      fullWidth
      // fullScreen={fullScreen}
      open={open}
      onClose={onClose}
    >
      <AppBar sx={{ position: 'relative' }}>
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
          {`View Revenue Item ${revenue ? `(${revenue.dateKey})` : ''}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <DataGrid
          autoHeight
          columns={columns}
          rows={rows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </DialogContent>
    </Dialog>
  );
};
