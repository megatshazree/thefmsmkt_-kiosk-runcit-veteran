import React, { Component, ErrorInfo, ReactNode } from 'react';
import { config } from '../../config/environment';

// Mock translation function for error boundary
const useLanguage = () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'error_boundary_title': 'Something went wrong',
      'error_boundary_message': 'An unexpected error occurred. Please try again.',
      'error_boundary_details': 'Error Details (Development Only)',
      'error_boundary_retry': 'Try Again',
      'error_boundary_reload': 'Reload Page',
      'error_boundary_home': 'Go to Dashboard'
    };
    return translations[key] || key;
  }
});

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('error_boundary_title') || 'Something went wrong'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('error_boundary_message') || 'An unexpected error occurred. Please try again.'}
          </p>
          
          {config.app.environment === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-500">
                {t('error_boundary_details') || 'Error Details (Development Only)'}
              </summary>
              <pre className="mt-2 text-xs bg-red-50 p-3 rounded border overflow-auto max-h-32">
                {error.name}: {error.message}
                {error.stack && '\n\nStack Trace:\n' + error.stack}
              </pre>
            </details>
          )}
          
          <div className="mt-6 space-y-3">
            <button
              onClick={resetError}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('error_boundary_retry') || 'Try Again'}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('error_boundary_reload') || 'Reload Page'}
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full flex justify-center py-2 px-4 text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              {t('error_boundary_home') || 'Go to Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    if (config.app.environment === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.error('Production error logged:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) => {
  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return ComponentWithErrorBoundary;
};

export default ErrorBoundary;
