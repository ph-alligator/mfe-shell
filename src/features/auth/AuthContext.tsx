import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ShellSession, ShellUser } from '@org/mfe-contracts';

interface AuthContextValue {
  session: ShellSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: ShellUser = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ShellSession | null>(() => {
    const stored = sessionStorage.getItem('mfe-shell-session');
    return stored ? (JSON.parse(stored) as ShellSession) : null;
  });

  const login = useCallback(async (email: string, _password: string) => {
    const next: ShellSession = {
      user: { ...DEMO_USER, email },
      accessToken: 'demo-token',
    };
    sessionStorage.setItem('mfe-shell-session', JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('mfe-shell-session');
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, login, logout }),
    [session, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
