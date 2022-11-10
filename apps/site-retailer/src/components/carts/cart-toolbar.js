import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Badge,
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';

export const CartToolbar = (props) => {
  const { name, checked, handleSearch, handleConfirmDialogOpen, ...rest } =
    props;

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
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="center">
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  m: -1,
                  width: '90%',
                }}
              >
                <Stack direction="row" spacing={1} width="45%">
                  <TextField
                    sx={{ width: '100%' }}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon fontSize="small" color="action">
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      ),
                    }}
                    placeholder={`Search ${name}`}
                    variant="outlined"
                    type="search"
                    onChange={handleSearch}
                  />
                </Stack>
              </Box>
              <Box display="flex" justifyContent="flex-end" width="10%">
                <Tooltip title={'Delete Address Entry (Single/Multiple)'}>
                  <span>
                    <IconButton
                      disabled={checked?.length === 0}
                      onClick={handleConfirmDialogOpen}
                      color="error"
                    >
                      <Badge badgeContent={checked.length} color="error">
                        <DeleteIcon />
                      </Badge>
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
