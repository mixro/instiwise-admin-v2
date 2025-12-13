import { Navigate } from 'react-router-dom';
import Layout from '../ui/layout/Layout';
import { useAuth } from '../../hooks/useAuth';


const ProtectedRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  
  // if (isLoading) return <div>Loading...</div>;

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;