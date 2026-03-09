import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../features/login/pages';
import { ProjectsPage } from '../features/projects';
import { ProjectDetailsPage } from '../features/projects';
import AdminDashboard from '../features/admin/dashboard';
import Layout from '../components/layout';
import { ROUTES } from '../constants/routes';

import RequireAuth from './private-route';
import RequireRole from './require-role';

export const router = createBrowserRouter([
  {
    path: ROUTES.APP.ROOT,
    element: <Navigate to={ROUTES.APP.PROJECTS} replace />,
  },

  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: ROUTES.APP.PROJECTS,
            element: <ProjectsPage />,
          },
          {
            path: ROUTES.APP.PROJECT_DETAILS,
            element: <ProjectDetailsPage />,
          },
          {
            path: ROUTES.ADMIN.ROOT,
            element: (
              <RequireRole allowedRoles={['admin']}>
                <AdminDashboard />
              </RequireRole>
            ),
          },
        ],
      },
    ],
  },
]);
