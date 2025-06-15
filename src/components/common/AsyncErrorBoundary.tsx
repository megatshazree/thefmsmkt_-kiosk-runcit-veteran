import React, { Component, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void; retry: () => void }>;
}

interface State {
  error: Error | null;
  retryCount: number;
}

// Specialized error boundary for async operations
export class AsyncErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('AsyncErrorBoundary caught an error:', error);
  }

  private retry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        error: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  private resetError = () => {
    this.setState({
      error: null,
      retryCount: 0,
    });
  };

  public render() {
    if (this.state.error) {
      const FallbackComponent = this.props.fallback || AsyncErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          retry={this.retry}
        />
      );
    }

    return this.props.children;
  }
}

// Default fallback for async errors
const AsyncErrorFallback: React.FC<{
  error: Error;
  resetError: () => void;
  retry: () => void;
}> = ({ error, resetError, retry }) => {
  const isNetworkError = error.message.toLowerCase().includes('network') || 
                         error.message.toLowerCase().includes('fetch');
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">
        {isNetworkError ? (
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isNetworkError ? 'Connection Problem' : 'Something Went Wrong'}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {isNetworkError 
          ? 'Unable to connect to the server. Please check your internet connection and try again.'
          : 'An error occurred while loading this content. You can try again or go back.'
        }
      </p>
      
      <div className="space-x-3">
        <button
          onClick={retry}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Try Again
        </button>
        
        <button
          onClick={resetError}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AsyncErrorBoundary;
