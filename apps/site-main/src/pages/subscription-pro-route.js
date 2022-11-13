import { Navigate, Outlet, useLocation } from 'react-router-dom';

const SubscriptionProRoute = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation()

  if (user.organisation.membership.plan !== 'pro') {
    return <Navigate to="/unauthorized" state={{from: location}} replace/>;
  }

  return <Outlet />;
};

export default SubscriptionProRoute;
