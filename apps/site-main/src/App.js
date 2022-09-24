import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard-layout';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import NotFound from './pages/404';
import BusinessRelations from './pages/businessRelations';
import Dashboard from './pages/dashboard';
import ForgotPassword from './pages/forgotPassword';
import Login from './pages/login';
import OrganisationSelection from './pages/organisationSelection';
import Procurement from './pages/procurement';
import ProcurementForecast from './pages/procurement/forecast';
import ProcurementGoodReceipt from './pages/procurement/goodreceipt';
import PurchaseOrder from './pages/procurement/purchase-order';
import Quotation from './pages/procurement/quotation';
import SalesInquiry from './pages/procurement/sales-inquiry';
import Products from './pages/products';
import ProtectedPublicRoute from './pages/protectedPublicRoute';
import ProtectedRoute from './pages/protectedRoute';
import ResetPassword from './pages/resetpassword';
import Unauthorized from './pages/unauthorized';
import Warehouse from './pages/inventory/warehouse';
import WorkerManagement from './pages/workermanagement';
import Inventory from './pages/inventory';
import Bin from './pages/inventory/bin';

const ROLES = {
  Admin: 'admin',
  Manager: 'manager',
  FactoryWorker: 'factoryworker',
  SuperAdmin: 'superadmin',
};

const routes = (
  <Routes>
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route path="/organisationselection" element={<ProtectedPublicRoute />}>
        <Route
          path="/organisationselection"
          element={<OrganisationSelection />}
        ></Route>
      </Route>
      <Route path="/login/:orgId" element={<ProtectedPublicRoute />}>
        <Route path="/login/:orgId" element={<Login />}></Route>
      </Route>
      <Route path="/forgotpassword/:orgId" element={<ProtectedPublicRoute />}>
        <Route
          path="/forgotpassword/:orgId"
          element={<ForgotPassword />}
        ></Route>
      </Route>
      <Route path="unauthorized" element={<Unauthorized />}></Route>

      {/* Protected Routes */}

      {/* Protected Routes for all Roles */}
      <Route
        element={
          <RequireAuth
            requiredRoles={[
              ROLES.Admin,
              ROLES.Manager,
              ROLES.FactoryWorker,
              ROLES.SuperAdmin,
            ]}
          />
        }
      >
        {/*First time login, without dashboard layout*/}
        <Route path="/resetpassword" element={<ProtectedRoute />}>
          <Route path="/resetpassword" element={<ResetPassword />} />
        </Route>

        <Route element={<DashboardLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />}></Route>

          {/* Protected Routes for Admin Specifically */}
          <Route
            element={
              <RequireAuth requiredRoles={[ROLES.Admin, ROLES.SuperAdmin]} />
            }
          >
            {/* Worker Management */}
            <Route
              path="workermanagement"
              element={<WorkerManagement />}
            ></Route>
            {/* Business Relations */}
            <Route
              path="businessrelations"
              element={<BusinessRelations />}
            ></Route>
          </Route>

          {/* Protected Routes for Manager*/}
          <Route
            element={
              <RequireAuth requiredRoles={[ROLES.Manager, ROLES.SuperAdmin]} />
            }
          >
            {/* Product Management */}
            <Route
              path="raw-materials"
              element={<Products type="raw-materials" key={1} />}
            ></Route>
            <Route
              path="final-goods"
              element={<Products type="final-goods" key={2} />}
            ></Route>

            {/* Procurement Forecast */}
            <Route
              path="procurement/forecast"
              element={<ProcurementForecast />}
            ></Route>
          </Route>

          {/* Protected Routes for Manager and Factory Worker */}
          <Route
            element={
              <RequireAuth
                requiredRoles={[
                  ROLES.Manager,
                  ROLES.FactoryWorker,
                  ROLES.SuperAdmin,
                ]}
              />
            }
          >
            {/* Procurement */}
            <Route path="procurement" element={<Procurement />}></Route>
            {/* Procurement Modules */}
            <Route
              path="procurement/sales-inquiry"
              element={<SalesInquiry />}
            ></Route>
            <Route path="procurement/quotation" element={<Quotation />}></Route>
            <Route
              path="procurement/purchase-order"
              element={<PurchaseOrder />}
            ></Route>
            <Route
              path="procurement/goodreceipt"
              element={<ProcurementGoodReceipt />}
            ></Route>

            {/* Inventory */}
            <Route path="inventory" element={<Inventory />}></Route>
            {/* Inventory Modules */}
            <Route path="inventory/warehouse" element={<Warehouse />}></Route>
            <Route path="inventory/bin" element={<Bin />}></Route>
          </Route>
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<NotFound />}></Route>
    </Route>
  </Routes>
);

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {routes}
    </LocalizationProvider>
  );
};

export default App;
