import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/login';
import { DashboardLayout } from './components/dashboard-layout';
import Unauthorized from './pages/unauthorized';
import Dashboard from './pages/dashboard';
import NotFound from './pages/404';
import RequireAuth from './components/RequireAuth';
import Onboarding from './pages/onboarding';

const ROLES = {
  Admin: 'admin',
  Manager: 'manager',
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="login" element={<Login />}></Route>
        <Route path="unauthorized" element={<Unauthorized />}></Route>

        {/* Protected Routes for all Roles */}
        <Route
          element={<RequireAuth requiredRoles={[ROLES.Admin, ROLES.Manager]} />}
        >
          <Route element={<DashboardLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />}></Route>

            {/* Protected Routes for Admin Specifically */}
            <Route element={<RequireAuth requiredRoles={[ROLES.Admin]} />}>
              {/* Add routes here */}
              <Route path="onboarding" element={<Onboarding />}></Route>
            </Route>

            {/* Protected Routes for Manager Specifically*/}
            <Route element={<RequireAuth requiredRoles={[ROLES.Manager]} />}>
              {/* Add routes here */}
            </Route>
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
