import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Login from './pages/login';
import { DashboardLayout } from './components/dashboard-layout';
import Dashboard from './pages/dashboard';
import NotFound from './pages/404';
import RequireAuth from './components/RequireAuth';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="login" element={<Login />}></Route>
          {/* <Route path="unauthorized" element={<Unauthorized />}></Route> */}

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />}></Route>
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
};

export default App;