import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { SubscriptionInvoiceDialog } from './subscription-invoice-dialog';

export const SubscriptionDialog = (props) => {
  const { open, handleClose, organisation } = props;

  const [error, setError] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  // Retrieve all subscriptions invoices
  const retrieveAllSubscriptions = async () => {
    if (organisation.membership) {
      const response = await fetch(
        `http://localhost:3000/api/memberships/stripe/subscriptions/customers/${organisation?.membership?.customerId}`
      );
      let result = [];

      if (response.status == 200 || response.status == 201) {
        result = await response.json();
      }

      setSubscriptions(result);
    }
  };

  const [invoices, setInvoices] = useState([]);

  // Retrieve all subscriptions invoices
  const retrieveAllInvoiceOfSubscriptions = async () => {
    const response = await fetch(
      `http://localhost:3000/api/memberships/stripe/invoices/subscriptions/${selectedRow?.id}`
    );
    let result = [];

    if (response.status == 200 || response.status == 201) {
      result = await response.json();
    }

    setInvoices(result);
  };

  useEffect(() => {
    retrieveAllInvoiceOfSubscriptions();
  }, [selectedRow]);

  useEffect(() => {
    if (organisation) {
      retrieveAllSubscriptions();
    }
  }, [open]);

  // Dialog helpers
  const [subscriptionInvoicesDialogOpen, setSubscriptionInvoicesDialogOpen] =
    useState(false);

  const handleClickOpen = () => {
    setSubscriptionInvoicesDialogOpen(true);
  };

  const handleClickClose = () => {
    setSubscriptionInvoicesDialogOpen(false);
  };

  // Action button
  const actionButton = (params) => {
    return (
      <IconButton
        onClick={(event) => {
          setSelectedRow(params.row);
          handleClickOpen();
        }}
      >
        <ViewListOutlinedIcon color="primary" />
      </IconButton>
    );
  };

  // Close dialog
  const onClose = () => {
    handleClose();
    setError('');
  };

  // Columns for subscription datagrid
  const subscriptionColumns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 3,
    },
    {
      field: 'plan',
      headerName: 'Plan',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.plan : '';
      },
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.created : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'currentPeriodStart',
      headerName: 'Current Period Start',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.currentPeriodStart : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'currentPeriodEnd',
      headerName: 'Current Period End',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.currentPeriodEnd : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'endedAt',
      headerName: 'Ended At',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.endedAt : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a') === 'Invalid Date'
          ? 'NA'
          : DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.status : '';
      },
      valueFormatter: (params) => {
        const valueFormatted =
          params.value[0].toUpperCase() + params.value.slice(1);
        return `${valueFormatted}`;
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: actionButton,
    },
  ];

  return (
    <>
      <SubscriptionInvoiceDialog
        open={subscriptionInvoicesDialogOpen}
        handleClose={handleClickClose}
        subscription={selectedRow}
        invoices={invoices}
      />
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar color="success" sx={{ position: 'relative' }}>
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
              Subscriptions
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box display="flex" justifyContent={'flex-end'}>
            <Typography variant="caption" color="red">
              {error}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="h6">Subscriptions</Typography>
            <DataGrid
              autoHeight
              rows={subscriptions}
              columns={subscriptionColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // onSelectionModelChange={(ids) => setSelectedRows(ids)}
              // processRowUpdate={handleRowUpdate}
              disableSelectionOnClick
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
