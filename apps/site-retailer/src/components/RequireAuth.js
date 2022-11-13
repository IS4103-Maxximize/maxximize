import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ requiredRoles }) => {
  const isAuth = useAuth();
  const location = useLocation();

  const roleOfUser = JSON.parse(isAuth)?.role ?? null;

  const isAuthorized = requiredRoles.includes(roleOfUser);

  return (
    <>
      {isAuth && isAuthorized && <Outlet />}
      {isAuth && !isAuthorized && (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      )}
      {!isAuth && (
        <Navigate
          to="/organisationselection"
          state={{ from: location }}
          replace
        />
      )}
    </>
  );
};

export default RequireAuth;
