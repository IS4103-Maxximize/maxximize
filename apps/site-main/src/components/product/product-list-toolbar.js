import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Badge,
  Box, Card,
  CardContent, IconButton, InputAdornment, Stack, SvgIcon, TextField, Tooltip, Typography
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
    <Box>
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
                <Tooltip 
                  title={`Add ${type === 'raw-materials' ? 'Raw Material' : 'Final Good'}`}
                >
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleAddProductClick();
                      handleClickOpen();
                    }}
                    sx={{ mr: 1}}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={`Delete ${type === 'raw-materials' ? 'Raw Material(s)' : 'Final Good(s)'}`}
                >
                  <span>
                    <IconButton
                      disabled={disabled}
                      color="error"
                      onClick={handleConfirmDialogOpen}
                    >
                      <Badge badgeContent={numProducts} color="error">
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
  )
};
