import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <App />
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)
