import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@org/ui';

interface Props {
  children: ReactNode;
  remoteName: string;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class RemoteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.remoteName}]`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Failed to load {this.props.remoteName}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{this.state.message}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
