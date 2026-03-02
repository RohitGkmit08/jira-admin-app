import { Navigate } from 'react-router-dom';

import type { UserRole, AuthUser } from '../features/login/types/auth-user.types';
import { ROUTES } from '../constants/routes';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RequireRole({ children, allowedRoles }: Props) {
  const user: AuthUser | null = JSON.parse(
    localStorage.getItem('user') || 'null',
  );

  if (!user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.APP.PROJECTS} replace />;
  }

  return <>{children}</>;
}