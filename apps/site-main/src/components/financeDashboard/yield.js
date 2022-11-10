import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartIcon';
import {useEffect, useState } from 'react';

export const Yield = (props) => {


  const [productionYield, setProductionYields] = useState([]);
  const getYields = async () => {
    const response = await fetch('');
    setProductionYields(response);
  };

  useEffect(() => {
    getYields();
}, []);


  return (
  <Card {...props}>
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
            Yield
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {productionYield}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
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
