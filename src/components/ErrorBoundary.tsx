import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-mint p-4">
          <div className="text-center max-w-md bg-white border-2 border-soft-mint rounded-2xl p-8 shadow-lg">
            <h1 className="text-2xl font-heading text-primary-dark mb-3">Something went wrong</h1>
            <p className="text-dark-green mb-6 font-body">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary btn-ripple"
            >
              Reload Page
            </button>
            <div className="mt-4">
              <a href="/" className="text-accent-green hover:text-primary-green font-body text-sm">
                Back Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
