import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
} from '@mui/material';
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
import { DemandForecastToolbar } from '../../components/procurement-ordering/demand-forecast-toolbar';

const ProcurementForecast = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Demand Forecast';

  const [data, setData] = useState();
  const [finalGoods, setFinalGoods] = useState([]);
  const [selectedFinalGood, setSelectedFinalGood] = useState('');
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(false);
  const [seasonality, setSeasonality] = useState(true);

  const API_URL = 'http://localhost:3000/api/final-goods/demand-forecast/'
  
  // Fetch demand forecast data
  const handleSubmit = async () => {
    console.log(seasonality);
    setLoading(true);
    const response = await fetch(
      `${API_URL}${organisationId}/${selectedFinalGood.id}/${period}/${seasonality}`
    );
    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      setData(result);
      setLoading(false);
    } else if (response.status === 500) {
      setLoading(false);
    }
  };

  // Toggle switch for seasonality
  const handleToggle = () => {
    setSeasonality(!seasonality);
  };

  useEffect(() => {
    const fetchFinalGoods = async () => {
      setData(null);
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

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${name} | ${user?.organisation?.name}`}</title>
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
          <DemandForecastToolbar
            key="toolbar"
            name={name}
            finalGoods={finalGoods}
            setSelectedFinalGood={setSelectedFinalGood}
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
                {data ? (
                  <ResponsiveContainer width="100%" height={500}>
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
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="bound"
                        fill="#8884d8"
                        stroke="#8884d8"
                      />
                      <Scatter name="Actual Value" dataKey="test" fill="red" />
                      <Line
                        type="monotone"
                        dataKey="val"
                        name="Value"
                        stroke="#ff7300"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  ''
                )}
                {loading ? <CircularProgress /> : ''}
              </CardContent>
            </Card>
            <Card>
              <CardContent>Test</CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ProcurementForecast;
