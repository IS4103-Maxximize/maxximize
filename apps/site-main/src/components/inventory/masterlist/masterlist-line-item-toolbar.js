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
import { GridSearchIcon } from '@mui/x-data-grid';

export const MasterlistLineItemToolbar = ({
  handleSearch,
  productName,
  overallReservedQuantity,
  overallTotalQuantity,
}) => {
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
          {productName}
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card sx={{ marginBottom: 1, paddingX: 2, paddingY: 1 }}>
          <TextField
            disabled
            fullWidth
            label="Reserved Quantity"
            margin="normal"
            name="reservedQuantity"
            value={overallReservedQuantity}
            variant="outlined"
            size="small"
          />
          <TextField
            disabled
            fullWidth
            label="Total Quantity"
            margin="normal"
            name="totalQuantity"
            value={overallTotalQuantity || ''}
            variant="outlined"
            size="small"
          />
        </Card>
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
                  placeholder="Search batch line items"
                  variant="outlined"
                  type="search"
                  onChange={handleSearch}
                />
              </Stack>

              {/* <Box sx={{ m: 1 }}>
                <Tooltip title={`Create Warehouse Entry`}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleClickOpen();
                    }}
                    sx={{ mr: 1 }}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={'Delete Warehouse Entry (Single/Multiple)'}>
                  <IconButton
                    disabled={disabled}
                    color="error"
                    onClick={handleConfirmDialogOpen}
                  >
                    <Badge badgeContent={numWarehouse} color="error">
                      <DeleteIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box> */}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
