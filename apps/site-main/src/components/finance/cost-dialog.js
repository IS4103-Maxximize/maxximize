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
    cost,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (open && cost) {
      const lineItems = cost.lineItems
        .map((item) => {
          // add common date attribute to show in DataGrid
          if (item.type === 'invoice') {
            return { ...item, date: item.paymentReceived };
          }
          if (item.type === 'maxximizeInvoice') {
            return { ...item, type: "maxximize", date: item.created };
          }
          if (item.type === 'schedule') {
            return { ...item, type: 'production', date: item.end };
          }
          return item;
        })
      setRows(lineItems)
    }
  }, [open])


  const onClose = () => {
    handleClose();
    setCopied(false);
  }

  const [copied, setCopied] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const costTypeColorMap = {
    invoice: 'primary',
    maxximize: 'secondary',
    production: 'warning',
    // more in future
  }

  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      flex: 2,
      renderCell: (params) => (
        <SeverityPill color={costTypeColorMap[params.value]}>
          {params.value}
        </SeverityPill>
      )
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 3,
      valueFormatter: (params) => 
        params.value ? DayJS(params.value).format('DD MMM YYYY hh:mm a')
        : 'NA'
    },
    {
      field: 'costAmount',
      headerName: 'Amount',
      flex: 2,
      valueFormatter: (params) => `$ ${params.value}`
    },
  ]

  return (
    <Dialog
      maxWidth="md"
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
          {`View Cost Item ${cost ? `(${cost.dateKey})` : ''}`}
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
