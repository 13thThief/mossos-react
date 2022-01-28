import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex justify-center items-center">
          <div className="">
            <h1>Something went wrong. Try refreshing or go <a className="underline" href='/'>home</a></h1>
          </div>
        </div>
      )
    }
    return this.props.children;
  }
}