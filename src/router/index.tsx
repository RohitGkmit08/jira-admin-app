import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../features/login/pages';
import AppLayout from '../components/layout/app-layout';

import RequireAuth from './require-auth';
import RequireRole from './require-role';

const ProjectsPage = () => <div>Projects</div>;
const AdminPage = () => <div>Admin Only</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/projects" replace />,
  },

  // Public
  {
    path: '/login',
    element: localStorage.getItem('user') ? (
      <Navigate to="/projects" replace />
    ) : (
      <LoginPage />
    ),
  },

  // Protected
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
