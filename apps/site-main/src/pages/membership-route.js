import { Navigate, Outlet } from 'react-router-dom';

const MembershipRoute = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user.organisation.membership) {
    return <Navigate to="/pricing" />;
  }

  if (user.organisation.membership?.status !== 'active') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default MembershipRoute;
