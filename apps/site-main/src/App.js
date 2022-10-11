import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard-layout';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import NotFound from './pages/404';
import MachineManagement from './pages/assetManagement/machineManagement';
import ProductionLineManagement from './pages/assetManagement/productionLineManagement';
import BusinessRelations from './pages/businessRelations';
import Dashboard from './pages/dashboard';
import ForgotPassword from './pages/forgotPassword';
import ReceivedPurchaseOrder from './pages/fulfilment/received-purchase-order';
import ReceivedSalesInquiry from './pages/fulfilment/received-sales-inquiry';
import SentQuotation from './pages/fulfilment/sent-quotation';
// import Inventory from './pages/inventory';
import Bin from './pages/inventory/bin';
import BinDetails from './pages/inventory/bin-details';
import Masterlist from './pages/inventory/masterlist';
import MasterlistLineItems from './pages/inventory/masterlist-line-items';
import Warehouse from './pages/inventory/warehouse';
import Login from './pages/login';
import OrganisationSelection from './pages/organisationSelection';
import ProcurementForecast from './pages/procurement/forecast';
import ProcurementGoodsReceipt from './pages/procurement/goods-receipt';
import PurchaseOrder from './pages/procurement/purchase-order';
import PurchaseRequisition from './pages/procurement/purchase-requisition';
import Quotation from './pages/procurement/quotation';
import SalesInquiry from './pages/procurement/sales-inquiry';
import BillOfMaterial from './pages/production/bom';
import ProductionOrder from './pages/production/production-order';
import Products from './pages/products';
import ProtectedPublicRoute from './pages/protectedPublicRoute';
import ProtectedRoute from './pages/protectedRoute';
import QAChecklists from './pages/qaChecklists';
import QARules from './pages/qaRules';
import ResetPassword from './pages/resetpassword';
import Unauthorized from './pages/unauthorized';
import WorkerManagement from './pages/workermanagement';

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
              path="products/raw-materials"
              element={<Products type="raw-materials" key={1} />}
            ></Route>
            <Route
              path="products/final-goods"
              element={<Products type="final-goods" key={2} />}
            ></Route>

            {/* Procurement Forecast */}
            <Route
              path="procurement/forecast"
              element={<ProcurementForecast />}
            ></Route>
            {/* Quality Assurance */}
            <Route path="quality-assurance/rules" element={<QARules />}></Route>
            <Route
              path="quality-assurance/checklists"
              element={<QAChecklists />}
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
            {/* Procurement Modules */}
            <Route
              path="procurement/purchase-requisition"
              element={<PurchaseRequisition />}
            ></Route>
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
              path="procurement/goods-receipt"
              element={<ProcurementGoodsReceipt />}
            ></Route>

            {/* Asset Management */}
            {/* TBD */}

            {/* Production */}
            {/* Production Modules */}
            <Route
              path="production/bill-of-material"
              element={<BillOfMaterial />}
            ></Route>
            <Route
              path="production/machine"
              element={<MachineManagement />}
            ></Route>
            <Route
              path="production/production-line"
              element={<ProductionLineManagement />}
            ></Route>
            <Route
              path="production/production-order"
              element={<ProductionOrder />}
            ></Route>

            {/* Inventory */}
            {/* Inventory Modules */}
            <Route path="inventory/warehouse" element={<Warehouse />}></Route>
            <Route path="inventory/warehouse/bin" element={<Bin />}></Route>
            <Route
              path="inventory/warehouse/bin/details"
              element={<BinDetails />}
            ></Route>
            <Route path="inventory/masterlist" element={<Masterlist />}></Route>
            <Route
              path="inventory/masterlist/lineItems"
              element={<MasterlistLineItems />}
            ></Route>

            {/* Fulfilment */}
            {/* Fulfilment Modules */}
            <Route
              path="fulfilment/received-sales-inquiry"
              element={<ReceivedSalesInquiry />}
            ></Route>
            <Route
              path="fulfilment/sent-quotation"
              element={<SentQuotation />}
            ></Route>
            <Route
              path="fulfilment/received-purchase-order"
              element={<ReceivedPurchaseOrder />}
            ></Route>
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
