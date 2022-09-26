import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RawOnIcon from '@mui/icons-material/RawOn';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Selector as SelectorIcon } from '../icons/selector';
import { User as UserIcon } from '../icons/user';
import { Logo } from './logo';

const items = [
  {
    href: '/workermanagement',
    icon: <UserIcon fontSize="small" />,
    title: 'Worker Management',
    access: ['admin', 'superadmin'],
  },
  // Products
  {
    href: '/raw-materials',
    icon: <RawOnIcon fontSize="small" />,
    title: 'Raw Materials',
    access: ['manager', 'superadmin'],
  },
  {
    href: '/final-goods',
    icon: <DoneAllIcon fontSize="small" />,
    title: 'Final Goods',
    access: ['manager', 'superadmin'],
  },

  {
    href: '/businessrelations',
    icon: <CorporateFareIcon fontSize="small" />,
    title: 'Business Relations',
    access: ['admin', 'superadmin'],
  },
  {
    href: '/procurement',
    icon: <AddShoppingCartIcon fontSize="small" />,
    title: 'Procurement',
    access: ['manager', 'factoryworker', 'superadmin'],
  },
  {
    href: '/qualityAssurance',
    icon: <HealthAndSafetyIcon fontSize="small" />,
    title: 'Quality Assurance',
    access: ['manager', 'factoryworker', 'superadmin'],
  },
  {
    href: '/inventory',
    icon: <WarehouseIcon fontSize="small" />,
    title: 'Inventory',
    access: ['superadmin', 'manager', 'factoryworker'],
  },
  // Production
  // {
  //   href: '/production',
  //   icon: <EngineeringIcon fontSize="small" />,
  //   title: 'Production',
  //   access: ['manager', 'factoryworker', 'superadmin'],
  // },
  {
    href: '/production/bill-of-material',
    icon: <FormatListBulletedIcon fontSize="small" />,
    title: 'Bill Of Material',
    access: ['superadmin'],
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose, user } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false,
  });

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div>
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Link to="/">
            <Logo
              sx={{
                height: 42,
                width: 42,
              }}
            />
          </Link>
          Welcome {user.firstName}! [{user.role}]
        </Box>
        <Box sx={{ px: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              px: 3,
              py: '11px',
              borderRadius: 1,
            }}
          >
            <div>
              <Typography color="inherit" variant="subtitle1">
                {user?.organisation?.name}
              </Typography>
              <Typography color="neutral.400" variant="body2">
                Your tier : Premium
              </Typography>
            </div>
            <SelectorIcon
              sx={{
                color: 'neutral.500',
                width: 14,
                height: 14,
              }}
            />
          </Box>
        </Box>
      </div>
      <Divider
        sx={{
          borderColor: '#2D3748',
          my: 3,
        }}
      />
      <Box
        sx={{
          pl: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        {items
          .filter((item) => item.access.includes(user.role))
          .map((item, index, disabled) => (
            <Link to={item.href} style={{ textDecoration: 'none' }} key={index}>
              <Button variant="contained" endIcon={item.icon}>
                {item.title}
              </Button>
            </Link>
          ))}
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
