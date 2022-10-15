import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';

export const OnboardToolbar = ({ handleSearch }) => {
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
          Applications
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                m: -1,
              }}
            >
              <Stack direction="row" spacing={1}>
                <TextField
                  sx={{ width: 500 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <GridSearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search Applications (By ID / Company Name / UEN)"
                  variant="outlined"
                  type="search"
                  onChange={handleSearch}
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
