import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Badge,
  Box, Breadcrumbs, Card,
  CardContent, IconButton, InputAdornment, Link, Stack, SvgIcon, TextField, Tooltip, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon } from '../../icons/search';


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
  const [subdomain, setSubDomain] = useState('');
  useEffect(() => {
    const pathname = location.pathname;
    const subdomain = pathname.substring(pathname.lastIndexOf('/') + 1);
    setSubDomain(subdomain);
  }, [location])

  // Hard coded for now, can be made modular to accommodate future reuse
  const breadcrumbs = [
    <Link 
      underline="hover" 
      key="sales-inquiry" 
      color={subdomain === 'sales-inquiry' ? 'primary' : 'inherit'}
      href="/procurement/sales-inquiry"
    >
      Sales Inquiry
    </Link>,
    <Link 
      underline="hover" 
      key="quotation" 
      color={subdomain === 'quotation' ? 'primary' : 'inherit'}
      href="/procurement/quotation"
    >
      Quotation
    </Link>,
    <Link 
      underline="hover" 
      key="purchase-order" 
      color={subdomain === 'purchase-order' ? 'primary' : 'inherit'}
      href="/procurement/purchase-order"
    >
      Purchase Order
    </Link>,
  ]

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          {name}
        </Typography>
        <Breadcrumbs separator="-">
          {breadcrumbs}
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
                m: -1
              }}>
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
                placeholder={`Search ${name}`}
                variant="outlined"
                type="search"
                onChange={handleSearch}
              />
              </Stack>
              
              <Box sx={{ m: 1 }}>
                <Tooltip 
                  title={`Add ${name}`}
                >
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleAdd();
                      handleFormDialogOpen();
                    }}
                    sx={{ mr: 1}}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={`Delete ${name}(s)`}
                >
                  <IconButton
                    color="error"
                    disabled={deleteDisabled}
                    onClick={handleConfirmDialogOpen}
                  >
                    <Badge badgeContent={numRows} color="error">
                      <DeleteIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
};
