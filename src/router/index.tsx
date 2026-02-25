import { createBrowserRouter } from 'react-router-dom';

import LoginPage from '../features/login/pages';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;
