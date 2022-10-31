import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import Inventory from '@mui/icons-material/Inventory';
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
import { perc2color } from '../../../helpers/constants'

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
          <Stack spacing={1} direction="row" alignItems='baseline'>
            <TextField
              disabled
              // fullWidth
              label="Reserved Quantity"
              margin="normal"
              name="reservedQuantity"
              value={overallReservedQuantity}
              variant="outlined"
              size="small"
            />
            <TextField
              disabled
              // fullWidth
              label="Total Quantity"
              margin="normal"
              name="totalQuantity"
              value={overallTotalQuantity || ''}
              variant="outlined"
              size="small"
            />
            <TextField
              disabled
              // fullWidth
              label="Total Remaining Quantity"
              margin="normal"
              name="remainingQuantity"
              value={`${overallTotalQuantity - overallReservedQuantity} / ${overallTotalQuantity}` || ''}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Inventory 
                      sx={{
                        color: perc2color('masterlist', {'remaining': overallTotalQuantity - overallReservedQuantity, 'total': overallTotalQuantity})
                      }}
                    />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
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
                  placeholder="Search Batch Line Items"
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
