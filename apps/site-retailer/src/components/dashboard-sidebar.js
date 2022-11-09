import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  Link,
  Typography,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Selector as SelectorIcon } from '../icons/selector';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Logo } from './logo';

const standalone = [
  {
    href: '/suppliers',
    icon: <BusinessIcon fontSize="small" />,
    title: 'View Suppliers',
    access: ['admin', 'superadmin'],
  },
];

const items = [
  //   {
  //     subsystem: 'Client',
  //     access: ['admin', 'superadmin'],
  //     icon: (
  //       <PeopleAltIcon
  //         sx={{ marginTop: 0.2, color: '#9CA3AF' }}
  //         fontSize="small"
  //       />
  //     ),
  //     open: 'openClient',
  //     handleClick: 'handleClientClick',
  //     modules: [
  //       {
  //         href: '/client/application',
  //         icon: <ContactPageIcon fontSize="small" />,
  //         title: 'Application',
  //         access: ['admin', 'superadmin'],
  //       },
  //       {
  //         href: '/client/organisation-management',
  //         icon: <BusinessIcon fontSize="small" />,
  //         title: 'Organisation Management',
  //         access: ['admin', 'superadmin'],
  //       },
  //     ],
  //   },
];

export const DashboardSidebar = (props) => {
  const { pathname } = useLocation();
  const basepath = pathname.slice(1, pathname.lastIndexOf('/'));

  const { open, onClose, user } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false,
  });

  //Nest menu for when the need arises
  const [openClient, setOpenClient] = useState(true);

  const handleClientClick = () => {
    setOpenClient(!openClient);
  };

  const standaloneModules = standalone
    .filter((module) => module.access.includes(user.role))
    .map((module, index) => {
      return (
        <Link
          component={RouterLink}
          to={module.href}
          key={index}
          color="secondary"
          underline="none"
          sx={{ mr: 3, ml: -1.4 }}
        >
          <Button
            startIcon={module.icon}
            disableRipple
            sx={{
              backgroundColor:
                module.href === '/' + pathname.split('/')[1] &&
                'rgba(255,255,255, 0.08)',
              borderRadius: 1,
              color:
                module.href === '/' + pathname.split('/')[1]
                  ? '#FE2472'
                  : 'neutral.300',
              fontWeight:
                module.href === '/' + pathname.split('/')[1] &&
                'fontWeightBold',
              justifyContent: 'flex-start',
              px: 3,
              textAlign: 'left',
              textTransform: 'none',
              width: '100%',
              '& .MuiButton-startIcon': {
                color:
                  module.href === '/' + pathname.split('/')[1]
                    ? '#FE2472'
                    : 'neutral.400',
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255, 0.08)',
              },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>{module.title}</Box>
          </Button>
        </Link>
      );
    });

  const nestedModules = items
    .filter((subsystem) => subsystem.access.includes(user.role))
    .map((item, index) => {
      return (
        <Box key={index} sx={{ mr: 1 }}>
          <Accordion
            defaultExpanded={basepath === item.basepath}
            disableGutters
            sx={{
              backgroundColor: 'rgba(17,24,39)',
              color: 'neutral.300',
              fontWeight: 'fontWeightBold',
              justifyContent: 'flex-start',
              width: '100%',
              '&:hover': {
                backgroundColor: 'rgba(17,24,39)',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: 'rgba(17,24,39)',
                color: 'neutral.300',
                fontWeight: 'fontWeightBold',
                fontSize: '14px',
                justifyContent: 'flex-start',
                width: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(17,24,39)',
                },
              }}
            >
              <Box display="flex" ml={-1}>
                {item.icon}
                <Box ml={1}>{item.subsystem}</Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: 'rgba(17,24,39)',
                color: 'neutral.300',
                fontWeight: 'fontWeightBold',
                justifyContent: 'flex-start',
                width: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(17,24,39)',
                },
                pl: 0,
              }}
            >
              {item.modules
                .filter((module) => module.access.includes(user.role))
                .map((module, index) => (
                  <Collapse
                    key={index}
                    in={eval(item.open)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Link
                      component={RouterLink}
                      to={module.href}
                      key={index}
                      color="secondary"
                      underline="none"
                    >
                      <Button
                        startIcon={module.icon}
                        disableRipple
                        sx={{
                          backgroundColor:
                            module.href === pathname &&
                            'rgba(255,255,255, 0.08)',
                          borderRadius: 1,
                          color:
                            module.href === pathname
                              ? 'secondary.main'
                              : 'neutral.300',
                          fontWeight:
                            module.href === pathname && 'fontWeightBold',
                          justifyContent: 'flex-start',
                          px: 3,
                          my: 0.5,
                          textAlign: 'left',
                          textTransform: 'none',
                          width: '100%',
                          '& .MuiButton-startIcon': {
                            color:
                              module.href === pathname
                                ? 'secondary.main'
                                : 'neutral.400',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255, 0.08)',
                          },
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>{module.title}</Box>
                      </Button>
                    </Link>
                  </Collapse>
                ))}
            </AccordionDetails>
          </Accordion>
          {/* <List>
            <ListItemButton
              sx={{
                borderRadius: 1,
                color: 'neutral.300',
                justifyContent: 'flex-start',
                px: 3,
                textAlign: 'left',
                textTransform: 'none',
                width: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255, 0.08)',
                },
              }}
              onClick={eval(item.handleClick)}
            >
              <ListItemIcon sx={{ color: 'neutral.400' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.subsystem} />
              {eval(item.open) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton> */}

          {/* </List> */}
        </Box>
      );
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
        {standaloneModules}
        {nestedModules}
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
