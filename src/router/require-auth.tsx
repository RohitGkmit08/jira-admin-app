import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function RequireAuth() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
}