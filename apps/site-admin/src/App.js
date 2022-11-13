import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard-layout';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import NotFound from './pages/404';
import Application from './pages/application';
import Dashboard from './pages/dashboard';
import ForgotPassword from './pages/forgotPassword';
import Login from './pages/login';
import OrganisationManagement from './pages/organisation-management';
import ProtectedPublicRoute from './pages/protectedPublicRoute';
import ProtectedRoute from './pages/protectedRoute';
import ResetPassword from './pages/resetPassword';
import RevenueBrackets from './pages/revenue-brackets';
import Unauthorized from './pages/unauthorized';

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
            {/* Protected Routes for Admin Specifically */}
            <Route element={<RequireAuth requiredRoles={[ROLES.Admin]} />}>
              {/* Add routes here */}
              <Route
                path="/"
                element={<OrganisationManagement />}
              ></Route>
              <Route
                path="client-application"
                element={<Application />}
              ></Route>
              <Route
                path="revenue-brackets"
                element={<RevenueBrackets />}
              ></Route>
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
