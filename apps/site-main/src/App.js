import OrganisationSelection from './pages/organisationSelection'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Login from './pages/login';
import { DashboardLayout } from './components/dashboard-layout';
import Dashboard from './pages/dashboard';
import Products from './pages/products';
import WorkerManagement from './pages/workermanagement';
import NotFound from './pages/404';
import RequireAuth from './components/RequireAuth';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="organisationSelection" element={<OrganisationSelection />}></Route>
          <Route path="login/:orgId" element={<Login />}></Route>
          {/* <Route path="unauthorized" element={<Unauthorized />}></Route> */}

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="products" element={<Products />}></Route>
              <Route path="workermanagement" element={<WorkerManagement />}></Route>
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
};

export default App;