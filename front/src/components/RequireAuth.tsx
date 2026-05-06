import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { authService } from "../services/authService";

interface Props {
  children: ReactNode;
}

function RequireAuth({ children }: Props) {
  const location = useLocation();
  const isAuthenticated =
    authService.isAuthenticated() && authService.getCurrentUser() !== null;

  if (!isAuthenticated) {
    // On stocke la page demandée pour y retourner après connexion
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;