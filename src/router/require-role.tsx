import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import { authService } from '../services/auth.service';

type RequireRoleProps = {
  allowedRoles: string[];
};

export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const token = authService.getToken();
  const user = authService.getUser();

  if (!token || !user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ERROR.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};
