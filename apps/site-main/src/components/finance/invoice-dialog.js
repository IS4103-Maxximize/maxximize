import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { AppBar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, InputAdornment, Stack, TextField, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import DayJS from "dayjs";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { apiHost, invoiceStatusColorMap, requestOptionsHelper } from '../../helpers/constants';
import { SeverityPill } from '../severity-pill';

export const InvoiceDialog = (props) => {
  const {
    open,
    handleClose,
    invoice,
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

  const formik = useFormik({
    initialValues: {
      type: invoice?.type,
      id: invoice?.id,
      date: invoice ? invoice.date : new Date(),
      paymentReceived: invoice ? invoice.paymentReceived : new Date(),
      amount: invoice?.amount,
      status: invoice ? invoice.status : 'closed',
      po: invoice?.po,
      accountInfo: invoice?.po?.supplier?.accountInfo
    },
    validationSchema: Yup.object(),
    enableReinitialize: true,
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const [confirm, setConfirm] = useState(false);

  const updateInvoice = async (newStatus) => {
    const url = `${apiHost}/invoices/${invoice.id}`;
    const body = JSON.stringify({
      status: newStatus
    })
    const requestOptions = requestOptionsHelper('PATCH', body);

    await fetch(url, requestOptions)
      .then(res => res.json())
      .then(result => {
        if (result.status !== formik.values.status) { // successful update
          formik.setFieldValue('status', result.status)
          handleAlertOpen('Successfully updated Invoice status!', 'success');
        }
      })
      .catch(err => handleAlertOpen('Failed to update Invoice status', 'error'))
  }

  return (
    <Dialog 
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
    >
      {fullScreen && <AppBar sx={{ position: 'relative' }}>
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
          {`View Invoice (${invoice ? invoice.id : ''})`}
          </Typography>
        </Toolbar>
      </AppBar>}
      {!fullScreen && 
      <>
        <DialogTitle>
          {`View Invoice (${invoice ? invoice.id : ''})`}
        </DialogTitle>
        <Divider />
      </>}
      <DialogContent>
        <Grid container spacing={2}>
          {(formik.values.type === 'incoming' && formik.values.accountInfo) && 
          <>
            <Grid item md={12} xs={12}>
              <Typography>Supplier Account Info</Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                sx={{ mb: -1 }}
                fullWidth
                label="Bank Code"
                margin="normal"
                name="bankCode"
                value={formik.values.accountInfo?.bankCode}
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                sx={{ mb: -1 }}
                fullWidth
                label="Bank Name"
                margin="normal"
                name="bankName"
                value={formik.values.accountInfo?.bankName}
                disabled
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Acc. Number"
                margin="normal"
                name="accountNumber"
                value={formik.values.accountInfo?.accountNumber}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          const accountNumber = formik.values.accountInfo?.accountNumber
                          if (accountNumber) {
                            navigator.clipboard.writeText(accountNumber).then(() => {
                              setCopied(true);
                              handleAlertOpen('Copied Account Number!', 'success')
                            })
                          } else {
                            handleAlertOpen('Failed to copy Account Number', 'error');
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
            </Grid>
          </>}
          <Grid item md={12} xs={12}>
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="baseline"
            >
              <Typography>Invoice Info</Typography>
              <SeverityPill color={invoiceStatusColorMap[formik.values.status]}>
                {formik.values.status}
              </SeverityPill>
            </Stack>
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              sx={{ mb: -1 }}
              fullWidth
              label="Date"
              margin="normal"
              name="date"
              value={DayJS(formik.values.date).format('DD MMM YYYY hh:mm a')}
              disabled
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              sx={{ mb: -1 }}
              fullWidth
              label="Amount"
              margin="normal"
              name="amount"
              value={formik.values.amount}
              disabled
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                  $
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          {formik.values.paymentReceived && 
          <Grid item md={6} xs={12}>
            <TextField
              sx={{ mb: -1 }}
              fullWidth
              label="Payment Received"
              margin="normal"
              name="paymentReceived"
              value={DayJS(formik.values.paymentReceived).format('DD MMM YYYY hh:mm a')}
              disabled
            />
          </Grid>}
          {(formik.values.type === 'incoming' && formik.values.status === 'pending') && 
          <Grid item md={12} xs={12}>
            <Box
              sx={{
                mt: 1,
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox 
                  defaultChecked={false}
                  onChange={() => setConfirm(!confirm)}
                />
                <Typography>Update Status to 'Paid'</Typography>
              </Stack>
              <Button
                sx={{ ml: 4 }}
                size="small"
                variant="contained"
                disabled={!confirm}
                onClick={() => updateInvoice('paid')}
              >
                Update
              </Button>
            </Box>
          </Grid>}
          {(formik.values.type === 'sent' && formik.values.status === 'paid') && 
          <Grid item md={12} xs={12}>
            <Box
              sx={{
                mt: 1,
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox 
                  defaultChecked={false}
                  onChange={() => setConfirm(!confirm)}
                />
                <Typography>Close Invoice</Typography>
              </Stack>
              <Button
                sx={{ ml: 4 }}
                size="small"
                variant="contained"
                disabled={!confirm}
                onClick={() => updateInvoice('closed')}
              >
                Close
              </Button>
            </Box>
          </Grid>}
        </Grid>
      </DialogContent>
      {!fullScreen && <DialogActions>
        <Button onClick={onClose}>Back</Button>
      </DialogActions>}
    </Dialog>
  );
};
