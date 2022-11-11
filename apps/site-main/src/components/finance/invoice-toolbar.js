import {
  Box, Typography
} from '@mui/material';

export const InvoiceToolbar = (props) => {
  const {
    name,
    action,
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
        {action}
      </Box>
    </Box>
  );
};
