import { Navigate } from "react-router";
import { isAuthenticated } from "../services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
