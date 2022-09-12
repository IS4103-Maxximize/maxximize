import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  SvgIcon
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';

export const SearchBusinessPartner = ({ props }) => {

  const {
    handleSearch,
  } = props;
    
  return (
    <Box {...props}>
      <Box sx={{ mt: 3 }}>
      <Stack
                direction="row"
                spacing={1}
              >
              <TextField
                sx={{ width: 500 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search organisation"
                variant="outlined"
                type="search"
                onChange={handleSearch}
              />
              </Stack>
        </Box>
        </Box>
  )};
