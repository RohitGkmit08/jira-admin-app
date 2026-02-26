import { createBrowserRouter } from 'react-router-dom';

import LoginPage from '../features/login/pages';
import ProjectsPage from '../features/projects/pages/projects-page';
import { ProjectDetailsPage } from '../features/projects';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/projects',
    element: <ProjectsPage />,
  },
  {
    path: '/projects/:projectId',
    element: <ProjectDetailsPage />,
  },
]);
