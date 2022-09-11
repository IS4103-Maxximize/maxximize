import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard-layout';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import NotFound from './pages/404';
import Dashboard from './pages/dashboard';
import FinalGoods from './pages/final-goods';
import Login from './pages/login';
import OrganisationSelection from './pages/organisationSelection';
import Procurement from './pages/procurement';
import ProcurementForecast from './pages/procurement/forecast';
import ProcurementOrdering from './pages/procurement/ordering';
import ProcurementReceiving from './pages/procurement/receiving';
import RawMaterials from './pages/raw-materials';
import WorkerManagement from './pages/workermanagement';

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
        {/* <Route path="unauthorized" element={<Unauthorized />}></Route> */}

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />}></Route>

            {/* Product Management */}
            {/* <Route path="products" element={<Products />}></Route> */}
            <Route path="raw-materials" element={<RawMaterials />}></Route>
            <Route path="final-goods" element={<FinalGoods />}></Route>

            {/* Worker Management */}
            <Route
              path="workermanagement"
              element={<WorkerManagement />}
            ></Route>

            {/* Procurement */}
            <Route path="procurement" element={<Procurement />}></Route>
            {/* Procurement Modules */}
            <Route
              path="procurement/ordering"
              element={<ProcurementOrdering />}
            ></Route>
            <Route
              path="procurement/receiving"
              element={<ProcurementReceiving />}
            ></Route>
            <Route
              path="procurement/forecast"
              element={<ProcurementForecast />}
            ></Route>
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
