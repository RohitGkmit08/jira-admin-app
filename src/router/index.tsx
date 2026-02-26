import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../features/login/pages';
import ProjectsPage from '../features/projects/pages/projects-page';
import ProjectDetailsPage from '../features/projects/pages/project-details-page';
import AppLayout from '../components/layout/app-layout';

import RequireAuth from './require-auth';
import RequireRole from './require-role';

const AdminPage = () => <div>Admin Only</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/projects" replace />,
  },

  {
    path: '/login',
    element: <LoginPage />,
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
