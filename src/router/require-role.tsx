import { Navigate } from 'react-router-dom';

import { useAuthSession } from '../features/auth/hooks/use-auth-session';
import type { UserRole } from '../features/auth/types/auth-user.types';

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
