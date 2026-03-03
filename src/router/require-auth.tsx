import { Navigate, Outlet } from 'react-router-dom';

import { authService } from '../services/auth.service';
import { ROUTES } from '../constants/routes';

export default function RequireAuth() {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
}
