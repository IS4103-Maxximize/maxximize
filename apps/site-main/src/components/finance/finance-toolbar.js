import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box, Button, Card,
  CardContent, CardHeader, Divider, Grid, IconButton, InputAdornment, Stack, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import DayJS from 'dayjs';
import { useEffect, useState } from 'react';

export const FinanceToolbar = (props) => {
  const {
    name,
    // numRows,
    // deleteDisabled,
    // handleSearch,
    // handleAdd,
    // handleFormDialogOpen,
    // handleConfirmDialogOpen,
    ...rest
  } = props;

  // const monthOptions = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December'
  // ]

  // Revenue Helpers
  const [revenueType, setRevenueType] = useState('month');
  const [fromRevenueDate, setFromRevenueDate] = useState(null);
  const [toRevenueDate, setToRevenueDate] = useState(new Date());

  const handleRevenueType = (event, newType) => {
    if (newType !== null) {
      setRevenueType(newType);
    }
  }

  const resetRevenueDates = () => {
    setFromRevenueDate(null);
    setToRevenueDate(new Date());
  }

  useEffect(() => {
    resetRevenueDates();
  }, [revenueType]) 


  // Costs Helpers
  const [costsType, setCostsType] = useState('month');
  const [fromCostsDate, setFromCostsDate] = useState(null);
  const [toCostsDate, setToCostsDate] = useState(new Date());

  const handleCostsType = (event, newType) => {
    if (newType !== null) {
      setCostsType(newType);
    }
  }

  const resetCostsDates = () => {
    setFromCostsDate(null);
    setToCostsDate(new Date());
  }

  useEffect(() => {
    resetCostsDates();
  }, [costsType])


  const FilterCard = (props) => {
    const {
      title,
      from,
      to,
      setFrom,
      setTo,
      type,
      handleType,
      reset,
      ...rest
    } = props;

    return (
      <Card>
        <CardHeader
          title={title}
          action={(
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handleType}
              color="primary"
            >
              <ToggleButton value="month" >
                Month
              </ToggleButton>
              <ToggleButton value="year" >
                Year
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />
        <Divider />
        <CardContent>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box>
              <DatePicker
                views={type === 'month' ? ['year', 'month'] : ['year']}
                label="FROM"
                value={from}
                onChange={setFrom}
                renderInput={(params) => <TextField {...params} sx={{ m: 1, width: 250 }}/>}
                disableFuture
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: -1 }}>
                      <IconButton
                        onClick={() => setFrom(null)}
                        disabled={!from}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <DatePicker
                views={type === 'month' ? ['year', 'month'] : ['year']}
                label="TO"
                value={to}
                onChange={setTo}
                renderInput={(params) => <TextField {...params} sx={{ m: 1, width: 250 }} />}
                disableFuture
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: -1 }}>
                    <IconButton
                      onClick={() => setTo(null)}
                      disabled={!to}
                    >
                      <ClearIcon />
                    </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <IconButton
                  disabled={DayJS(from).startOf(type) > DayJS(to).endOf(type)}
                  color='primary'
                >
                  <SearchIcon />
                </IconButton>
              <Button
                variant='contained'
                onClick={reset}
              >
                Reset
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    );
  };
  

  return (
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          {name}
        </Typography>
      </Box>
      <Grid container sx={{ mt: 3 }} spacing={2}>
        <Grid item md={6} xs={12}>
          <FilterCard 
            title='Revenue Filter'
            from={fromRevenueDate}
            to={toRevenueDate}
            setFrom={setFromRevenueDate}
            setTo={setToRevenueDate}
            type={revenueType}
            handleType={handleRevenueType}
            reset={resetRevenueDates}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <FilterCard 
            title='Costs Filter'
            from={fromCostsDate}
            to={toCostsDate}
            setFrom={setFromCostsDate}
            setTo={setToCostsDate}
            type={costsType}
            handleType={handleCostsType}
            reset={resetCostsDates}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
