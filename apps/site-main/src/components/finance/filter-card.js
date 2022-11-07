import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Card, CardContent, CardHeader, Divider, IconButton, InputAdornment, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import DayJS from 'dayjs';

export const FilterCard = (props) => {
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
        sx={{ m: -1 }}
        title={title}
        action={(
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
          
        </Box>
      </CardContent>
    </Card>
  );
};
