import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box, IconButton, Tooltip,
  Typography
} from '@mui/material';

export const SimpleToolbar = (props) => {
  const {
    name,
    open,
    handleToggle,
    ...rest
  } = props;

  // Get current pathname
  // const location = useLocation();
  // const [domain, setDomain] = useState('');
  // const [subdomain, setSubDomain] = useState('');
  // useEffect(() => {
  //   const pathname = location.pathname;
  //   const domain = pathname.substring(1, pathname.lastIndexOf('/'));
  //   const subdomain = pathname.substring(pathname.lastIndexOf('/') + 1);
  //   setDomain(domain);
  //   setSubDomain(subdomain);
  // }, [location]);

  return (
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
      <Tooltip title={
        open ? 'Close Creation'
        : `Add ${name.slice(0, name.length-1)}`
      }>
        <IconButton
          color="primary"
          onClick={() => {
            handleToggle();
          }}
          sx={{ mr: 1 }}
        >
          {open ? <CloseIcon />  : <AddBoxIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
