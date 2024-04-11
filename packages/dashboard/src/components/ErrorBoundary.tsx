import { Component, type ErrorInfo, type ReactNode } from 'react';

export type Props = {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  renderError: (error: Error) => JSX.Element;
};

export type State = {
  error?: Error;
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return {
      error,
      hasError: true,
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;

    if (onError) {
      onError(error, errorInfo);
    }
  }

  render() {
    const { children, renderError } = this.props;
    const { error, hasError } = this.state;

    if (hasError) {
      return renderError(error!);
    }

    return children;
  }
}
