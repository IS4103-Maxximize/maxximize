import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartIcon';
import {useEffect, useState } from 'react';
import { fetchThroughputs } from '../../helpers/dashboard';

export const Throughput = (props) => {

  const [throughputs, setThroughputs] = useState([]);
  const getThroughputs = async () => {
    const response = await fetchThroughputs();
    setThroughputs(response);
  };

  useEffect(() => {
    getThroughputs();
}, []);

  return(
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Throughput
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {throughputs}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56
            }}
          >
            <InsertChartIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
};