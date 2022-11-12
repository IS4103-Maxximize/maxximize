import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return !user.passwordChanged ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
