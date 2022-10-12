import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/login';
import { DashboardLayout } from './components/dashboard-layout';
import Unauthorized from './pages/unauthorized';
import Dashboard from './pages/dashboard';
import NotFound from './pages/404';
import RequireAuth from './components/RequireAuth';
import Onboarding from './pages/onboarding';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';
import ProtectedRoute from './pages/protectedRoute';
import ProtectedPublicRoute from './pages/protectedPublicRoute';

const ROLES = {
  Admin: 'admin',
  Manager: 'manager',
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="/login" element={<ProtectedPublicRoute />}>
          <Route path="/login" element={<Login />}></Route>
        </Route>
        <Route path="/forgotpassword" element={<ProtectedPublicRoute />}>
          <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
        </Route>
        <Route path="unauthorized" element={<Unauthorized />}></Route>

        {/* Protected Routes for all Roles */}
        <Route
          element={<RequireAuth requiredRoles={[ROLES.Admin, ROLES.Manager]} />}
        >
          {/*First time login, without dashboard layout*/}
          <Route path="/resetpassword" element={<ProtectedRoute />}>
            <Route path="/resetpassword" element={<ResetPassword />} />
          </Route>

          <Route element={<DashboardLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />}></Route>

            {/* Protected Routes for Admin Specifically */}
            {/* <Route element={<RequireAuth requiredRoles={[ROLES.Admin]} />}>
              {/* Add routes here
              <Route path="onboarding" element={<Onboarding />}></Route>
            </Route> */}

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
