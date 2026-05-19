import { Link } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ph-alligator/ui';
import { REMOTE_REGISTRY } from '../../remotes/registry.generated';

export function HomePage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to the Micro Frontend Shell
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Host application — remotes loaded via Module Federation. UI from{' '}
          <code>@ph-alligator/ui@0.2.0</code>
        </p>
      </div>

      <Alert>
        <AlertTitle>Design system connected</AlertTitle>
        <AlertDescription>
          Shell and remotes use published components from GitHub Packages.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="remotes">
        <TabsList>
          <TabsTrigger value="remotes">Remotes</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="remotes" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REMOTE_REGISTRY.map((remote) => (
              <Card key={remote.name}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{remote.label}</CardTitle>
                    <Badge>{remote.name}</Badge>
                  </div>
                  <CardDescription>
                    <code>{remote.packageDir}</code> · port {remote.port}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={remote.route}>
                    <Button type="button" variant="secondary" className="w-full sm:w-auto">
                      Open {remote.label}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="about" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform</CardTitle>
              <CardDescription>
                Shell repo + one repo per remote + npm packages for shared UI and types.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
