import { Navigate } from 'react-router-dom';

import type { UserRole } from '../features/login/types';
import { useAuthSession } from '../features/login/hooks/use-auth-session';
import { ROUTES } from '../constants/routes';
interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RequireRole({ children, allowedRoles }: Props) {
  const { user } = useAuthSession();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ERROR.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}
