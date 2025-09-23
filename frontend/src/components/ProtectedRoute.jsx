import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { admin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!admin) {
    // Redirect to admin login, but remember where they wanted to go
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;