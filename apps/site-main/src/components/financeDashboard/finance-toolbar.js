import {
  Box,
  Button,
  Typography
} from '@mui/material';
import { Download as DownloadIcon } from '../../icons/download';

export const Toolbar = (props) => (
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
        Finance Dashboard
      </Typography>
        <Button
          startIcon={(<DownloadIcon fontSize="small" />)}
          sx={{ mr: 1 }}
        >
          Export
        </Button>
      </Box>
    </Box>
);