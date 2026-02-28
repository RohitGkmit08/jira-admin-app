import { Navigate, Outlet } from 'react-router-dom';

import { authService } from '../services/auth.service';

export default function RequireAuth() {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
