import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../features/auth/pages/login-page';

import RequireAuth from './require-auth';
import RequireRole from './require-role';

const ProjectsPage = () => <div>Projects</div>;
const AdminPage = () => <div>Admin Only</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
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
    path: '/projects',
    element: (
      <RequireAuth>
        <ProjectsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={['admin']}>
          <AdminPage />
        </RequireRole>
      </RequireAuth>
    ),
  },
]);
