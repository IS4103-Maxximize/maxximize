import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { apiHost } from '../helpers/constants';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayout = () => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({});

  const updateUser = async (userId) => {
    const user = await fetch(`${apiHost}/users/finduser/${userId}`).then(res => res.json());
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    // Update when returning to dashboard
    // also the default redirect from customer portal
    if (pathname === '/') { 
      updateUser(storedUser.id);
    } else {
      setUser(storedUser);
    }
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
        user={user}
      />

      <div style={{ flexGrow: 1 }}>
        <DashboardLayoutRoot>
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Outlet />
          </Box>
        </DashboardLayoutRoot>
        <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
};
