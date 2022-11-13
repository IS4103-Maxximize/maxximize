import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { isSameDateError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation';
import { Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NotificationAlert } from '../../components/notification-alert';
import { DemandForecastToolbar } from '../../components/procurement-ordering/demand-forecast-toolbar';

const ProcurementForecast = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Demand Forecast';

  const [data, setData] = useState([]);
  const [finalGoods, setFinalGoods] = useState([]);
  const [selectedFinalGood, setSelectedFinalGood] = useState('');
  const [period, setPeriod] = useState('');
  const [actualPeriod, setActualPeriod] = useState('');
  const [loading, setLoading] = useState(false);
  const [seasonality, setSeasonality] = useState(true);

  const API_URL = 'http://localhost:3000/api/final-goods/demand-forecast/';

  // Fetch demand forecast data
  const handleSubmit = async () => {
    setLoading(true);
    setActualPeriod(period);
    const response = await fetch(
      `${API_URL}${organisationId}/${selectedFinalGood.id}/${period}/${seasonality}`
    );
    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      setData(result);
      setLoading(false);
    } else if (response.status === 500) {
      const result = await response.json();
      handleAlertOpen(`Error encountered: ${result.message}`, 'error');
      setLoading(false);
    }
  };

  // Toggle switch for seasonality
  const handleToggle = () => {
    setSeasonality(!seasonality);
  };

  useEffect(() => {
    if (loading === true) {
      setData([]);
    }
  }, [loading]);

  // Handle create purchase requisition
  // const handleCreatePurchaseRequisition = async (values) => {
  //   const salesInquiryLineItemsDtos = [];

  //   values.lineItems.forEach((item) => {
  //     const lineItemDto = {
  //       quantity: item.quantity,
  //       indicativePrice: item.rawMaterial.unitPrice,
  //       rawMaterialId: item.rawMaterial.id,
  //     }
  //     salesInquiryLineItemsDtos.push(lineItemDto);
  //   })

  //   const purchaseRequisitionIds = purchaseRequisitions.map(pr => pr.id);

  //   const createSalesInquiryDto = {
  //     currentOrganisationId: organisationId,
  //     totalPrice: formik.values.totalPrice,
  //     salesInquiryLineItemsDtos: salesInquiryLineItemsDtos,
  //     purchaseRequisitionIds: purchaseRequisitionIds
  //   }

  //   console.log(createSalesInquiryDto)

  //   createSalesInquiryFromPurchaseRequisition(createSalesInquiryDto)
  //     .then((result) => {
  //       onClose();
  //       handleAlertOpen(`Successfully Created Sales Inquiry ${result.id}!`, 'success')
  //     })
  //     .catch((error) => handleAlertOpen(`Failed to Create Sales Inquiry from Purchase Requisitions`, 'error'))
  // };

  // DataGrid Columns
  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
    },
    {
      field: 'val',
      headerName: 'Predicted Value',
      flex: 1,
    },
    {
      field: 'shortfall',
      headerName: 'Current Shortfall',
      flex: 1,
    },
  ];

  useEffect(() => {
    const fetchFinalGoods = async () => {
      setData([]);
      const response = await fetch(
        `http://localhost:3000/api/final-goods/orgId/${organisationId}`
      );
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        setFinalGoods(result);
      }
    };
    fetchFinalGoods();
  }, [organisationId]);

  // NotificationAlert helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState();
  const [alertSeverity, setAlertSeverity] = useState('success');
  const handleAlertOpen = (text, severity) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertText(null);
    setAlertSeverity('success');
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${name} | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <DemandForecastToolbar
            key="toolbar"
            name={name}
            finalGoods={finalGoods}
            selectedFinalGood={selectedFinalGood}
            setSelectedFinalGood={setSelectedFinalGood}
            period={period}
            setPeriod={setPeriod}
            handleSubmit={handleSubmit}
            loading={loading}
            handleToggle={handleToggle}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            <Card
              variant="outlined"
              sx={{
                textAlign: 'center',
              }}
            >
              <CardContent>
                {data.length !== 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={550}>
                      <ComposedChart
                        width={500}
                        height={400}
                        data={data}
                        margin={{
                          top: 20,
                          right: 80,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                          dataKey="date"
                          label={{
                            value: 'Month and Year',
                            position: 'insideBottomRight',
                            offset: -10,
                          }}
                          scale="band"
                        />
                        <YAxis
                          label={{
                            value: 'Amount',
                            angle: -90,
                            position: 'insideLeft',
                            offset: -10,
                          }}
                        />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="bound"
                          fill="#8884d8"
                          stroke="#8884d8"
                        />
                        <Scatter
                          name="Actual Value"
                          dataKey="test"
                          fill="red"
                        />
                        <Line
                          type="monotone"
                          dataKey="val"
                          name="Value"
                          stroke="#ff7300"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <DataGrid
                      autoHeight
                      rows={data.slice(-Number(actualPeriod))}
                      columns={columns}
                      pageSize={10}
                      getRowId={(row) => row.date}
                      rowsPerPageOptions={[10]}
                      checkboxSelection
                      disableSelectionOnClick
                      experimentalFeatures={{ newEditingApi: true }}
                    />
                    {/* <Button onClick={handleCreatePR}>Create Purchase Requisition</Button> */}
                  </>
                ) : (
                  ''
                )}
                {loading && data.length === 0 ? <CircularProgress /> : ''}
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ProcurementForecast;
