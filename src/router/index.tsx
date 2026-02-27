import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../features/login/pages';
import { ProjectsPage } from '../features/projects';
import { ProjectDetailsPage } from '../features/projects';
import AppLayout from '../components/layout';
import { ROUTES } from '../constants/routes';

import RequireAuth from './require-auth';
import RequireRole from './require-role';

const AdminPage = () => <div>Admin Only</div>;

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
        element: <AppLayout />,
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
                <AdminPage />
              </RequireRole>
            ),
          },
        ],
      },
    ],
  },
]);
