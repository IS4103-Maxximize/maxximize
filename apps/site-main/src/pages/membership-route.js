import { Navigate, Outlet } from 'react-router-dom';

const MembershipRoute = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Show pricing table if no membership or inactive membership
  if (!user.organisation.membership || user.organisation.membership?.status === 'inactive') {
    return <Navigate to="/pricing" />;
  }

  return <Outlet />;
};

export default MembershipRoute;
