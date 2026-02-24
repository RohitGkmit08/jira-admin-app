import { createBrowserRouter } from 'react-router-dom';

// Temporary placeholders (these will be replaced later)
const LoginPage = () => <div>Login Page</div>;
const ProjectsPage = () => <div>Projects Page</div>;
const BoardPage = () => <div>Board Page</div>;

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
    path: '/projects/:id',
    element: <BoardPage />,
  },
]);
