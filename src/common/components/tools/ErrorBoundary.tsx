/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(_error: any) {
    // NOTE: Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(_error: any, _errorInfo: any) {
    // NOTE: You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }
  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // NOTE: You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }
    // @ts-ignore
    return this.props.children
  }
}
