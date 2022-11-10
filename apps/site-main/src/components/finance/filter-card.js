import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Card, CardContent, CardHeader, Divider, IconButton, InputAdornment, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import DayJS from 'dayjs';

export const FilterCard = (props) => {
  const {
    title,
    range,
    toggleRange,
    inDate,
    setIn,
    from,
    to,
    setFrom,
    setTo,
    type,
    handleType,
    reset,
    handleSearch,
    ...rest
  } = props;

  return (
    <Card>
      <CardHeader
        sx={{ m: -1 }}
        title={title}
        action={(
          <Stack direction="row" spacing={2}>
            <IconButton
              disabled={
                DayJS(from).startOf(type) > DayJS(to).endOf(type) 
                || !inDate 
                || (!from && !to)
              }
              color='primary'
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton>
            <Button
              color={range ? 'secondary' : 'primary'}
              onClick={toggleRange}
              variant='contained'
            >
              {!range && 'Single'}
              {range && 'Range'}
            </Button>
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
            <Button
              color='draft'
              variant='contained'
              onClick={reset}
            >
              Reset
            </Button>
          </Stack>
        )}
      />
      <Divider />
      <CardContent
        sx={{ m: -2 }}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          {!range && <Box>
            <DatePicker
              views={type === 'month' ? ['year', 'month'] : ['year']}
              label="IN"
              value={inDate}
              onChange={setIn}
              renderInput={(params) => <TextField {...params} sx={{ m: 1, width: 250 }}/>}
              disableFuture
            />
          </Box>}
          {range && <Box>
            <DatePicker
              views={type === 'month' ? ['year', 'month'] : ['year']}
              label="FROM"
              value={from}
              onChange={setFrom}
              renderInput={(params) => <TextField {...params} sx={{ m: 1, width: 250 }}/>}
              disableFuture
            />
            <DatePicker
              views={type === 'month' ? ['year', 'month'] : ['year']}
              label="TO"
              value={to}
              onChange={setTo}
              renderInput={(params) => <TextField {...params} sx={{ m: 1, width: 250 }} />}
              disableFuture
            />
          </Box>}
        </Box>
      </CardContent>
    </Card>
  );
};
