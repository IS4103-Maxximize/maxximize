import { Navigate, Outlet } from 'react-router-dom';

const ProtectedPublicRoute = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return !user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedPublicRoute;
