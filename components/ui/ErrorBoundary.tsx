import React, { Component, ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="border border-red-200 bg-red-50/10 backdrop-blur-xl rounded-2xl p-6 text-center">
          <div className="text-red-600 mb-4">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm opacity-80">
              We encountered an unexpected error. Please try again.
            </p>
          </div>
          <Button 
            onClick={this.handleRetry}
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20"
          >
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export function BookingErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="border border-red-200 bg-red-50/10 backdrop-blur-xl rounded-2xl p-6 text-center">
          <div className="text-red-600 mb-4">
            <h2 className="text-lg font-semibold mb-2">Booking Error</h2>
            <p className="text-sm opacity-80">
              There was an issue with the booking process. Please refresh the page and try again.
            </p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20"
          >
            Refresh Page
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function SuiteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="border border-red-200 bg-red-50/10 backdrop-blur-xl rounded-2xl p-4 text-center">
          <div className="text-red-600 text-sm">
            Failed to load suite information
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}