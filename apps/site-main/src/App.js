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
import ProcurementSalesInquiry from './pages/procurement/salesinquiry';
import ProcurementQuotation from './pages/procurement/quotation';
import ProcurementPurchaseOrder from './pages/procurement/purchaseorder';
import ProcurementGoodReceipt from './pages/procurement/goodreceipt';
import Products from './pages/products';
import WorkerManagement from './pages/workermanagement';
import BusinessRelations from './pages/businessRelations';

const ROLES = {
  Admin: 'admin',
  Manager: 'manager',
  FactoryWorker: 'factoryworker',
};

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
        <Route
          element={
            <RequireAuth
              requiredRoles={[ROLES.Admin, ROLES.Manager, ROLES.FactoryWorker]}
            />
          }
        >
          <Route element={<DashboardLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />}></Route>

            {/* Protected Routes for Admin Specifically */}
            <Route element={<RequireAuth requiredRoles={[ROLES.Admin]} />}>
              {/* Worker Management */}
              <Route
                path="workermanagement"
                element={<WorkerManagement />}
              ></Route>
              {/* Business Relations */}
              <Route path="businessrelations" element={<BusinessRelations />}></Route>
            </Route>

            {/* Protected Routes for Manager*/}
            <Route element={<RequireAuth requiredRoles={[ROLES.Manager]} />}>
              {/* Product Management */}
              <Route
                path="raw-materials"
                element={<Products type="raw-materials" />}
              ></Route>
              <Route
                path="final-goods"
                element={<Products type="final-goods" />}
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
                  requiredRoles={[ROLES.Manager, ROLES.FactoryWorker]}
                />
              }
            >
              {/* Procurement */}
              <Route path="procurement" element={<Procurement />}></Route>
              {/* Procurement Modules */}
              <Route
                path="procurement/salesinquiry"
                element={<ProcurementSalesInquiry />}
              ></Route>
              <Route
                path="procurement/quotation"
                element={<ProcurementQuotation />}
              ></Route>
              <Route
                path="procurement/purchaseorder"
                element={<ProcurementPurchaseOrder />}
              ></Route>
              <Route
                path="procurement/goodreceipt"
                element={<ProcurementGoodReceipt />}
              ></Route>
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
