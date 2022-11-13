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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  procurementBreadcrumbs,
  productionBreadcrumbs,
  fulfilmentBreadcrumbs,
} from '../helpers/constants';
import { Search as SearchIcon } from '../icons/search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { NotificationAlert } from './notification-alert';

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
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

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

  const [disabled, setDisabled] = useState(false);

  const handleCSVUpload = async ({ target }) => {
    if (target.files.length === 0) {
      return null;
    }
    const file = target.files[0];
    const formdata = new FormData();
    formdata.append('file', file, file.name);
    formdata.append('organisationId', organisationId);

    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    setDisabled(true);

    const uploadResponse = await fetch(
      `http://localhost:3000/api/files/uploadPurchaseOrders`,
      requestOptions
    );

    if (uploadResponse.status === 200 || uploadResponse.status === 201) {
      const result = await uploadResponse.json();
      setDisabled(false);
    } else {
      const result = await uploadResponse.json();
      handleAlertOpen(`Error encountered: ${result.message}`, 'error');
      setDisabled(false);
    }
  };

  // Alert Helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error'); // success || error
  const [alertText, setAlertText] = useState('');
  const handleAlertOpen = (text, severity) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <>
      <NotificationAlert
        key="notification-alert"
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
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
            {domain === 'production' && productionBreadcrumbs(subdomain)}
            {domain === 'fulfilment' && fulfilmentBreadcrumbs(subdomain)}
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
                  {name === 'Purchase Order' ? (
                    <Tooltip title="Upload purchase orders">
                      <IconButton
                        variant="contained"
                        component="label"
                        disabled={disabled}
                      >
                        <UploadFileIcon color="primary" />
                        <input
                          type="file"
                          hidden
                          accept=".csv"
                          onChange={handleCSVUpload}
                        />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                  {handleFormDialogOpen !== null ? (
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
                  ) : (
                    <></>
                  )}

                  {deleteDisabled !== null ? (
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
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};
