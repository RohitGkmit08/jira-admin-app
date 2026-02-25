import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../features/login/pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
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
