import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import {useEffect, useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import { fetchCustomers } from '../../helpers/dashboard';

export const TotalCustomers = (props) => {

  const [customers, setCustomers] = useState([]);
  const [change, setChange] = useState([]);
  const getCustomers = async () => {
    const response = await fetchCustomers();
    setCustomers(response);
    setChange(response.change);
  };

  useEffect(() => {
    getCustomers();
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
            TOTAL CUSTOMERS
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
          {customers}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <AssignmentOutlinedIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          pt: 2
        }}
      >
        <ArrowUpwardIcon color="success" />
        <Typography
          variant="body2"
          sx={{
            mr: 1
          }}
        >
          {change}
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last month
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
};