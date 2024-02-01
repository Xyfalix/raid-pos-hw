import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  user,
  requiredRole,
  redirectPath = '/login',
  children,
}) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // The user's role does not match the required role
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};