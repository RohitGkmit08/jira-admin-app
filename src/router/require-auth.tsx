import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const user = localStorage.getItem('user');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
