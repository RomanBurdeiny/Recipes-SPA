import { Navigate } from 'react-router-dom';
import Loader from '../../pages/Loader/Loader';
import useAuth from '../../hooks/useAuth';
import { type ProtectedRouteProps } from '../ProtectedRoute/ProtectedRouteProps';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  accessAuth = true,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  const isAuth = accessAuth ? isAuthenticated : !isAuthenticated;
  return isAuth ? <>{children}</> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
