import { Navigate } from 'react-router-dom';

import type { UserRole } from '../features/login/types/auth-user.types';
import { useAuthSession } from '../features/login/hooks/use-auth-session';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RequireRole({ children, allowedRoles }: Props) {
  const { user } = useAuthSession();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
