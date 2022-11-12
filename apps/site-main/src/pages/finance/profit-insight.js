import { DataTableCell, Table, TableBody, TableCell, TableHeader } from '@david.kucsai/react-pdf-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ListIcon from '@mui/icons-material/List';
import {
  Box, Button, Container, Dialog, DialogContent, Grid,
  IconButton,
  Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../../components/dashboard-layout';
import { FilterCard } from '../../components/finance/filter-card';
import { NotificationAlert } from '../../components/notification-alert';
import { apiHost, requestOptionsHelper } from '../../helpers/constants';


export const ProfitInsight = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;

  const [loading, setLoading] = useState(true); // loading upon entering page

  // Alert Helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error'); // success || error
  const [alertText, setAlertText] = useState('');
  const handleAlertOpen = (text, severity) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Profit Helpers
  const [profit, setProfit] = useState([]);
  const [profitRange, setProfitRange] = useState(false);
  const [profitType, setProfitType] = useState('month');
  const [inProfitDate, setInProfitDate] = useState(new Date());
  const [fromProfitDate, setFromProfitDate] = useState(DayJS(new Date()).subtract(1, 'year'));
  const [toProfitDate, setToProfitDate] = useState(new Date());

  const toggleProfitRange = () => {
    setProfitRange(!profitRange);
  }

  const handleProfitType = (event, newType) => {
    if (newType !== null) {
      setProfitType(newType);
    }
  }

  const resetProfitDates = () => {
    handleOpenExportClose();
    setInProfitDate(new Date());
    setFromProfitDate(DayJS(new Date()).subtract(1, 'year'));
    setToProfitDate(new Date());
  }

  useEffect(() => {
    resetProfitDates();
  }, [profitRange, profitType]) 

  const getProfit = async () => {
    const url = `${apiHost}/profit`;
    const body = JSON.stringify({
      inDate: inProfitDate,
      start: fromProfitDate,
      end: toProfitDate,
      range: profitRange,
      type: profitType,
      organisationId: organisationId
    });
    const requestOptions = requestOptionsHelper('POST', body);

    await fetch(url, requestOptions).then(res => res.json())
      .then(result => {
        const mapped = result
          .map((item, index) => {return { id: index, ...item }})
          .reverse(); // TBD
        setProfit(mapped);
        handleAlertOpen('Profit Insight loaded!', 'success');
      })
      .catch(err => handleAlertOpen('Failed to load Profit Insight', 'error'));
  }

  // DataGrid Columns
  const columns = [
    {
      field: 'dateKey',
      headerName: 'Time',
      flex: 2,
    },
    {
      field: 'profit',
      headerName: 'Profit',
      flex: 2,
      valueFormatter: (params) => 
        `$ ${params.value ? params.value : 0}`
    },
    {
      field: 'breakdown',
      headerName: 'Breakdown',
      flex: 1,
      renderCell: (params) => (
        (params.row?.revenueLineItems?.length > 0 || params.row?.costLineItems?.length > 0) ?
        <IconButton>
          <ListIcon />
        </IconButton>
        : null
      )
    },
  ];

  const [openExport, setOpenExport] = useState(false);
  const handleOpenExportOpen = () => {
    setOpenExport(true);
  }
  const handleOpenExportClose = () => {
    setOpenExport(false);
  }
  const toggleExport = () => {
    setOpenExport(!openExport);
  }

  const ExportProfitButton = (props) => {
    return (
      profit.length > 0 && 
      <Button
        variant="contained"
        color="primary"
        endIcon={<FileDownloadIcon />}
        onClick={handleOpenExportOpen}
      >
        Export
      </Button>
    );
  };

  const formatDate = (date) => {
    return DayJS(date).format('DD MMM YYYY hh:mm a');
  }

  const styles = StyleSheet.create({
    page: { margin: 10 },
    tableHeader: { marginLeft: 10 },
    table: { margin: 10 },
    entry: { marginBottom: 15 },
    entryTitle: { marginBottom: 5 },
  })

  const ProfitDocument = (props) => {
    const { profit, ...rest } = props;

    return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.entry}>
          <Text>{`PROFIT INSIGHT REPORT - (${profitType === 'month' ? 'Monthly' : 'Yearly'})`}</Text>
          <Text>{`Generated: ${formatDate(new Date())}`}</Text>
        </View>
        {profit.map((item, index) => 
          {
            const rev = item.revenueLineItems.length > 0;
            const cost = item.costLineItems.length > 0;
            return (
              <View key={item.dateKey} style={styles.entry}>
                <Text style={styles.entryTitle}>{`${item.dateKey} - $${item.profit}`}</Text>
                {rev && 
                <View key={`revenueLineItems_${index}`} style={styles.tableHeader}>
                  <Text>Revenue Items</Text>
                  {/* <View style={styles.table}> */}
                    <Table
                      data={item.revenueLineItems}
                      style={styles.table}
                    >
                      <TableHeader>
                        <TableCell>
                          Date
                        </TableCell>
                        <TableCell>
                          Item Type
                        </TableCell>
                        <TableCell>
                          Amount ($)
                        </TableCell>  
                      </TableHeader>
                      <TableBody>
                        <DataTableCell getContent={(r) => formatDate(r.paymentReceived)}/>
                        <DataTableCell getContent={(r) => r.type}/>
                        <DataTableCell getContent={(r) => r.amount}/>
                      </TableBody>
                    </Table>
                  {/* </View> */}
                </View>}
                {cost && 
                <View key={`costLineItems_${index}`} style={styles.tableHeader}>
                  <Text>Cost Items</Text>
                  {/* <View style={styles.table}> */}
                    <Table
                      data={item.costLineItems}
                      style={styles.table}
                    >
                      <TableHeader>
                        <TableCell>
                          Date
                        </TableCell>
                        <TableCell>
                          Item Type
                        </TableCell>
                        <TableCell>
                          Amount ($)
                        </TableCell>
                      </TableHeader>
                      <TableBody>
                        <DataTableCell getContent={(r) => {
                          const type = r.type;
                          if (type === 'invoice') {
                            return formatDate(r.paymentReceived);
                          }
                          if (type === 'maxximizeInvoice') {
                            return formatDate(r.created);
                          }
                          if (type === 'schedule') {
                            return formatDate(r.end);
                          }
                          return ''
                        }}/>
                        <DataTableCell getContent={(r) => r.type}/>
                        <DataTableCell getContent={(r) => r.costAmount}/>
                      </TableBody>
                    </Table>
                  {/* </View> */}
                </View>}
              </View>)
          }
        )}
      </Page>
    </Document>
  )}

  const handleSearch = () => {
    handleOpenExportClose();
    getProfit();
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Profits
            {user && ` | ${user?.organisation?.name}`}
          </title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <NotificationAlert
            key="notification-alert"
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />

          {/* Profit Toolbar with FilterCard */}
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
            <Typography sx={{ m: 1 }} variant="h4">
              Profit Insight
            </Typography>
            </Grid>
            <Grid item md={9} xs={12}>
              <FilterCard
                title="Profit Filter"
                range={profitRange}
                toggleRange={toggleProfitRange}
                inDate={inProfitDate}
                setIn={setInProfitDate}
                from={fromProfitDate}
                to={toProfitDate}
                setFrom={setFromProfitDate}
                setTo={setToProfitDate}
                type={profitType}
                handleType={handleProfitType}
                reset={resetProfitDates}
                handleSearch={handleSearch}
                actionButton={<ExportProfitButton />}
              />
            </Grid>
          </Grid>
          {/* End of Profit Toolbar */}

          {/* <InvoiceMenu
            key="invoice-menu"
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleClickOpen={handleInvoiceDialogOpen}
            handleMenuClose={handleMenuClose}
          /> */}
          {/* <InvoiceDialog
            open={invoiceDialogOpen}
            handleClose={handleInvoiceDialogClose}
            invoice={selectedRow}
            handleAlertOpen={handleAlertOpen}
            handleAlertClose={handleAlertClose}
          /> */}
          <Box
            sx={{
              mt: 3,
            }}
          >
            <Dialog
              open={openExport}
              fullWidth
              maxWidth="md"
              onClose={handleOpenExportClose}
            >
              <DialogContent>
                {/* <Box
                  sx={{
                    display: 'flex'
                  }}
                > */}
                  <PDFViewer
                    width='100%'
                    height={700}
                  >
                    <ProfitDocument 
                      profit={profit}
                    />
                  </PDFViewer>
                {/* </Box> */}
              </DialogContent>
            </Dialog>
            <DataGrid
              autoHeight
              rows={profit}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

ProfitInsight.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProfitInsight;
