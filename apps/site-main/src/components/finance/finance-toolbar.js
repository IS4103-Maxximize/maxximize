import {
  Box, Typography
} from '@mui/material';

export const FinanceToolbar = (props) => {
  const {
    name,
    // numRows,
    // deleteDisabled,
    // handleSearch,
    // handleAdd,
    // handleFormDialogOpen,
    // handleConfirmDialogOpen,
    ...rest
  } = props;

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
      </Box>
    </Box>
  );
};
