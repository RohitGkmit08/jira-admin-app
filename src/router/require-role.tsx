import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { authService } from '../services/auth.service';

type RequireRoleProps = {
  allowedRoles: string[];
};

export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const token = authService.getToken();

  if (!token) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const userRole = 'admin';

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.APP.PROJECTS} replace />;
  }

  return <Outlet />;
};