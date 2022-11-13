import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Dialog, DialogContent, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useEffect, useState } from "react";
import { SeverityPill } from '../severity-pill';

export const ProfitItemDialog = (props) => {
  const {
    open,
    handleClose,
    profit,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;

  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const [profitAmt, setProfitAmt] = useState();
  const [revenueItems, setRevenueItems] = useState([]);
  const [costItems, setCostItems] = useState([]);
 
  useEffect(() => {
    if (open && profit) {
      const costitems = profit.costLineItems
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
      });

      setCostItems(costitems);
      setRevenueItems(profit.revenueLineItems);
      setProfitAmt(profit.profit);
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

  const revenueColumns = [
    {
      field: 'type',
      headerName: 'Type',
      flex: 2,
      renderCell: (params) => (
        <SeverityPill color="primary">
          {params.value}
        </SeverityPill>
      )
    },
    {
      field: 'paymentReceived',
      headerName: 'Date',
      flex: 3,
      valueFormatter: (params) => 
        params.value ? DayJS(params.value).format('DD MMM YYYY hh:mm a')
        : 'NA'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 2,
      valueFormatter: (params) => `$ ${params.value}`
    },
  ]

  const costColumns = [
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
          {`View Profit Item ${profit ? `(${profit.dateKey})` : ''}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box>
          <Typography variant="h6" sx={{ mb: 4 }}>{`Profit: $${profitAmt}`}</Typography>
          {revenueItems.length > 0 &&
          <>
          <Typography>Revenue Line Items</Typography>
          <DataGrid
            autoHeight
            columns={revenueColumns}
            rows={revenueItems}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
          </>}
          {costItems.length > 0 &&
          <>
          <Typography>Cost Line Items</Typography>
          <DataGrid
            autoHeight
            columns={costColumns}
            rows={costItems}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
          </>}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
