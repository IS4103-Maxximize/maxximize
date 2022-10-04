import AddBoxIcon from '@mui/icons-material/AddBox';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { procurementBreadcrumbs } from '../../helpers/constants';
import { Search as SearchIcon } from '../../icons/search';

export const PurchaseRequisitionToolbar = (props) => {
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
                <Tooltip title={`Add Sales Inquiry from PRs`}>
                  <span>
                    <Button
                      disabled={numRows < 1}
                      startIcon={<AddBoxIcon />}
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        handleAdd && handleAdd();
                        handleFormDialogOpen();
                      }}
                    >
                      {`Create Sales Inquiry from PRs [${numRows}]`}
                    </Button>
                  </span>
                </Tooltip>
                {/* <Tooltip title={`Delete ${name}(s)`}>
                  <IconButton
                    color="error"
                    disabled={deleteDisabled}
                    onClick={handleConfirmDialogOpen}
                  >
                    <Badge badgeContent={numRows} color="error">
                      <DeleteIcon />
                    </Badge>
                  </IconButton>
                </Tooltip> */}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
