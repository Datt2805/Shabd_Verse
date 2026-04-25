import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  // If specific roles are required, check access
  if (roles && !roles.includes(user.role)) {
    return <div className="page"><h1>Access Denied</h1><p>You don't have permission to view this page.</p></div>;
  }

  return children;
};

export default PrivateRoute;
