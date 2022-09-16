import PostAddIcon from '@mui/icons-material/PostAdd';
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
import { GridSearchIcon } from '@mui/x-data-grid';

export const GoodReceiptListToolbar = (props) => {
  const {
    disabled,
    numGoodReceipts,
    handleClickOpen,
    handleConfirmDialogOpen,
    handleSearch,
  } = props;

  return (
    <Box {...props}>
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
          Good Receipt
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
                  placeholder="Search good receipt"
                  variant="outlined"
                  type="search"
                  onChange={handleSearch}
                />
              </Stack>

              <Box sx={{ m: 1 }}>
                <Tooltip title={`Create Good Receipt Entry`}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleClickOpen();
                    }}
                    sx={{ mr: 1 }}
                  >
                    <PostAddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={'Delete Good Receipt Entry (Single/Multiple)'}>
                  <Badge badgeContent={numGoodReceipts} color="error">
                    <IconButton
                      disabled={disabled}
                      color="error"
                      onClick={handleConfirmDialogOpen}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Badge>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
