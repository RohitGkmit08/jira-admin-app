import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { ROUTES } from '../constants/routes';
import { authService } from '../services/auth.service';

type RequireRoleProps = {
  allowedRoles: string[];
  children: ReactNode;
};

const RequireRole = ({ allowedRoles, children }: RequireRoleProps) => {
  const token = authService.getToken();
  const user = authService.getUser();

  if (!token) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ERROR.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
