import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import type { UserRole } from '../features/login/types/auth-user.types';
type Props = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

export default function RequireRole({ children, allowedRoles }: Props) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.APP.PROJECTS} replace />;
  }

  return <>{children}</>;
}