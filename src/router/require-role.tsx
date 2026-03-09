import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import { authService } from '../services/auth.service';

type RequireRoleProps = {
  allowedRoles: string[];
};

const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const token = authService.getToken();

  if (!token) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const user = authService.getUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ERROR.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

export default RequireRole;
