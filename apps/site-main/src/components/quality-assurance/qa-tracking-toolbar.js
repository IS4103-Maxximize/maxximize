import ClearIcon from '@mui/icons-material/Clear';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import {
  Box, Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon } from '../../icons/search'


export const QATrackingToolbar = (props) => {
  const {
    name,
    search,
    setSearch,
    handleSearch,
    clearSearch,
    // handleFormDialogOpen,
    // handleConfirmDialogOpen,
    ...rest
  } = props;

  // Get current pathname
  const location = useLocation();
  const [domain, setDomain] = useState('');
  const [subdomain, setSubDomain] = useState('');
  useEffect(() => {
    const pathname = location.pathname;
    const domain = pathname.substring(1, pathname.lastIndexOf('/'));
    const subdomain = pathname.substring(pathname.lastIndexOf('/') + 1);
    setDomain(domain);
    setSubDomain(subdomain);
  }, [location]);

  return (
    <>
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
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder={`Input Batch Number`}
                  variant="outlined"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                />
                <Tooltip title={`Search Batch`}>
                  <IconButton
                    color="primary"
                    onClick={handleSearch}
                    sx={{ mr: 2 }}
                    disabled={!search}
                  >
                    <FindReplaceIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Clear Batch Selection`}>
                  <IconButton
                    color="error"
                    onClick={clearSearch}
                    disabled={!search}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              {/* <Box sx={{ m: 1 }}>
                <Tooltip title={`Clear Batch Number`}>
                  <IconButton
                    color="primary"
                    onClick={clearSearch}
                    sx={{ mr: 1 }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box> */}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
