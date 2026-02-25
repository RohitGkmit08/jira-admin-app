import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../features/login/pages';
import AppLayout from '../components/layout/app-layout';
import ProjectsPage from '../features/projects/pages/projects-page';
import ProjectDetailsPage from '../features/projects/pages/project-details-page';

import RequireAuth from './require-auth';
import RequireRole from './require-role';

const AdminPage = () => <div>Admin Only</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/projects" replace />,
  },

  {
    path: '/login',
    element: localStorage.getItem('user') ? (
      <Navigate to="/projects" replace />
    ) : (
      <LoginPage />
    ),
  },

  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/projects',
            element: <ProjectsPage />,
          },
          {
            path: '/projects/:projectId',
            element: <ProjectDetailsPage />,
          },
          {
            path: '/admin',
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

export default router;
