import {
  Box,
  Button,
  Card,
  CardContent, InputAdornment, Stack, SvgIcon, TextField, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';


export const ProductListToolbar = (props) => {
  const {
    disabled,
    numProducts,
    type,
    handleClickOpen,
    handleConfirmDialogOpen,
    handleSearch,
    handleAddProductClick,
  } = props;

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
          {type === 'raw-materials' && 'Raw Materials'}
          {type === 'final-goods' && 'Final Goods'}
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