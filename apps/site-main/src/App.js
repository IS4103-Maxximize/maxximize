import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard-layout';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import NotFound from './pages/404';
import Unauthorized from './pages/unauthorized';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import OrganisationSelection from './pages/organisationSelection';
import Procurement from './pages/procurement';
import ProcurementForecast from './pages/procurement/forecast';
import ProcurementOrdering from './pages/procurement/ordering';
import ProcurementReceiving from './pages/procurement/receiving';
import Products from './pages/products';
import WorkerManagement from './pages/workermanagement';

const ROLES = {
  Admin: 'admin',
  Manager: 'manager',
  FactoryWorker: 'factoryworker'
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route
          path="organisationSelection"
          element={<OrganisationSelection />}
        ></Route>
        <Route path="login/:orgId" element={<Login />}></Route>
        <Route path="unauthorized" element={<Unauthorized />}></Route>

        {/* Protected Routes */}

        {/* Protected Routes for all Roles */}
        <Route element={<RequireAuth requiredRoles={[ROLES.Admin, ROLES.Manager, ROLES.FactoryWorker]}/>}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard */}
              <Route path="/" element={<Dashboard />}></Route>

              {/* Protected Routes for Admin Specifically */}
              <Route element={<RequireAuth requiredRoles={[ROLES.Admin]}/>}>
                {/* Worker Management */}
                <Route path="workermanagement" element={<WorkerManagement />}></Route>
                {/* Product Management */}
                <Route path="raw-materials" element={<Products type="raw-materials" />}></Route>
                <Route path="final-goods" element={<Products type="final-goods" />}></Route>
              </Route>

              {/* Protected Routes for Manager and Factory Worker */}
              <Route element={<RequireAuth requiredRoles={[ROLES.Manager, ROLES.FactoryWorker]}/>}>
                {/* Procurement */}
                <Route path="procurement" element={<Procurement />}></Route>
                {/* Procurement Modules */}
                <Route path="procurement/ordering" element={<ProcurementOrdering />}></Route>
                <Route path="procurement/receiving" element={<ProcurementReceiving />}></Route>
                <Route path="procurement/forecast" element={<ProcurementForecast />}></Route>
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
