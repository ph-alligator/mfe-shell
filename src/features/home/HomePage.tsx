import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@org/ui';
import { REMOTE_REGISTRY } from '../../remotes/registry.generated';

export function HomePage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to the Micro Frontend Shell
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Host application — remotes are auto-discovered from the workspace and
          loaded via Module Federation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REMOTE_REGISTRY.map((remote) => (
          <Card key={remote.name}>
            <CardHeader>
              <CardTitle>{remote.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                <code>{remote.packageDir}</code> · port {remote.port}
              </p>
              <Link to={remote.route}>
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  Open {remote.label}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
