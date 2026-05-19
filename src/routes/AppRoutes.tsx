import { Route, Routes } from 'react-router-dom';
import { SHELL_ROUTES } from '@org/mfe-contracts';
import { REMOTE_REGISTRY } from '../remotes/registry.generated';
import { ShellLayout } from '../layout/ShellLayout';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { LoginPage } from '../features/auth/LoginPage';
import { HomePage } from '../features/home/HomePage';
import { RemoteErrorBoundary } from '../components/RemoteErrorBoundary';
import { RemoteLoader } from '../components/RemoteLoader';
import { RemoteApp } from '../remotes/RemoteApp';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={SHELL_ROUTES.LOGIN} element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <ShellLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        {REMOTE_REGISTRY.map((remote) => (
          <Route
            key={remote.name}
            path={`${remote.route}/*`}
            element={
              <RemoteErrorBoundary remoteName={remote.name}>
                <RemoteLoader>
                  <RemoteApp name={remote.name} />
                </RemoteLoader>
              </RemoteErrorBoundary>
            }
          />
        ))}
      </Route>
    </Routes>
  );
}
