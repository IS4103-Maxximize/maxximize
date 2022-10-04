import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Badge,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  Link,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon } from '../icons/search';
import { Link as RouterLink } from 'react-router-dom';
import { procurementBreadcrumbs } from '../helpers/constants';

export const Toolbar = (props) => {
  const {
    name,
    numRows,
    deleteDisabled,
    handleSearch,
    handleAdd,
    handleFormDialogOpen,
    handleConfirmDialogOpen,
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

  const productionBreadcrumbs = [
    <Link
      component={RouterLink}
      underline="hover"
      key="bill-of-material"
      color={subdomain === 'bill-of-material' ? 'primary' : 'inherit'}
      to="/production/bill-of-material"
    >
      Bill Of Material
    </Link>,
    <Link
      component={RouterLink}
      underline="hover"
      key="production-order"
      color={subdomain === 'production-order' ? 'primary' : 'inherit'}
      to="/production/production-order"
    >
      Production Order
    </Link>,
  ];

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
        <Breadcrumbs separator="-">
          {domain === 'procurement' && procurementBreadcrumbs(subdomain)}
          {domain === 'production' && productionBreadcrumbs}
        </Breadcrumbs>
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
                  placeholder={`Search ${name}`}
                  variant="outlined"
                  type="search"
                  onChange={handleSearch}
                />
              </Stack>

              <Box sx={{ m: 1 }}>
                <Tooltip title={`Add ${name}`}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleAdd && handleAdd();
                      handleFormDialogOpen();
                    }}
                    sx={{ mr: 1 }}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={`Delete ${name}(s)`}>
                  <span>
                    <IconButton
                      color="error"
                      disabled={deleteDisabled}
                      onClick={handleConfirmDialogOpen}
                    >
                      <Badge badgeContent={numRows} color="error">
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
