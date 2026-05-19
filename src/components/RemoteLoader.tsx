import { Suspense, type ReactNode } from 'react';

export function RemoteLoader({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          Loading remote…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
