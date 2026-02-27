import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ROUTES } from "../constants/routes"

import LoginPage from '../features/login/pages';
import AppLayout from '../components/layout/app-layout';

import RequireAuth from './require-auth';
import RequireRole from './require-role';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.APP.PROJECTS} replace />,
  },

  // Public
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },

  // Protected
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.APP.PROJECTS,
            element: <div>Projects Page</div>,
          },
          {
            path: `${ROUTES.APP.PROJECTS}/:projectId`,
            element: <div>Project Details Page</div>, // placeholder
          },
          {
            path: ROUTES.ADMIN.ROOT,
            element: (
              <RequireRole allowedRoles={['admin']}>
                <div>Admin Page</div>
              </RequireRole>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;