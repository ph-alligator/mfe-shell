import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@org/ui';
import { SHELL_ROUTES } from '@org/mfe-contracts';
import { REMOTE_REGISTRY } from '../remotes/registry.generated';
import { useAuth } from '../features/auth/AuthContext';

const staticNav = [{ to: SHELL_ROUTES.HOME, label: 'Home' }];

export function ShellLayout() {
  const { session, logout } = useAuth();
  const location = useLocation();

  const nav = [
    ...staticNav,
    ...REMOTE_REGISTRY.map((r) => ({ to: r.route, label: r.label })),
  ];

  const linkClass = (to: string) => {
    const active =
      location.pathname === to ||
      (to !== SHELL_ROUTES.HOME && location.pathname.startsWith(to));
    return active
      ? 'rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground'
      : 'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground';
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-8">
            <span className="text-xl font-semibold tracking-tight">MFE Shell</span>
            <nav className="flex items-center gap-1">
              {nav.map(({ to, label }) => (
                <Link key={to} to={to} className={linkClass(to)}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {session.user.name}
                </span>
                <Button type="button" variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to={SHELL_ROUTES.LOGIN}>
                <Button type="button" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
