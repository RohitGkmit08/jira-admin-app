import { Navigate } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const user = localStorage.getItem('user');

  if (!user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <>{children}</>;
}
