import { Navigate, useLocation } from 'react-router-dom';
import { SHELL_ROUTES } from '@org/mfe-contracts';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return (
      <Navigate to={SHELL_ROUTES.LOGIN} state={{ from: location }} replace />
    );
  }

  return children;
}
