import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import LoginPage from '../features/login/pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/projects',
    element: <div>Projects Page</div>,
  },
]);

export default router;
