import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
        <p>Loading role access...</p>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;