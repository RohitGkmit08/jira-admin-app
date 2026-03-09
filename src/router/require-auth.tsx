import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import { authService } from '../services/auth.service';

export default function RequireAuth() {
  const token = authService.getToken();

  if (!token) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
}
