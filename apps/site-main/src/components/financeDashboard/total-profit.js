import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {useEffect, useState } from 'react';
import { fetchProfits } from '../../helpers/dashboard';

export const TotalProfit = (props) => {

  const [profits, setProfits] = useState([]);
  const getProfits = async () => {
    const response = await fetchProfits();
    setProfits(response);
  };

  useEffect(() => {
    getProfits();
}, []);

return(
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
            TOTAL PROFIT
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {profits}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <AttachMoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
};