/**
 * Enhanced Error Boundary - Premium Error Handling
 * Apple/Porsche level error recovery with detailed logging
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Boundary caught an error:", error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });

    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 space-y-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              <p className="text-sm text-muted-foreground">
                Error count: {this.state.errorCount}
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 p-4 bg-muted/30 rounded-lg">
                <summary className="cursor-pointer font-medium text-sm mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 overflow-x-auto">{this.state.error.toString()}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={this.handleReset}
                className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              If this problem persists, please contact support.
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for programmatic error handling
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
