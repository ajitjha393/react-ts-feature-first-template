import React, { ReactElement, ReactNode } from 'react';
import { logger } from '@/lib/logging/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    logger.exception(error, { boundary: 'ErrorBoundary' });
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-red-600">Something went wrong</h1>
            <p className="mb-4 text-gray-600">An unexpected error occurred. Please refresh the page.</p>
            {import.meta.env.DEV && (
              <details className="mt-4 rounded bg-white p-4 text-left">
                <summary className="cursor-pointer font-mono text-sm text-red-600">
                  Error details
                </summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-6"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as ReactElement;
  }
}
