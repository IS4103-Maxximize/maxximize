import { Box, Card, CardContent, Container } from '@mui/material';
import { Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line, Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { DemandForecastToolbar } from '../../components/procurement-ordering/demand-forecast-toolbar';

const ProcurementForecast = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Demand Forecast';

  const [data, setData] = useState([]);
  const [finalGoods, setFinalGoods] = useState([]);
  const [selectedFinalGood, setSelectedFinalGood] = useState('');
  const [period, setPeriod] = useState('');

  const handleSubmit = async () => {
    const response = await fetch(
      `http://localhost:3000/api/raw-materials/orgId/${organisationId}/demand-forecast`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          period: period,
          selectedFinalGood: selectedFinalGood,
        }),
      }
    );
    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      setData(result);
    }
  };

  useEffect(() => {
    const fetchFinalGoods = async () => {
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
                      dataKey="name"
                      label={{
                        value: 'Month',
                        position: 'insideBottomRight',
                        offset: 0,
                      }}
                      scale="band"
                    />
                    <YAxis
                      label={{
                        value: 'Amount',
                        angle: -90,
                        position: 'insideLeft',
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
                    <Line type="monotone" dataKey="val" stroke="#ff7300" />
                  </ComposedChart>
                ) : (
                  ""
                )}
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ProcurementForecast;
