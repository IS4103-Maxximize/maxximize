import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Badge,
  Box, Card,
  CardContent, IconButton, InputAdornment, Stack, SvgIcon, TextField, Tooltip, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';

export const Toolbar = (props) => {
  const {
    name,
    deleteDisabled,
    handleSearch,
    handleAdd,
    handleDelete,
    handleFormDialogOpen,
    handleConfirmDialogOpen,
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
          {name}
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
                  disableHoverListener={deleteDisabled}
                >
                  <IconButton
                    color="error"
                    disabled={deleteDisabled}
                    onClick={handleConfirmDialogOpen}
                  >
                    <Badge >
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
