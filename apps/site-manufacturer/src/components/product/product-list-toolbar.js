import {
  Box,
  Button,
  Card,
  CardContent, InputAdornment,
  SvgIcon, TextField, Typography,
  ToggleButton, ToggleButtonGroup, Stack, Tooltip,
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import RawOnIcon from '@mui/icons-material/RawOn';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';


export const ProductListToolbar = (props) => {
  const {
    disabled,
    numProducts,
    type,
    handleClickOpen,
    handleConfirmDialogOpen,
    handleSearch,
    handleAddProductClick,
    handleType
  } = props;

  const ProductToggle = () => {
    return (
      <ToggleButtonGroup
        exclusive
        color='primary'
        value={type}
        onChange={handleType}
      >
        <ToggleButton value='raw'>
          <RawOnIcon />
        </ToggleButton>
        <ToggleButton value='final'>
          <AssignmentTurnedInIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    )
  }

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
          {type === 'raw' && 'Raw Materials'}
          {type === 'final' && 'Final Products'}
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
                m: -1
              }}>
              <Stack
                direction="row"
                spacing={1}
              >
              <ProductToggle/>
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
                placeholder="Search product"
                variant="outlined"
                type="search"
                onChange={handleSearch}
              />
              </Stack>
              
              <Box sx={{ m: 1 }}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      handleAddProductClick();
                      handleClickOpen();
                    }}
                    sx={{ mr: 1}}
                  >
                    Add Product
                </Button>
                <Button
                  disabled={disabled}
                  color="error"
                  variant="contained"
                  onClick={handleConfirmDialogOpen}
                >
                  Delete Product(s) 
                  {numProducts > 0 ? ` [ ${numProducts} ]` : ''}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
};
